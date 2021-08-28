import { Problem, ProblemWordId, Operator } from 'com.shockscript.sxc.parser';
import { Host, ScopeChain } from './model/symbol.js';

class SymbolSolverOptions {
	constructor() {
		this.allowDuplicates = false;
		this.foreign = null;
	}
}

export class SymbolSolver {
	constructor(options = null) {
		this.options = new SymbolSolverOptions;
		this.sdmHost = new Host;
		this.scopeChain = new ScopeChain;
		this.resolvedAst = new ResolvedAst;
		this.problems = [];
		this._invalidated = false;
		this._scriptStack = [];
		this._openedFunctions = [];
		this._openedFunction = null;

		options = options || {};
		this.options.allowDuplicates = !!options.allowDuplicates;
		this.options.foreign = options.foreign || null;

		this.sdmHost.init();
		let rootFrame = this.sdmHost.factory.frame();
		rootFrame.importModule(this.sdmHost.sxGlobalModule);
		this.scopeChain.enterFrame(rootFrame);
	}

	get invalidated() {
		return this._invalidated;
	}

	get currentScript() {
		return this._scriptStack[this._scriptStack.length - 1] || null;
	}

	get currentActivation() {
		return this._openedFunction != null ? this._openedFunction.activation : null;
	}

	reportSyntaxError(msgId, span, vars = null) {
		this.problems.push(new Problem(msgId, 'syntaxError', vars, span));
		this._invalidated = true;
	}
	reportVerifyError(msgId, span, vars = null) {
		this.problems.push(new Problem(msgId, 'verifyError', vars, span));
		this._invalidated = true;
	}
	warn(msgId, span, vars = null) {
		this.problems.push(new Problem(msgId, 'warning', vars, span));
	}

	enterScript(s) {
		this._scriptStack.push(s);
		this.resolvedAst.enterScript(s);
	}

	exitScript() {
		this._scriptStack.pop();
		this.resolvedAst.exitScript();
	}

	enterFunction(activation, methodSlot, commonNode) {
		let opened = new OpenedFunction(actvation, methodSlot, commonNode);
		this._openedFunctions.push(opened);
		this._openedFunction = opened;
	}

	exitFunction() {
		this._openedFunctions.pop();
		this._openedFunction = this._openedFunctions[this._openedFunctions.length - 1];
	}

	isResolved(node) {
		return this.resolvedAst.isResolved(node);
	}

	arrangeProblems(programNodes) {
		for (let problem of this.problems) {
			problem.span.script.collect(problem);
		}
		for (let program of programNodes) {
			this._arrangeSingleScriptProblems(program.script);
		}
	}

	_arrangeSingleScriptProblems(script) {
		script.sortProblemCollection();

		for (let subscript of script.includesScripts) {
			this._arrangeSingleScriptProblems(subscript);
		}
	}

	resolveReference(object, idNode, context, onlyTypeOrModule = false) {
		let reportError = context.reportConstExpErrors;
		if (object.valueType.isNullType) {
			if (reportError) {
				this.reportVerifyError('verifyErrors.cannotAccessPropertyOfNull', idNode.span);
			}
			return null;
		}
		let r = object.resolveName(idNode.name, onlyTypeOrModule) || object.resolveName(idNode.name, true);
		if (r == null) {
			if (reportError) {
				this.reportVerifyError('verifyErrors.undefinedPropertyThroughReference', idNode.span, { name: idNode.name, type: object.valueType });
			}
			return null;
		}
		else if (r.isAmbiguousReferenceError) {
			if (reportError) {
				this.reportVerifyError('verifyErrors.ambiguousReference', idNode.span, { name: idNode.name });
			}
			return null;
		}
		else if (!r.accessibleByFrame(this.scopeChain.currentFrame)) {
			if (reportError) {
				this.reportVerifyError('verifyErrors.inaccessiblePropertyThroughReference', idNode.span, { name: idNode.name, type: object.valueType });
			}
			return null;
		}

		while (r.isSymbolAlias) {
			r = r.escapeAlias();
		}

		if (r.isValue && r.valueType == null) {
			this.reportVerifyError('verifyErrors.failedToResolveStaticTypeOf', idNode.span, { name: idNode.name });
			return null;
		}

		return r;
	}

	resolveLexicalReference(idNode, context, onlyTypeOrModule = false) {
		let reportError = context.reportConstExpErrors;
		let r = this.scopeChain.resolveName(idNode.name, onlyTypeOrModule) || this.scopeChain.resolveName(idNode.name, true);
		r = r || this.sdmHost.getRootModule(idNode.name);
		if (r == null) {
			if (reportError) {
				this.reportVerifyError('verifyErrors.undefinedProperty', idNode.span, { name: idNode.name });
			}
			return null;
		}
		else if (r.isAmbiguousReferenceError) {
			if (reportError) {
				this.reportVerifyError('verifyErrors.ambiguousReference', idNode.span, { name: idNode.name });
			}
			return null;
		}
		else if (!r.accessibleByFrame(this.scopeChain.currentFrame)) {
			if (reportError) {
				this.reportVerifyError('verifyErrors.inaccessibleProperty', idNode.span, { name: idNode.name });
			}
			return null;
		}

		while (r.isSymbolAlias) {
			r = r.escapeAlias();
		}

		if (r.isValue && r.valueType == null) {
			this.reportVerifyError('verifyErrors.failedToResolveStaticTypeOf', idNode.span, { name: idNode.name });
			return null;
		}

		return r;
	}


}

class ResolvedAst {
	constructor() {
		this._currentScript = null;
		this._scriptStack = [];
		this._scriptToAstToSymbol = new Map;
		this._scriptToAstToBoolean = new Map;
		this._astToSymbol = null;
		this._astToBoolean = null;
	}

	enterScript(s) {
		this._currentScript = s;
		this._scriptStack.push(s);
		this._astToSymbol = this._scriptToAstToSymbol.get(s) || new Map;
		this._astToBoolean = this._scriptToAstToBoolean.get(s) || new Map;
		this._scriptToAstToSymbol.set(s, this._astToSymbol);
		this._scriptToAstToBoolean.set(s, this._astToBoolean);
	}

	exitScript() {
		this._scriptStack.pop();
		this._currentScript = this._scriptStack[this._scriptStack.length - 1];
		this._astToSymbol = this._scriptToAstToSymbol.get(this._currentScript);
		this._astToBoolean = this._scriptToAstToBoolean.get(this._currentScript);
	}

	symbolOf(node) {
		return this._astToSymbol == null ? null : this._astToSymbol.get(node);
	}

	resolve(node, symbol) {
		this._astToSymbol.set(node, symbol);
		this._astToBoolean.set(node, true);
	}

	remove(node) {
		this._astToSymbol.remove(node);
		this._astToBoolean.remove(node);
	}

	isResolved(node) {
		return !!this._astToBoolean.get(node);
	}
}

class Phase {
	constructor(value) {
		this._v = value;
		Phase._byValue.set(this._v, this);
	}

	static valueOf(v) {
		return Phase._byValue.get(v) || null;
	}

	valueOf() {
		return this._v;
	}
}

Phase._byValue = new Map;

Phase.DECLARATION_1 = new Phase(0);
Phase.DECLARATION_2 = new Phase(1);
Phase.DECLARATION_3 = new Phase(2);
Phase.DECLARATION_4 = new Phase(3);
Phase.INTERFACES = new Phase(4);
Phase.DECLARATION_5 = new Phase(5);
Phase.INTERFACE_OPERATORS = new Phase(6);
Phase.OMEGA = new Phase(7);

class PhaseDistributor {
	constructor(symbolSolver) {
		this.symbolSolver = symbolSolver;
		this.phase = Phase.DECLARATION_1;
	}

	get hasRemaining() {
		return this.phase != null;
	}

	nextPhase() {
		if (this.phase != null) {
			this.phase = Phase.valueOf(this.phase.valueOf() + 1);
		}
	}

	resolve(directives) {
		this.symbolSolver.resolveDirectives(directives, new Context().withPhase(this.phase));
	}
}

class Context {
	constructor() {
		this.flags = 0;
		this.phase = null;
		this.expectedType = null;
		this.reportConstExpErrors = true;
	}

	withFlags(flags) {
		this.flags = flags;
		return this;
	}

	withPhase(phase) {
		this.phase = phase;
		return this;
	}

	withExpectedType(t) {
		this.expectedType = t;
		return this;
	}

	clone() {
		let r = new Context().withPhase(phase);
		r.reportConstExpErrors = this.reportConstExpErrors;
		return r;
	}
}

const ContextFlags = {
	UPDATE_TARGET: 1,
	CALL_BASE_REFERENCE: 2,
};

class OpenedFunction {
	constructor(activation, methodSlot, commonNode) {
		this.activation = methodSlot ? methodSlot.activation : activation;
		this.methodSlot = methodSlot;
		this.commonNode = commonNode;
	}
}