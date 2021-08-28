import { Token, TokenInfo } from './lexer-token.js';

export class Problem {
	constructor(messageId, errorType, vars, span) {
		let k_Vars = vars;
		vars = {};
		if (k_Vars)
			for (let name in k_Vars)
				vars[name] = k_Vars[name];
		this.messageId = messageId;
		this.errorType = errorType;
		this.tolerable = errorType == 'warning';
		this._vars = vars;
		this.span = span;
	}

	get vars() {
		let r = {};
		for (let name in this._vars)
			r[name] = this._vars[name];
		return r;
	}

	get isError() {
		return this.errorType != 'warning';
	}
	get isSyntaxError() {
		return this.errorType == 'syntaxError';
	}
	get isVerifyError() {
		return this.errorType == 'verifyError';
	}
	get isSecurityError() {
		return this.errorType == 'securityError';
	}
	get isWarning() {
		return this.errorType == 'warning';
	}
}

export const ProblemErrorType = {
	WARNING: 'warning',
	SYNTAX_ERROR: 'syntaxError',
	VERIFY_ERROR: 'verifyError',
	SECURITY_ERROR: 'securityError',
}

export class ProblemWordId {
	constructor(id) {
		this.id = id;
		Object.freeze(this);
	}
}

export class ProblemFormatter {
	resolveMessageId(id) {
		if (id.slice(0, 13) == 'syntaxErrors.') {
			switch (id.slice(13)) {
				case 'empty': return 'Unexpected end of program.';
				case 'unexpectedCharacter': return 'Unexpected character: $charac.';
				case 'expectingBefore': return 'Expecting $what before $before.';
				case 'unexpectedBefore': return 'Unexpected $what before $before.';
				case 'words.lineBreak': return 'line break';
				case 'explicitParamsAfterOpt': return 'Explicit parameters cannot appear after optional parameters.';
				case 'unallowedHere': return '$what is unallowed here.';
				case 'functionMustContainBody': return 'Function must contain body.';
				case 'syntaxError': return 'Syntax error.';
				case 'expectedStatement': return 'Expected statement.';
				case 'modifierUnallowed': return 'Use of unallowed modifier $mod.';
				case 'functionMissingBody': return 'Function missing body.';
				case 'noExitTarget': return 'No exit target.';
				case 'noContinueTarget': return 'No continue target.';
			}
		}
		else if (id.slice(0, 13) == 'verifyErrors.') {
			switch (id.slice(13)) {
				case 'verifyError': return 'Verify error.';
				case 'cannotAccessPropertyOfNull': return 'Cannot access property of null.';
				case 'ambiguousReference': return 'Ambiguous reference to $name.';
				case 'undefinedProperty': return 'Access of undefined property $name.';
				case 'undefinedPropertyThroughReference': return 'Access of undefined property $name through reference with static type $type.';
				case 'inaccessibleProperty': return 'Attempted access of inaccessible property $name.';
				case 'inaccessiblePropertyThroughReference': return 'Attempted access of inaccessible property $name through reference with static type $type.';
				case 'failedToResolveStaticType': return 'Failed to resolve static type of $name.';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
			}
		}
		else if (id.slice(0, 9) == 'warnings.') {
			switch (id.slice(9)) {
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
				case '': return '';
			}
		}
		return '[Empty]';
	}

	format(problem) {
		let vars = {};
		for (let name in problem.vars)
			vars[name] = this.formatVar(problem.vars[name]);
		let msg = this.resolveMessageId(problem.messageId).replace(/\$(\$|[A-Za-z_][A-Za-z_0-9]*)/g, (_, s) => s == '$' ? '$' : vars[s]);
		return (problem.errorType.slice(0, 1).toUpperCase() + problem.errorType.slice(1) + ": ") + msg.slice(0, 1).toUpperCase() + msg.slice(1) + " (At " + problem.span.script.path + ":" + problem.span.firstLine + ":" + (problem.span.firstColumn + 1) + ")";
	}

	formatVar(v) {
		if (v instanceof ProblemWordId)
			return resolveMessageId(v.id);
		else if (typeof v == 'number') {
			switch (v) {
				case Token.EMPTY: return 'end of program';
				case Token.IDENTIFIER: return 'identifier';
				case Token.STRING_LITERAL: return 'string literal';
				case Token.NUMERIC_LITERAL: return 'numeric literal';
				case Token.LONG_LITERAL: return 'long literal';
				case Token.BOOLEAN_LITERAL: return 'boolean literal';
				case Token.ASSIGNMENT_OR_EQUALS: return '=';
				case Token.LPAREN: return '(';
				case Token.RPAREN: return ')';
				case Token.LBRACE: return '{';
				case Token.RBRACE: return '}';
				case Token.COLON: return ':';
				case Token.DOT: return '.';
				case Token.ELLIPSIS: return '...';
				case Token.COMMA: return ',';
				case Token.QMARK: return '?';
				case Token.AMP: return '&';
				case Token.UNDERSCORE: return '_';
				case Token.HASH: return '#';
				default: '';
			}
		}
		else if (v instanceof TokenInfo) {
			if (v.type == Token.KEYWORD)
				return v.stringValue;
			if (v.type == Token.OPERATOR)
				return v.operator.toString();
			if (v.type == Token.COMPOUND_ASSIGNMENT)
				return v.operator.toString() + '=';
			return this.formatVar(v.type);
		}
		return v.toString();
	}
}