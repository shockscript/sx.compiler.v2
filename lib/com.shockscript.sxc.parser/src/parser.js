import { TokenInfo, Token } from './lexer-token.js';
import { Script, Span } from './source-objects.js';
import { Problem, ProblemWordId } from './problem.js';
import Operator from './operator.js';
import { Lexer } from './lexer.js';
import * as AST from './ast.js';
import * as FileSystem from 'fs';
import * as Path from 'path';

export default class Parser {
	constructor(argument) {
		this._subparser = null;
		this._lexer = null;
		let script = null;
		if (typeof argument == 'string')
			script = new Script('Anonymous.sx', argument);
		else if (argument instanceof Lexer)
			this._lexer = argument,
			script = argument.reflectScript();
		else if (argument instanceof Script)
			script = argument;
		else throw new Error("Argument must be a Script object.");
		this._lexer = this._lexer || new Lexer(script);
		try {
			this._lexer.scan();
		}
		catch (p) {
		}
		this._subparser = new Subparser(this._lexer);
	}

	reflectScript() {
		return this._lexer.reflectScript();
	}
	reflectLexer() {
		return this._lexer;
	}

	parseProgram() {
		this._subparser.clear();
		let program = null;
		try {
			program = this._subparser.parseBlock(new DefaultProgramContext, this._subparser.getTokenSpan());
		}
		catch (error) {
			if (!(error instanceof Problem))
				throw error;
		}
		return this.reflectScript().isValid ? program : null;
	}

	parseTypeExpression() {
		this._subparser.clear();
		let e = null;
		try {
			e = this._subparser.parseTypeExpression();
		}
		catch (error) {
			if (!(error instanceof Problem))
				throw error;
		}
		return this.reflectScript().isValid ? e : null;
 	}
}

const annotatableDeclKeywords = (new Set)
	.add('async')
	.add('class')
	.add('enum')
	.add('function')
	.add('interface')
	.add('internal')
	.add('module')
	.add('namespace')
	.add('native')
	.add('notinheritable')
	.add('notoverridable')
	.add('operator')
	.add('overrides')
	.add('private')
	.add('property')
	.add('protected')
	.add('public')
	.add('readonly')
	.add('shared')
	.add('structure')
	.add('sub')
	.add('typealias');

const annotatableDeclModifiers = (new Set)
	.add('async')
	.add('internal')
	.add('native')
	.add('notinheritable')
	.add('notoverridable')
	.add('overrides')
	.add('private')
	.add('protected')
	.add('public')
	.add('readonly')
	.add('shared');

class Subparser {
	constructor(lexer) {
		this.lexer = lexer;
		this.script = lexer.reflectScript();
		this.token = lexer.token;
		this.previousToken = new TokenInfo;
		this.locations = [];
		this.generatorStack = [];
		this.asyncStack = [];
        /**
         * Result after parsing a statement.
         */
		this.statementSeparated = false;
        /**
         * Result of the methods `filterUnaryOperator()` and `filterBinaryOperator()`.
         */
		this.nextPrecedence = null;
        /*
         * Result of the methods `filterUnaryOperator()` and `filterBinaryOperator()`,
         * also assigned manually in short regions of the code.
         */
		this.filteredOperator = null;
	}

	clear() {
		this.locations.length = 0;
		this.generatorStack.length = 0;
	}

	markLocation(span = null) {
		this.locations.push(span ? span.start : this.token.start, span ? span.firstLine : this.token.firstLine);
	}
	popLocation() {
		let firstLine = this.locations.pop();
		let start = this.locations.pop();
		return Span.indexesAndLines(this.script, start, this.previousToken.end, firstLine, this.previousToken.lastLine);
	}
	duplicateLocation() {
		this.locations.push(this.locations[this.locations.length - 2], this.locations[this.locations.length - 1]);
	}

	finishNode(node) {
		node.span = this.popLocation();
	}

	get functionIsGenerator() {
		return !!this.generatorStack[this.generatorStack.length - 1];
	}
	set functionIsGenerator(value) {
		this.generatorStack[this.generatorStack.length - 1] = !!value;
	}

	get functionIsAsync() {
		return !!this.asyncStack[this.asyncStack.length - 1];
	}

	getTokenSpan() {
		return Span.indexesAndLines(this.script, this.token.start, this.token.end, this.token.firstLine, this.token.lastLine);
	}

	reportSyntaxError(msgId, span, vars = null) {
		return this.script.collect(new Problem(msgId, 'syntaxError', vars, span));
	}
	reportVerifyError(msgId, span, vars = null) {
		return this.script.collect(new Problem(msgId, 'verifyError', vars, span));
	}
	warn(msgId, span, vars = null) {
		return this.script.collect(new Problem(msgId, 'warning', vars, span));
	}

	nextToken() {
		this.previousToken.assign(this.token);
		this.lexer.scan();
	}
	consume(tokenType) {
		if (this.token.type == tokenType) {
			this.nextToken();
			return true;
		}
		return false;
	}
	consumeIdentifier(orKeyword = false) {
		if (this.token.type == Token.IDENTIFIER || (orKeyword ? this.token.type == Token.KEYWORD : false)) {
			let r = this.token.stringValue;
			this.nextToken();
			return r;
		}
		return null;
	}
	consumeKeyword(name) {
		if (this.token.isKeyword(name)) {
			this.nextToken();
			return true;
		}
		return false;
	}
	consumeContextKeyword(name) {
		if (this.token.isContextKeyword(name)) {
			this.nextToken();
			return true;
		}
		return false;
	}
	consumeOperator(type) {
		if (this.token.isOperator(type)) {
			this.nextToken();
			return true;
		}
		return false;
	}

	expect(tokenType) {
		if (this.token.type == tokenType) {
			this.nextToken();
			return null;
		}
		else {
			let p = this.reportSyntaxError('syntaxErrors.expectingBefore', this.getTokenSpan(), { what: tokenType, before: this.token.type });
			this.nextToken();
			return p;
		}
	}
	expectIdentifier(orKeyword = false) {
		if (this.token.type == Token.IDENTIFIER || (orKeyword ? this.token.type == Token.KEYWORD : false)) {
			let s = this.token.stringValue;
			this.nextToken();
			return s;
		}
		else throw this.expect(Token.IDENTIFIER);
	}
	expectKeyword(name) {
		if (this.token.isKeyword(name)) {
			this.nextToken();
			return null;
		}
		else return this.reportSyntaxError('syntaxErrors.expectingBefore', this.getTokenSpan(), { what: '"' + name + '"', before: this.token.type });
	}
	expectContextKeyword(name) {
		if (this.token.isContextKeyword(name)) {
			this.nextToken();
			return null;
		}
		else return this.reportSyntaxError('syntaxErrors.expectingBefore', this.getTokenSpan(), { what: '"' + name + '"', before: this.token.type });
	}
	expectOperator(type) {
		if (this.token.isOperator(type)) {
			this.nextToken();
			return null;
		}
		else return this.reportSyntaxError('syntaxErrors.expectingBefore', this.getTokenSpan(), { what: type.toString(), before: this.token.type });
	}

	get lineBreak() {
		return this.previousToken.lastLine != this.token.firstLine;
	}

	invalidateLineBreak() {
 		if (this.lineBreak)
			this.reportSyntaxError('syntaxErrors.unexpectedBefore', this.getTokenSpan(), { what: new ProblemWordId('syntaxErrors.words.lineBreak'), before: this.token.type });
	}

	inlineOrHigherIndent(baseNode) {
		let baseSpan = baseNode instanceof AST.Node ? baseNode.span : baseNode;
		return !this.lineBreak || this.script.getLineIndent(baseSpan.firstLine) < this.script.getLineIndent(this.token.firstLine);
	}

	atHigherIndent(baseNode) {
		let baseSpan = baseNode instanceof AST.Node ? baseNode.span : baseNode;
		return this.script.getLineIndent(baseSpan.firstLine) < this.script.getLineIndent(this.token.firstLine);
	}

	get atAnnotatableDeclStart() {
		if (this.token.type == Token.KEYWORD) {
			return annotatableDeclKeywords.has(this.token.stringValue);
		} else {
			return this.token.isOperator(Operator.LT);
		}
	}

	parseTypeExpression() {
		let r = null;
		this.markLocation();
		let s = this.consumeIdentifier();
		if (s)
			r = new AST.Ident(s);
		else if (this.consumeKeyword('nothing'))
			r = new AST.NothingLtr;
		else if (this.consumeKeyword('empty'))
			r = new AST.EmptyLtr;
		else if (this.consumeKeyword('null'))
			r = new AST.NullLtr;
		else if (this.consume(Token.LPAREN)) {
			let elements = [];
			do
				elements.push(this.parseTypeExpression());
			while (this.consume(Token.COMMA));
			this.expect(Token.RPAREN);
			if (elements.length == 1)
				r = new Ast.ParensExp(elements[0]);
			else r = new Ast.TupleTypeExp(elements);
		}
		else {
			this.popLocation();
			throw this.expect(Token.IDENTIFIER);
		}

		this.finishNode(r);

		while (Infinity) {
			if (this.token.type == Token.DOT && this.inlineOrHigherIndent(r)) {
				this.markLocation(r.span);
				this.nextToken();
				let s = this.expectIdentifier(true);
				r = new AST.MemberOrCallOp(r, s);
				this.finishNode(r);
			}
			else if (this.token.type == Token.QMARK && this.inlineOrHigherIndent(r)) {
				this.markLocation(r.span),
				this.nextToken(),
				r = new AST.NullableTypeExp(r),
				this.finishNode(r);
			}
			else break;
		}

		return r;
	}

	parseTypeExpressionList() {
		let r = [];
		do {
			r.push(this.parseTypeExpression());
		} while (this.consume(Token.COMMA));
		return r;
	}

	parseFnTypeParam() {
		this.markLocation();
		let name = this.expectIdentifier();
		let type = null;
		if (this.consumeKeyword('as')) {
			type = this.parseTypeExpression();
		}
		let r = new AST.FnTypeParam(name, type);
		this.finishNode(r);
		return r;
	}

	parseExpression(minPrecedence = null) {
		let r = this.parseOptExpression(minPrecedence);
		if (r == null) {
			throw this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
		}
		return r;
	}

	parseOptExpression(minPrecedence = null) {
		minPrecedence = minPrecedence || OperatorPrecedence.YIELD;
		let r = this.parseOptPrimaryExpression();
		let operator = null;
		let span = null;

		if (r == null) {
			if (this.token.isKeyword('super') && minPrecedence.valueOf() <= OperatorPrecedence.UNARY.valueOf()) {
				this.markLocation();
				this.nextToken();
				r = new AST.SuperExp(this.parseOptArguments());
				this.finishNode(r);
			}
			else if (this.token.isKeyword('yield') && minPrecedence.valueOf() <= OperatorPrecedence.YIELD.valueOf()) {
				this.markLocation();
				this.nextToken();
				r = new AST.UnaryOp(Operator.YIELD, this.parseExpression(OperatorPrecedence.YIELD));
				this.finishNode(r);

				if (this.generatorStack.length == 0 || this.functionIsAsync)
					this.reportSyntaxError('syntaxErrors.unallowedHere', r.span, { what: 'yield' });
				else this.functionIsGenerator = true;
			}
			else if (minPrecedence.valueOf() <= OperatorPrecedence.UNARY.valueOf() && this.consume(Token.DOT)) {
				this.markLocation();
				r = new AST.WithMemberOrCallOp(this.expectIdentifier(true));
				this.finishNode(r);
			}
			else if (minPrecedence.valueOf() <= OperatorPrecedence.UNARY.valueOf() && this.filterUnaryOperator()) {
				operator = this.filteredOperator;
				this.markLocation();
				this.nextToken();
				let e = this.parseExpression(this.nextPrecedence);
				r = new AST.UnaryOp(operator, operator == Operator.CLOSUREOF ? this.desambiguateIdOrCall(e) : e);
				this.finishNode(r);

				// verify await
				if (operator == Operator.AWAIT) {
					if (this.asyncStack.length == 0 || !this.functionIsAsync || this.functionIsGenerator) {
						this.reportSyntaxError('syntaxErrors.unallowedHere', r.span, { what: 'await' });
					}
				}
			}
			else if (this.token.isKeyword('typeof') && minPrecedence.valueOf() <= OperatorPrecedence.RELATIONAL.valueOf()) {
				this.markLocation();
				this.nextToken();
				let left = this.parseExpression(OperatorPrecedence.SHIFT);
				if (this.consumeKeyword('isnot')) {
					r = new AST.TypeOfIsNotExp(left, this.parseTypeExpression());
				} else {
					this.expectKeyword('is');
					r = new AST.TypeOfIsExp(left, this.parseTypeExpression());
				}
				this.finishNode(r);
			}
		}
		return this.parseSubexpression(r, minPrecedence);
	}

	parseSubexpression(r, minPrecedence = null) {
		if (!r) {
			return null;
		}
		minPrecedence = minPrecedence || OperatorPrecedence.YIELD;
		while (Infinity) {
			if (this.token.type == Token.DOT && this.inlineOrHigherIndent(r)) {
				this.nextToken();
				if (this.token.type != Token.IDENTIFIER && this.token.type != Token.KEYWORD) {
					break;
				}
				this.markLocation(r.span);
				r = new AST.MemberOrCallOp(r, this.expectIdentifier(true));
				this.finishNode(r);
			}
			else if (this.token.type == Token.LPAREN && this.inlineOrHigherIndent(r)) {
				this.nextToken();
				let argumentsList = [];
				if (this.token.type != Token.RPAREN) {
					do {
						argumentsList.push(this.parseExpression());
					} while (this.consume(Token.COMMA));
				}
				this.expect(Token.RPAREN);
				this.markLocation(r.span);
				r = new AST.GroupOp(this.desambiguateIdOrCall(r), argumentsList);
				this.finishNode(r);
			}
			// '<' operator must be inline or at higher indented line.
			else if (this.token.isOperator(Operator.LT) && minPrecedence.valueOf() <= OperatorPrecedence.RELATIONAL.valueOf() && this.inlineOrHigherIndent(r)) {
				this.nextToken();
				this.markLocation(r);
				r = new AST.BinOp(Operator.LT, r, this.parseExpression(OperatorPrecedence.SHIFT));
				this.finishNode(r);
			}
			// optional chain
			else if (this.token.type == Token.QMARK && minPrecedence.valueOf() <= OperatorPrecedence.POSTFIX.valueOf()) {
				this.nextToken();
				if (this.consume(Token.LPAREN)) {
					let argumentsList = [];
					if (this.token.type != Token.RPAREN) {
						do {
							argumentsList.push(this.parseExpression());
						} while (this.consume(Token.COMMA));
					}
					this.expect(Token.RPAREN);
					this.markLocation(r.span);
					r = new AST.OptGroupOpChain(r, argumentsList);
					this.finishNode(r);
				}
				else {
					this.expect(Token.DOT);
					this.markLocation(r.span);
					r = new AST.OptMemberOrCallOpChain(r, this.expectIdentifier(true));
					this.finishNode(r);
				}
			}
			else if (this.filterBinaryOperator() && minPrecedence.valueOf() <= this.nextPrecedence.valueOf()) {
				this.nextToken();
				this.markLocation(r);
				r = new AST.BinOp(this.filteredOperator, r, this.parseExpression(OperatorPrecedence.valueOf(this.nextPrecedence.valueOf() + 1)));
				this.finishNode(r);
			}
			else break;
		}

		return r;
	}

	filterUnaryOperator() {
		let tokenType = this.token.type;
		this.filteredOperator = null;
		if (tokenType == Token.KEYWORD) {
			switch (this.token.stringValue) {
				case 'await':
					this.filteredOperator = Operator.AWAIT;
					this.nextPrecedence = OperatorPrecedence.UNARY;
					return true;
				case 'not':
					this.filteredOperator = Operator.NOT;
					this.nextPrecedence = OperatorPrecedence.UNARY;
					return true;
				case 'closureof':
					this.filteredOperator = Operator.CLOSUREOF;
					this.nextPrecedence = OperatorPrecedence.UNARY;
					return true;
			}
		} else if (tokenType == Token.OPERATOR) {
			switch (this.token.operator) {
				case Operator.ADD:
					this.filteredOperator = Operator.POSITIVE;
					this.nextPrecedence = OperatorPrecedence.UNARY;
					return true;
				case Operator.SUBTRACT:
					this.filteredOperator = Operator.NEGATE;
					this.nextPrecedence = OperatorPrecedence.UNARY;
					return true;
			}
		}
		return false;
	}

	filterBinaryOperator() {
		let tokenType = this.token.type;
		this.filteredOperator = null;
		if (tokenType == Token.KEYWORD) {
			switch (this.token.stringValue) {
				case 'mod':
					this.filteredOperator = Operator.MOD;
					this.nextPrecedence = OperatorPrecedence.MULTIPLICATIVE;
					return true;
				case 'and':
					this.filteredOperator = Operator.AND;
					this.nextPrecedence = OperatorPrecedence.AND;
					return true;
				case 'xor':
					this.filteredOperator = Operator.XOR;
					this.nextPrecedence = OperatorPrecedence.XOR;
					return true;
				case 'or':
					this.filteredOperator = Operator.OR;
					this.nextPrecedence = OperatorPrecedence.OR;
					return true;
				case 'eqv':
					this.filteredOperator = Operator.EQV;
					this.nextPrecedence = OperatorPrecedence.EQV;
					return true;
				case 'imp':
					this.filteredOperator = Operator.IMP;
					this.nextPrecedence = OperatorPrecedence.IMP;
					return true;
				case 'is':
					this.filteredOperator = Operator.EQUALS;
					this.nextPrecedence = OperatorPrecedence.EQUALITY;
					return true;
				case 'isnot':
					this.filteredOperator = Operator.NOT_EQUALS;
					this.nextPrecedence = OperatorPrecedence.EQUALITY;
					return true;
			}
		} else if (tokenType == Token.OPERATOR) {
			switch (this.token.operator) {
				case Operator.ADD:
				case Operator.SUBTRACT:
					this.filteredOperator = this.token.operator;
					this.nextPrecedence = OperatorPrecedence.ADDITIVE;
					return true;
				case Operator.MULTIPLY:
				case Operator.DIVIDE:
					this.filteredOperator = this.token.operator;
					this.nextPrecedence = OperatorPrecedence.MULTIPLICATIVE;
					return true;
				case Operator.EXP:
					this.filteredOperator = this.token.operator;
					this.nextPrecedence = OperatorPrecedence.EXP;
					return true;
				case Operator.LEFT_SHIFT:
				case Operator.RIGHT_SHIFT:
				case Operator.UNSIGNED_RIGHT_SHIFT:
					this.filteredOperator = this.token.operator;
					this.nextPrecedence = OperatorPrecedence.SHIFT;
					return true;
				case Operator.NOT_EQUALS:
					this.filteredOperator = Operator.NOT_EQUALS;
					this.nextPrecedence = OperatorPrecedence.EQUALITY;
					return true;
				// '<' operator is handled by parseExpression() method.
				// case Operator.LT:
				case Operator.GT:
				case Operator.LTE:
				case Operator.GTE:
					this.filteredOperator = this.token.type;
					this.nextPrecedence = OperatorPrecedence.RELATIONAL;
					return true;
			}
		} else {
			switch (tokenType) {
				case Token.ASSIGNMENT_OR_EQUALS:
					this.filteredOperator = Operator.EQUALS;
					this.nextPrecedence = OperatorPrecedence.EQUALITY;
					return true;
				case Token.AMP:
					this.filteredOperator = Operator.CONCAT;
					this.nextPrecedence = OperatorPrecedence.CONCAT;
					return true;
			}
		}

		return false;
	}

	parseOptPrimaryExpression() {
		this.markLocation();
		let r = null;
		let s = this.consumeIdentifier();
		if (s)
			this.duplicateLocation(),
			r = this.parseIdStartedPrimaryExp(this.popLocation(), s);
		else if (this.token.type == Token.STRING_LITERAL)
			r = new AST.StrLtr(this.token.stringValue),
			this.nextToken();
		else if (this.token.type == Token.BOOLEAN_LITERAL)
			r = new AST.BoolLtr(this.token.booleanValue),
			this.nextToken();
		else if (this.token.type == Token.DECIMAL_LITERAL)
			r = new AST.DecLtr(this.token.decimalValue),
			this.nextToken();
		else if (this.token.type == Token.LONG_LITERAL)
			r = new AST.LongLtr(this.token.bigIntValue),
			this.nextToken();
		else if (this.consumeKeyword('nothing'))
			r = new AST.NothingLtr;
		else if (this.consumeKeyword('null'))
			r = new AST.NullLtr;
		else if (this.consumeKeyword('empty'))
			r = new AST.EmptyLtr;
		else if (this.consumeKeyword('me'))
			r = new AST.MeLtr;
		else if (this.consume(Token.LPAREN)) {
			const e = this.parseExpression();
			if (this.consume(Token.COMMA)) {
				const list = [e];
				while (this.consume(Token.COMMA)) {
					list.push(this.parseExpression());
				}
				r = new AST.TupleLtr(list);
			} else {
				r = new AST.ParensExp(e)
			}
			this.expect(Token.RPAREN);
		}
		else if (this.consumeKeyword('async')) {
			if (this.consumeKeyword('function')) {
				if (this.token.type != Token.LPAREN)
					throw this.expect(Token.LPAREN);
				let common = this.parseFunctionCommon(false, true);
				if (!common.body)
					this.reportSyntaxError('syntaxErrors.functionMustContainBody', common.span);
				if (common.body instanceof AST.Block)
					this.expectKeyword('end'),
					this.expectKeyword('function');
				r = new AST.FnExp(common);
			}
			else if (this.consumeKeyword('sub')) {
				if (this.token.type != Token.LPAREN)
					throw this.expect(Token.LPAREN);
				let common = this.parseFunctionCommon(true, true);
				if (!common.body)
					this.reportSyntaxError('syntaxErrors.functionMustContainBody', common.span);
				if (common.body instanceof AST.Block)
					this.expectKeyword('end'),
					this.expectKeyword('sub');
				r = new AST.FnExp(common);
			}
			else throw this.expectKeyword('function');
		}
		else if (this.consumeKeyword('function')) {
			if (this.token.type != Token.LPAREN)
				throw this.expect(Token.LPAREN);
			let common = this.parseFunctionCommon(false, false);
			if (!common.body)
				this.reportSyntaxError('syntaxErrors.functionMustContainBody', common.span);
			if (common.body instanceof AST.Block)
				this.expectKeyword('end'),
				this.expectKeyword('function');
			r = new AST.FnExp(common);
		}
		else if (this.consumeKeyword('sub')) {
			if (this.token.type != Token.LPAREN)
				throw this.expect(Token.LPAREN);
			let common = this.parseFunctionCommon(true, false);
			if (!common.body)
				this.reportSyntaxError('syntaxErrors.functionMustContainBody', common.span);
			if (common.body instanceof AST.Block)
				this.expectKeyword('end'),
				this.expectKeyword('sub');
			r = new AST.FnExp(common);
		}
		else if (this.token.type == Token.HASH) {
			r = parseCollectionInitializer();
		}
		else if (this.token.type == Token.LBRACE) {
			r = parseDictInitializer(null);
		}
		else if (this.consumeKeyword('new')) {
			let base = this.parseOptPrimaryExpression();
			if (!base)
				throw this.expect(Token.IDENTIFIER);
			while (this.consume(Token.DOT))
				this.markLocation(base.span),
				base = new AST.MemberOrCallOp(base, this.expectIdentifier(true)),
				this.finishNode(base);
			if (this.token.type == Token.LPAREN && this.inlineOrHigherIndent(base.span)) {
				this.nextToken();
				r = new AST.NewOp(base, this.parseArgumentsAfterParen());
			}
			else r = new AST.NewOp(base, []);
		}
		else if (this.consumeKeyword('if')) {
			this.expect(Token.LPAREN);
			let exp1 = this.parseExpression();
			this.expect(Token.COMMA);
			let exp2 = this.parseExpression();
			this.expect(Token.COMMA);
			let exp3 = this.parseExpression();
			this.expect(Token.RPAREN);
			r = new AST.CondExp(exp1, exp2, exp3);
		}
		else if (this.consumeKeyword('ctype')) {
			this.expect(Token.LPAREN);
			let exp1 = this.parseExpression();
			this.expect(Token.COMMA);
			let exp2 = this.parseTypeExpression();
			this.expect(Token.RPAREN);
			r = new AST.CTypeExp(exp1, exp2);
		}
		else if (this.consumeKeyword('trycast')) {
			this.expect(Token.LPAREN);
			let exp1 = this.parseExpression();
			this.expect(Token.COMMA);
			let exp2 = this.parseTypeExpression();
			this.expect(Token.RPAREN);
			r = new AST.TryCastExp(exp1, exp2);
		}
		else if (this.consumeKeyword('gettype')) {
			this.expect(Token.LPAREN);
			let exp = this.parseTypeExpression();
			this.expect(Token.RPAREN);
			r = new AST.GetTypeExp(exp);
		}

		if (r)
			this.finishNode(r);
		else this.popLocation();
		return r;
	}

	parseIdStartedPrimaryExp(span, s) {
		let r = null;
		if (this.token.type == Token.STRING_LITERAL && s.toLowerCase() == 'embed')
			r = new AST.EmbedOp(this.token.stringValue),
			this.nextToken();
		else r = new AST.IdentOrCall(s);
		this.markLocation(span);
		this.finishNode(r);
		return r;
	}

	parseCollectionInitializer() {
		this.expect(Token.HASH);
		this.expect(Token.LBRACE);
		let elements = [];
		while (this.token.type != Token.RBRACE) {
			if (this.token.type == Token.ELLIPSIS) {
				this.markLocation();
				this.nextToken();
				let s = new AST.Spread(this.parseExpression());
				this.finishNode(s);
				elements.push(s);
			} else {
				elements.push(this.parseExpression());
			}
			if (!this.consume(Token.COMMA))
				break;
		}
		this.expect(Token.RBRACE);
		return new AST.CollectionLtr(elements);
	}

	parseDictInitializer() {
		let fields = [];
		this.expect(Token.LBRACE);
		while (this.token.type != Token.RBRACE) {
			fields.push(this.parseDictInitializerField());
			if (!this.consume(Token.COMMA))
				break;
		}
		this.expect(Token.RBRACE);
		return new AST.DictLtr(fields);
	}

	parseDictInitializerField() {
		this.markLocation();
		let r = null;
		if (this.consume(Token.ELLIPSIS))
			r = new AST.Spread(this.parseExpression());
		else {
			let name = this.expectIdentifier();
			this.expect(Token.ASSIGNMENT_OR_EQUALS);
			let value = this.parseExpression();
			r = new AST.DictLtrField(name, value);
		}
		this.finishNode(r);
		return r;
	}

	parseOptArguments() {
		return this.token.type == Token.LPAREN ? this.parseArguments() : [];
	}

	parseArguments() {
		this.expect(Token.LPAREN);
		return this.parseArgumentsAfterParen();
	}

	parseArgumentsAfterParen() {
		let r = [];
		if (this.token.type != Token.RPAREN) {
			do {
				r.push(this.parseExpression());
			} while (this.consume(Token.COMMA));
		}
		this.expect(Token.RPAREN);
		return r;
	}

	parseNoParensArguments() {
		let r = [];
		do {
			r.push(this.parseExpression());
		} while (this.consume(Token.COMMA));
		return r;
	}

	parseFunctionCommon(isSub, isAsync, isConstructor = false, name = '') {
		this.markLocation();
		let hadParen = this.consume(Token.LPAREN);
		return this.parseFunctionCommonAfterParen(this.popLocation(), hadParen, isSub, isAsync, isConstructor, name);
	}

	parseFunctionCommonAfterParen(initialSpan, hadParen, isSub, isAsync, isConstructor = false, name = '') {
		this.markLocation(initialSpan);
		this.duplicateLocation();
		let startSpan = this.popLocation();

		let params = null;
		let optParams = null;
		let restParam = null;
		let returnType = null;

		// begin parameters
		if (hadParen) {
			if (this.token.type != Token.RPAREN) {
				do {
					if (this.consume(Token.ELLIPSIS)) {
						restParam = this.parseDestructuringPattern();
						break;
					}
					let binding = this.parseVarBinding();
					if (binding.initExp) {
						optParams = optParams || [];
						optParams.push(binding);
					}
					else {
						if (optParams)
							this.reportSyntaxError('syntaxErrors.explicitParamsAfterOpt', binding.span);
						params = params || [];
						params.push(binding.pattern);
					}
				}
				while (this.consume(Token.COMMA));
			}
			this.expect(Token.RPAREN);
		}
		// end parameters

		if (!isSub && this.consumeKeyword('as')) {
			returnType = this.parseTypeExpression();
		}

		this.generatorStack.push(false);
		this.asyncStack.push(isAsync);

		let context = new FunctionContext;
		context.isConstructor = isConstructor;
		context.name = name;

		let body = this.parseFunctionBody(context, startSpan);
		let isGenerator = this.generatorStack.pop();
		this.asyncStack.pop();

		let r = new AST.FnCommon(isSub, isAsync, isGenerator, params, optParams, restParam, returnType, body);
		this.finishNode(r);
		return r;
	}

	parseFunctionBody(context, startSpan) {
		if (this.token.type == Token.EMPTY || (this.lineBreak && this.script.getLineIndent(this.token.firstLine) <= this.script.getLineIndent(this.previousToken.lastLine))) {
			return null;
		}
		if (this.lineBreak) {
			return this.parseBlock(context, startSpan);
		} else {
			return this.parseExpression();
		}
	}

	parseVarBinding() {
		let [p, asNew] = this.parseDestructuringPatternAndStopAtAsNew();
		let initExp = null;
		if (asNew || this.consume(Token.ASSIGNMENT_OR_EQUALS)) {
			initExp = this.parseExpression();
		}
		let r = new AST.VarBinding(p, initExp);
		this.finishNode(r);
		return r;
	}

	parseDestructuringPattern() {
		let [r, asNew] = parseDestructuringPatternAndStopAtAsNew();
		if (asNew) {
			this.expectIdentifier();
		}
		return r;
	}

	parseDestructuringPatternAndStopAtAsNew() {
		this.markLocation();
		let r = null;
		let asNew = false;
		if (this.consume(Token.LPAREN)) {
			let elements = [];
			do {
				if (this.consume(Token.UNDERSCORE)) {
					elements.push(null);
				} else {
					elements.push(this.parseDestructuringPattern())
				}
			} while (this.consume(Token.COMMA));
			this.expect(Token.RPAREN);
			r = new AST.CollectionOrTuplePattern(elements, null);
		} else {
			let name = this.expectIdentifier();
			r = new AST.NonDestructuringPattern(name, null);
		}

		if (this.consumeKeyword('as')) {
			if (this.token.isKeyword('new')) {
				asNew = true;
			} else {
				r.type = this.parseTypeExpression();
			}
		}

		this.finishNode(r);
		return [r, asNew];
	}

	parseBlock(context, startSpan) {
		this.markLocation(startSpan);
		let s = [];
		let initiallyEmpty = this.previousToken.type == Token.EMPTY;
		/*
		if (!this.lineBreak && this.token.type != Token.EMPTY && !initiallyEmpty) {
			this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
		}
		*/
		let needsLineBreak = false;
		while ((this.atHigherIndent(startSpan) || initiallyEmpty) && this.token.type != Token.EMPTY) {
			if (needsLineBreak && !this.lineBreak && s.length > 0 && !(s.length > 0 && s[s.length - 1] instanceof AST.EmptyStmt)) {
				this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
			}
			needsLineBreak = true;
			let stmt = this.parseStatement(context);
			s.push(stmt);
			if (!(stmt instanceof AST.ModuleDecl) && context instanceof DefaultProgramContext) {
				context.allowModules = false;
			}
			if (!(stmt instanceof AST.Drtv || stmt instanceof AST.EmptyStmt) && !(context instanceof FunctionContext || context instanceof DefaultProgramContext)) {
				this.reportSyntaxError('syntaxErrors.syntaxError', stmt.span);
			}
			if (this.consume(Token.COLON)) {
				needsLineBreak = false;
			}
		}
		let b = new AST.Block(s);
		this.finishNode(b);
		return b;
	}

	parseStatement(context) {
		this.markLocation();
		let r = null;
		let str = this.token.stringValue;
		let fstTokenSpan = this.getTokenSpan();

		if (this.consumeIdentifier()) {
			// begin labeled statement
			if (this.consume(Token.COLON)) {
				let context2 = context.clone();
				context2.nextLabel = str.toLowerCase();
				r = this.parseStatement(context2);
				if (!(r instanceof AST.LabeledStmt)) {
					this.reportSyntaxError('syntaxErrors.syntaxError', r.span);
				}
			}
			// end labeled statement

			else if (str == 'include' && this.token.type == Token.STRING_LITERAL && (fstTokenSpan.end - fstTokenSpan.start) == 'include'.length) {
				return this.parseIncludeDrtv(this.token.stringValue, this.popLocation(), context);
			}
			else {
				this.duplicateLocation();
				let exp = this.parseIdStartedPrimaryExp(this.popLocation(), str);
				exp = this.parseSubexpression(exp, OperatorPrecedence.UNARY);
				r = this.finishCallOrAwaitOrAssignStatement(exp);

				let fContext = context instanceof FunctionContext ? context : null;

				// possibly enum member
				if (context.atType('enum')) {
					if (r instanceof AST.CallStmt && r.base instanceof AST.Ident && r.argumentsList.length == 0 && this.previousToken.type != Token.RPAREN) {
						this.markLocation(r.span);
						r = new AST.MemberDecl(r.base.name, null, null);
						r.modifiers = new Set;
						this.finishNode(r);
					} else if (r instanceof AST.AssignStmt && r.left instanceof AST.Ident && r.compound == null) {
						this.markLocation(r.span);
						r = new AST.MemberDecl(r.left.name, r.right, null);
						r.modifiers = new Set;
						this.finishNode(r);
					}
				}
				// return statement as assignment
				else if (fContext != null && fContext.name) {
					if (r instanceof AST.AssignStmt && r.left instanceof AST.Ident && r.left.name.toLowerCase() == fContext.name.toLowerCase()) {
						this.markLocation(r.right.span);
						r = new AST.RetStmt(r.right);
						this.finishNode(r);
					}
				} 
			}
		}
		else if (this.atAnnotatableDeclStart) {
			r = this.parseAnnotatableDecl(context);
		}
		else if (this.token.type == Token.KEYWORD) {
			// begin Super
			if (str == 'super') {
				this.nextToken();
				let argumentsList = this.parseOptArguments();
				this.duplicateLocation();
				let startSpan = this.popLocation();
				if (this.token.type == Token.DOT && this.inlineOrHigherIndent(startSpan)) {
					let exp = new AST.SuperExp(argumentsList);
					exp.span = startSpan;
					exp = this.parseSubexpression(exp, OperatorPrecedence.UNARY);
					r = this.finishCallOrAwaitOrAssignStatement(exp);
				}
				else {
					r = new AST.SuperStmt(argumentsList);

					// validate super statement
					let fContext = context instanceof FunctionContext ? context : null;
					if (!fContent || fContext.foundSuperStatement || !fContext.isConstructor) {
						this.reportSyntaxError('syntaxErrors.syntaxError', r.span);
					} else {
						fContext.foundSuperStatement = true;
					}
				}
			}
			// end Super

			else if (str == 'import' || str == 'imports') {
				r = this.parseImportDrtv();
			}
			else if (str == 'let') {
				this.nextToken();
				r = new AST.VarDecl(this.parseVarBinding());

				// whipe enclosing function name
				let fContext = context?.atFunction ? context : null;
				if (fContext != null && fContext.name != null && r.pattern.patternBindsName(fContext.name)) {
					fContext.name = null;
				}
			}
			else if (str == 'exit') {
				this.nextToken();
				this.duplicateLocation();
				let startSpan = this.popLocation();
				let exitKeywordSpan = this.getTokenSpan();
				let exitKeyword = this.parseExitOrContKeyword();
				let label = !this.lineBreak ? this.consumeIdentifier() : null;
				r = new AST.ExitStmt(label);

				let target = null;
				let fContext = context instanceof FunctionContext ? context : null;
				if (label != null) {
					target = fContext ? fContext.labels.get(label.toLowerCase()) : null;
				} else {
					target = fContext ? fContext.defaultExitStatement : null;
				}
				r.target = target;
				if (target) {
					this.validateExitOrContKeyword(target, exitKeyword, exitKeywordSpan);
				} else {
					this.reportSyntaxError('syntaxErrors.noExitTarget', startSpan);
				}
			}
			else if (str == 'continue') {
				this.nextToken();
				this.duplicateLocation();
				let startSpan = this.popLocation();
				let contKeywordSpan = this.getTokenSpan();
				let contKeyword = this.parseExitOrContKeyword();
				let label = !this.lineBreak ? this.consumeIdentifier() : null;
				r = new AST.ContStmt(label);

				let target = null;
				let fContext = context instanceof FunctionContext ? context : null;
				if (label != null) {
					target = fContext ? fContext.labels.get(label.toLowerCase()) : null;
				} else {
					target = fContext ? fContext.defaultContinueStatement : null;
				}
				r.target = target;
				if (target) {
					this.validateExitOrContKeyword(target, contKeyword, contKeywordSpan);
				} else {
					this.reportSyntaxError('syntaxErrors.noContinueTarget', startSpan);
				}
			}
			else if (str == 'return') {
				let startSpan = this.getTokenSpan();
				this.nextToken();
				r = new AST.RetStmt(this.inlineOrHigherIndent(startSpan) ? parseExpression() : null);
				if (!(context instanceof FunctionContext)) {
					this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
				}
			}
			else if (str == 'if') {
				let startSpan = this.getTokenSpan();
				this.nextToken();
				let cond = this.parseExpression();
				this.expectKeyword('then');
				let block = null;
				let elseClauses = null;
				if (this.lineBreak) {
					block = this.parseBlock(context.clone(), startSpan);
					while (this.token.isKeyword('elseif')) {
						this.markLocation();
						let startSpan = this.getTokenSpan();
						this.nextToken();
						let cond = this.parseExpression();
						this.expectKeyword('then');
						let clause = new AST.ElseClause(cond, this.parseBlock(context.clone(), startSpan));
						this.finishNode(clause);
						elseClauses = elseClauses || [];
						elseClauses.push(clause);
					}
					if (this.token.isKeyword('else')) {
						this.markLocation();
						let startSpan = this.getTokenSpan();
						this.nextToken();
						let clause = new AST.ElseClause(null, this.parseBlock(context.clone(), startSpan));
						this.finishNode(clause);
						elseClauses = elseClauses || [];
						elseClauses.push(clause);
					}
					this.expectKeyword('end');
					this.expectKeyword('if');
				} else {
					let stmt = this.parseStatement(context.clone());
					block = new AST.Block([stmt]);
					this.markLocation(stmt.span);
					this.finishNode(block);
				}
				r = new AST.IfStmt(cond, block, elseClauses);
			}

			else if (str == 'loop') {
				let startSpan = this.getTokenSpan();
				this.nextToken();
				r = new AST.LoopStmt(null);
				let context2 = context.clone();
				context2.defaultExitStatement = r;
				context2.defaultContinueStatement = r;
				if (context.nextLabel != null) {
					r.label = context.nextLabel;
					context2.labels.set(context.nextLabel, r);
				}
				r.block = this.parseBlock(context2, startSpan);
				this.expectKeyword('end');
				this.expectKeyword('loop');
			}

			else if (str == 'while') {
				let startSpan = this.getTokenSpan();
				this.nextToken();
				r = new AST.WhileStmt(this.parseExpression(), null);
				let context2 = context.clone();
				context2.defaultExitStatement = r;
				context2.defaultContinueStatement = r;
				if (context.nextLabel != null) {
					r.label = context.nextLabel;
					context2.labels.set(context.nextLabel, r);
				}
				r.block = this.parseBlock(context2, startSpan);
				if (!this.consumeKeyword('wend')) {
					this.expectKeyword('end');
					this.expectKeyword('while');
				}
			}

			else if (str == 'for') {
				let startSpan = this.getTokenSpan();
				this.nextToken();
				if (this.consumeContextKeyword('each')) {
					r = this.parseForEachStmt(context, startSpan);
				} else {
					r = this.parseForStmt(context, startSpan);
				}
			}

			else if (str == 'do') {
				let startSpan = this.getTokenSpan();
				this.nextToken();
				r = this.parseDoStmt(context, startSpan);
			}

			else if (str == 'select') {
				this.nextToken();
				if (this.consumeContextKeyword('type')) {
					r = this.parseSelectTypeStmt(context.clone());
				} else {
					r = this.parseSelectStmt(context.clone());
				}
			}

			else if (str == 'throw') {
				this.nextToken();
				r = new AST.ThrowStmt(this.parseExpression());
			}

			else if (str == 'try') {
				r = this.parseTryStmt(context);
			}

			else if (str == 'with') {
				let startSpan = this.getTokenSpan();
				this.nextToken();
				r = new AST.WithStmt(this.parseExpression(), this.parseBlock(context.clone(), startSpan));
				this.expectKeyword('end');
				this.expectKeyword('with');
			}

			else if (str == 'set') {
				this.nextToken();
				let l = this.desambiguateIdOrCall(this.parseExpression(OperatorPrecedence.UNARY));
				this.expect(Token.ASSIGNMENT_OR_EQUALS);
				r = new AST.AssignStmt(null, l, this.parseExpression());
			}

			// yield statement
			else if (str == 'yield') {
				let exp = this.parseOptExpression(OperatorPrecedence.YIELD);
				r = this.finishCallOrAwaitOrAssignStatement(exp);
			}

			else {
				let exp = this.parseOptExpression(OperatorPrecedence.UNARY);
				if (exp) {
					r = this.finishCallOrAwaitOrAssignStatement(exp);
				}
			}

		} else if (this.consume(Token.COLON)) {
			r = new AST.EmptyStmt;
		} else {
			let exp = this.parseOptExpression(OperatorPrecedence.UNARY);
			if (exp) {
				r = this.finishCallOrAwaitOrAssignStatement(exp);
			}
		}

		if (r) {
			this.finishNode(r);
		} else {
			let span = this.popLocation();
			throw this.reportSyntaxError('syntaxErrors.expectedStatement', span);
		}
		return r;
	}

	parseTryStmt(context) {
		this.nextToken();
		let startSpan = this.getTokenSpan();
		let tryBlock = this.parseBlock(context.clone(), startSpan);
		let catchClauses = [];
		while (this.token.isKeyword('catch')) {
			this.markLocation();
			let startSpan = this.getTokenSpan();
			this.nextToken();
			let p = this.parseDestructuringPattern();
			let context2 = context.clone();

			// whipe enclosing function name
			let fContext = context2?.atFunction ? context2 : null;
			if (fContext != null && fContext.name != null && p.patternBindsName(fContext.name)) {
				fContext.name = null;
			}

			let c = new AST.TryCatch(p, this.parseBlock(context2, startSpan));
			this.finishNode(c);
			catchClauses.push(c);
		}
		let finallyClause = null;
		if (this.token.isKeyword('finally')) {
			this.markLocation();
			this.nextToken();
			let startSpan = this.getTokenSpan();
			this.nextToken();
			finallyClause = new AST.TryFinally(this.parseBlock(context.clone(), startSpan));
			this.finishNode(finallyClause);
		}
		this.expectKeyword('end');
		this.expectKeyword('try');
		return new AST.TryStmt(tryBlock, catchClauses, finallyClause);
	}

	parseForStmt(context, startSpan) {
		let varName = this.expectIdentifier();
		let varType = null;
		if (this.consumeKeyword('as')) {
			varType = this.parseTypeExpression();
		}
		this.expect(Token.ASSIGNMENT_OR_EQUALS);
		let from = this.parseExpression();
		this.expectKeyword('to');
		let to = this.parseExpression();
		let step = null;
		if (this.consumeKeyword('step')) {
			step = this.parseExpression();
		}
		let r = new AST.ForStmt(varName, varType, from, to, step, null);
		let context2 = context.clone();
		context2.defaultExitStatement = r;
		context2.defaultContinueStatement = r;
		if (context.nextLabel != null) {
			r.label = context.nextLabel;
			context2.labels.set(context.nextLabel, r);
		}
		r.block = this.parseBlock(context2, startSpan);
		this.expectKeyword('next');
		if (!this.lineBreak) {
			this.consumeIdentifier();
		}
		return r;
	}

	parseForEachStmt(context, startSpan) {
		let left = this.parseDestructuringPattern();
		this.expectKeyword('in');
		let right = this.parseExpression();
		let r = new AST.ForEachStmt(left, right, null);

		let context2 = context.clone();
		context2.defaultExitStatement = r;
		context2.defaultContinueStatement = r;
		if (context.nextLabel != null) {
			r.label = context.nextLabel;
			context2.labels.set(context.nextLabel, r);
		}

		// whipe enclosing function name
		let fContext = context2.atFunction ? context2 : null;
		if (fContext != null && fContext.name != null && left.patternBindsName(fContext.name)) {
			fContext.name = null;
		}

		r.block = this.parseBlock(context2, startSpan);
		this.expectKeyword('next');
		if (!this.lineBreak) {
			this.consumeIdentifier();
		}
		return r;
	}

	parseDoStmt(context, startSpan) {
		let prefix = null;
		let postfix = null;
		let cond = null;

		if (this.consumeKeyword('while')) {
			prefix = 'while';
			cond = this.parseExpression();
		} else if (this.consumeKeyword('until')) {
			prefix = 'until';
			cond = this.parseExpression();
		}

		let r = new AST.DoStmt(null, cond);
		r.prefix = prefix;

		let context2 = context.clone();
		context2.defaultExitStatement = r;
		context2.defaultContinueStatement = r;
		if (context.nextLabel != null) {
			r.label = context.nextLabel;
			context2.labels.set(context.nextLabel, r);
		}
		r.block = this.parseBlock(context2, startSpan);

		if (prefix == null) {
			if (this.consumeKeyword('end')) {
				this.expectKeyword('do');
			} else if (this.consumeKeyword('while')) {
				r.condExp = this.parseExpression();
				r.postfix = 'while';
			} else if (this.consumeKeyword('until')) {
				r.condExp = this.parseExpression();
				r.postfix = 'until';
			} else {
				throw this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
			}
		} else {
			this.expectKeyword('loop');
		}

		this.expectKeyword('next');
		return r;
	}

	parseSelectStmt(context) {
		this.expectKeyword('Case');
		let discriminant = this.parseExpression();
		let cases = [];

		while (this.token.isKeyword('case')) {
			this.markLocation();
			this.nextToken();

			this.duplicateLocation();
			let startSpan = this.popLocation();

			let c = null;

			if (this.consumeKeyword('else')) {
				c = new AST.SelectCase([], this.parseBlock(context.clone(), startSpan));
			} else {
				let expList = [];
				do {
					this.markLocation();
					let e = null;
					if (this.consumeKeyword('is')) {
						let op = this.parseOptComparisonOperator();
						if (op == null) {
							e = new AST.CaseOp(Operator.EQUALS, this.parseExpression());
						} else {
							e = new AST.CaseOp(op, this.parseExpression());
						}
					} else {
						let l = this.parseExpression();
						if (this.consumeKeyword('to')) {
							e = new AST.CaseTo(l, this.parseExpression());
						} else {
							e = l;
						}
					}
					this.finishNode(e);
					expList.push(e);
				} while (this.consume(Token.COMMA));

				c = new AST.SelectCase(expList, this.parseBlock(context.clone(), startSpan));
			}

			cases.push(c);
			this.finishNode(c);
		}

		this.expectKeyword('end');
		this.expectKeyword('select');
		let r = new AST.SelectStmt(discriminant, cases);
		return r;
	}

	parseOptComparisonOperator() {
		let op = this.token.operator;
		if (this.consume(Token.ASSIGNMENT_OR_EQUALS)) {
			return Operator.EQUALS;
		} else if (this.token.type == Token.OPERATOR && (op == Operator.EQUALS || op == Operator.NOT_EQUALS || op == Operator.LT || op == Operator.GT || op == Operator.LTE || op == Operator.GTE)) {
			return op;
		}
		return null;
	}

	parseSelectTypeStmt(context) {
		let discriminant = this.parseExpression();
		let cases = [];

		while (this.token.isKeyword('case')) {
			this.markLocation();
			let startSpan = this.getTokenSpan();
			this.nextToken();

			let c = null;

			if (this.consumeKeyword('else')) {
				c = new AST.SelectTypeCase(null, this.parseBlock(context.clone(), startSpan));
			} else {
				let p = this.parseDestructuringPattern();
				let context2 = context.clone();

				// whipe enclosing function name
				let fContext = context2?.atFunction ? context2 : null;
				if (fContext != null && fContext.name != null && p.patternBindsName(fContext.name)) {
					fContext.name = null;
				}

				c = new AST.SelectTypeCase(this.parseDestructuringPattern(), this.parseBlock(context2, startSpan));
			}

			cases.push(c);
			this.finishNode(c);
		}

		this.expectKeyword('end');
		this.expectKeyword('select');
		let r = new AST.SelectTypeStmt(discriminant, cases);
		return r;
	}

	parseExitOrContKeyword() {
		let k = this.token.stringValue.toLowercase();
		if (this.token.type == Token.KEYWORD) {
			if (k == 'do' || k == 'while' || k == 'for' || k == 'loop') {
				this.nextToken();
				return k;
			}
		}
		throw this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
	}

	validateExitOrContKeyword(target, k, span) {
		if ((target instanceof AST.DoStmt && k != 'do')
		|| (target instanceof AST.WhileStmt && k != 'while')
		|| (target instanceof AST.ForStmt && k != 'for')
		|| (target instanceof AST.ForEachStmt && k != 'for')
		|| (target instanceof AST.LoopStmt && k != 'for')) {
			throw this.reportSyntaxError('syntaxErrors.syntaxError', span);
		}
	}

	parseImportDrtv() {
		this.nextToken();
		let id = this.parseModuleId();
		let alias = null;
		if (this.consumeKeyword('as')) {
			alias = this.expectIdentifier();
		} else if (id instanceof AST.Ident && this.consume(Token.ASSIGNMENT_OR_EQUALS)) {
			alias = id.name;
			id = this.parseModuleId();
		}
		return new AST.ImportDrtv(id, alias);
	}

	parseIncludeDrtv(src, startSpan, context) {
		this.markLocation(startSpan);
		this.nextToken();
		r = new AST.IncludeDrtv(src);
		r.span = this.popLocation();

		let filePath = Path.resolve(this.script.path, src);
		let fileContent = '';

		try {
			fileContent = FileSystem.readFileSync(filePath, 'utf8');
		} catch (e) {
			this.reportVerifyError('verifyErrors.verifyError', r.span);
		}

		if (r) {
			r.innerScript = new Script(path, fileContent);
			try {
				let parser = new Subparser(new Lexer(r.innerScript));
				try {
					parser.lexer.nextToken();
				} catch (error) {
					if (!(error instanceof Problem)) {
						throw error;
					}
				}
				let startSpan = parser.getTokenSpan();
				let innerBlock = parser.parseBlock(context, startSpan);
				r.innerStatements = innerBlock.substatements;
			} catch (e) {
				if (!(error instanceof Problem)) {
					throw error;
				}
			}
			if (r.innerScript.hasProblems) {
				for (let problem of r.innerScript.problems) {
					this.script.collect(problem);
				}
			}
		}

		return r;
	}

	finishCallOrAwaitOrAssignStatement(exp) {
		this.markLocation(exp.span);
		let compound = this.token.type == Token.COMPOUND_ASSIGNMENT ? this.token.operator : null;
		let r = null;
		if (this.token.type == Token.ASSIGNMENT_OR_EQUALS || compound) {
			this.nextToken();
			let right = this.parseExpression(compound);
			r = new AST.AssignStmt(compound, this.desambiguateIdOrCall(exp), right);
		} else if (this.inlineOrHigherIndent(exp.span)) {
			r = new AST.CallStmt(this.desambiguateIdOrCall(exp), this.parseNoParensArguments());
		} else if (exp instanceof AST.GroupOp) {
			r = new AST.CallStmt(this.desambiguateIdOrCall(exp.base), exp.argumentsList);
		} else if (exp instanceof AST.UnaryOp && exp.operator == Operator.AWAIT) {
			r = new AST.AwaitStmt(exp.exp);
		} else {
			r = new AST.CallStmt(this.desambiguateIdOrCall(exp), []);
		}
		this.finishNode(r);

		return r;
	}

	desambiguateIdOrCall(exp) {
		this.markLocation(exp.span);
		if (exp instanceof AST.MemberOrCallOp) {
			exp = new AST.MemberOp(exp.base, exp.name);
		} else if (exp instanceof AST.WithMemberOrCallOp) {
			exp = new AST.WithMemberOp(exp.name);
		} else if (exp instanceof AST.OptMemberOrCallOpChain) {
			exp = new AST.OptMemberOpChain(exp.base, exp.name);
		} else if (exp instanceof AST.IdentOrCall) {
			exp = new AST.Ident(exp.name);
		}
		this.finishNode(exp);
		return exp;
	}

	parseAnnotatableDecl(context) {
		let startSpan = this.getTokenSpan();
		let r = null;
		let decorators = null;
		let modifiers = new Set;

		while (this.consumeOperator(Operator.LT)) {
			let dec = this.parseExpression(OperatorPrecedence.UNARY);
			let str = dec instanceof AST.Ident ? dec.name : null;
			if (str == 'flags') {
				modifiers.add('flags');
			} else {
				decorators = decorators || [];
				decorators.push(dec);
			}
			this.expectOperator(Operator.GT);
		}

		while (Infinity) {
			if (this.token.type == Token.KEYWORD && annotatableDeclModifiers.has(this.token.stringValue)) {
				modifiers.add(this.token.stringValue);
				this.nextToken();
				continue;
			}
			break;
		}

		if (this.token.type == Token.IDENTIFIER) {
			r = this.parseMemberDecl(this.popLocation(), modifiers, context);
		}
		else if (this.token.isKeyword('module') || this.token.isKeyword('namespace')) {
			r = this.parseModuleDecl(this.popLocation(), modifiers, context);
		}
		else if (this.token.isKeyword('class')) {
			r = this.parseClassDecl(this.popLocation(), modifiers, context);
		}
		else if (this.token.isKeyword('structure')) {
			r = this.parseStructureDecl(this.popLocation(), modifiers, context);
		}
		else if (this.token.isKeyword('interface')) {
			r = this.parseInterfaceDecl(this.popLocation(), modifiers, context);
		}
		else if (this.token.isKeyword('enum')) {
			r = this.parseEnumDecl(this.popLocation(), modifiers, context);
		}
		else if (this.token.isKeyword('typealias')) {
			r = this.parseTypeAliasDecl(this.popLocation(), modifiers, context);
		}
		else if (this.token.isKeyword('function')) {
			r = this.parseFnDecl(this.popLocation(), modifiers, context, false);
		}
		else if (this.token.isKeyword('sub')) {
			r = this.parseFnDecl(this.popLocation(), modifiers, context, true);
		}
		else if (this.token.isKeyword('property')) {
			r = this.parsePropertyGetOrLetDecl(this.popLocation(), modifiers, context);
		}
		else if (this.token.isKeyword('operator')) {
			r = this.parseOperatorDecl(this.popLocation(), modifiers, context);
		}
		else {
			let span = this.popLocation();
			throw this.reportSyntaxError('syntaxErrors.syntaxError', span);
		}
		return this.finishDeclarationNode(startSpan, decorators, modifiers, r);
	}

	finishDeclarationNode(startSpan, decorators, modifiers, node) {
		this.markLocation(startSpan);
		node.decorators = decorators;
		node.modifiers = modifiers;
		this.finishNode(node);
		return node;
	}

	unallowModifier(startSpan, modifierSet, modifierName) {
		if (modifierSet.has(modifierName)) {
			this.reportSyntaxError('syntaxErrors.modifierUnallowed', startSpan, { mod: modifierName });
		}
	}

	unallowModifiers(startSpan, modifierSet, ...modifierNames) {
		for (let name of modifierNames) {
			this.unallowModifier(startSpan, modifierSet, name);
		}
	}

	parseMemberDecl(startSpan, modifiers, context) {
		let name = this.expectIdentifier();
		let typeExp = null;
		let initExp = null;
		if (this.consumeKeyword('as')) {
			if (this.token.isKeyword('new')) {
				initExp = this.parseExpression();
			} else {
				typeExp = this.parseTypeExpression();
			}
		}
		if (!initExp && this.consume(Token.ASSIGNMENT_OR_EQUALS)) {
			initExp = this.parseExpression();
		}
		let r = new AST.MemberDecl(name, typeExp, initExp);

		this.unallowModifiers(startSpan, modifiers,
				'async', 'native', 'notinheritable',
				'notoverridable', 'overrides', 'flags');

		if (!(context instanceof TypeContext)) {
			this.unallowModifier(startSpan, modifiers, 'shared');
		}
		if (!(context.atType('class') || context.atType('structure') || (context.atType('enum') && modifiers.has('shared')) || context instanceof ModuleContext)) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		return r;
	}

	parseModuleDecl(startSpan, modifiers, context) {
		let endKeyword = this.token.stringValue;
		this.nextToken();
		let id = this.parseModuleId();
		let r = null;

		if (id instanceof AST.Ident && this.consume(Token.ASSIGNMENT_OR_EQUALS)) {
			let alias = id.name;
			id = this.parseModuleId();
			r = new AST.ModuleAliasDecl(alias, id);
		} else {
			let block = this.parseBlock(new ModuleContext, startSpan);
			this.expectKeyword('end');
			this.expectKeyword(endKeyword);
			r = new AST.ModuleDecl(id, block);
		}

		this.unallowModifiers(startSpan, modifiers,
			'async', 'native', 'notinheritable',
			'notoverridable', 'overrides', 'shared',
			'flags', 'private', 'protected', 'readonly');

		let dCtx = context instanceof DefaultProgramContext ? context : null;

		if (!(dCtx && dCtx.allowModules) && !(context instanceof ModuleContext)) {
			if (dCtx) {
				this.unallowModifiers(startSpan, modifiers, 'public', 'internal');
			}
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		return r;
	}

	parseModuleId() {
		this.markLocation();
		let id = new AST.Ident(this.expectIdentifier());
		this.finishNode(id);

		while (this.consume(Token.DOT)) {
			this.markLocation(id.span);
			id = new AST.MemberOp(id, this.expectIdentifier(true));
			this.finishNode(id);
		}
		return id;
	}

	parseClassDecl(startSpan, modifiers, context) {
		this.nextToken();
		let name = this.expectIdentifier();
		let inherits = this.consumeKeyword('inherits') ? this.parseTypeExpression() : null;
		let implementsList = this.consumeKeyword('implements') ? this.parseTypeExpressionList() : null;

		let block = this.parseBlock(new TypeContext('class'), startSpan);
		this.expectKeyword('end');
		this.expectKeyword('class');
		let r = new AST.ClassDecl(name, inherits, implementsList, block);

		this.unallowModifiers(startSpan, modifiers,
			'async', 'native', 'notoverridable', 'overrides', 'shared',
			'flags', 'private', 'protected', 'readonly');

		if (context instanceof FunctionContext || context instanceof TypeContext) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		return r;
	}

	parseStructureDecl(startSpan, modifiers, context) {
		this.nextToken();
		let name = this.expectIdentifier();

		let block = this.parseBlock(new TypeContext('structure'), startSpan);
		this.expectKeyword('end');
		this.expectKeyword('structure');
		let r = new AST.StructDecl(name, block);

		this.unallowModifiers(startSpan, modifiers,
			'async', 'native', 'notoverridable', 'notinheritable', 'overrides', 'shared',
			'flags', 'private', 'protected', 'readonly');

		if (context instanceof FunctionContext || context instanceof TypeContext) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		return r;
	}

	parseInterfaceDecl(startSpan, modifiers, context) {
		this.nextToken();
		let name = this.expectIdentifier();
		let inherits = this.consumeKeyword('inherits') ? this.parseTypeExpressionList() : null;

		let block = this.parseBlock(new TypeContext('interface'), startSpan);
		this.expectKeyword('end');
		this.expectKeyword('interface');
		let r = new AST.ItrfcDecl(name, inherits, block);

		this.unallowModifiers(startSpan, modifiers,
			'async', 'native', 'notoverridable', 'notinheritable', 'overrides', 'shared',
			'flags', 'private', 'protected', 'readonly');

		if (context instanceof FunctionContext || context instanceof TypeContext) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		return r;
	}

	parseEnumDecl(startSpan, modifiers, context) {
		this.nextToken();
		let name = this.expectIdentifier();

		let block = this.parseBlock(new TypeContext('enum'), startSpan);
		this.expectKeyword('end');
		this.expectKeyword('enum');
		let r = new AST.EnumDecl(name, block);

		this.unallowModifiers(startSpan, modifiers,
			'async', 'native', 'notoverridable', 'notinheritable', 'overrides', 'shared',
			'private', 'protected', 'readonly');

		if (context instanceof FunctionContext || context instanceof TypeContext) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		return r;
	}

	parseFnDecl(startSpan, modifiers, context, isSub) {
		this.nextToken();
		let modifierSet = modifiers;
		let isConstructor = isSub ? this.consumeKeyword('new') : false;
		let name = isConstructor ? null : this.expectIdentifier();
		let common = null;
		let parenSpan = this.getTokenSpan();

		if (this.consume(Token.LPAREN)) {
			common = this.parseFunctionCommonAfterParen(parenSpan, true, isSub, modifiers.has('async'), isConstructor, name);
		}

		if (common == null) {
			common = this.parseFunctionCommon(isSub, modifiers.has('async'), isConstructor, name);
		}

		if (common.body instanceof AST.Block) {
			this.expectKeyword('end');
			this.expectKeyword(isSub ? 'sub' : 'function');
		}

		let r = null;

		if (isConstructor) {
			r = new AST.ConstructorDecl(common);
		} else {
			r = new AST.FnDecl(name, common);
		}

		if (isConstructor) {
			this.unallowModifiers(startSpan, modifierSet, 'async', 'shared', 'overrides', 'notoverridable');
			if (!context.atType('class') && !context.atType('structure')) {
				this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
			}
		} else if (context instanceof ModuleContext || context instanceof DefaultProgramContext) {
			this.unallowModifiers(startSpan, modifierSet, 'overrides', 'notoverridable', 'shared');
		} else if (context.atType('interface')) {
			this.unallowModifiers(startSpan, modifierSet, 'overrides', 'notoverridable', 'native', 'shared', 'public', 'private', 'protected', 'internal');
		} else if (!context.atType('class')) {
			this.unallowModifiers(startSpan, modifierSet, 'notoverridable');
		}

		// check function body
		if (!context.atType('interface')) {
			if (!modifiers.has('native') && common.body == null) {
				this.reportSyntaxError('syntaxErrors.functionMissingBody', startSpan);
			}
		}

		this.unallowModifiers(startSpan, modifiers,
			'notinheritable', 'flags', 'readonly');

		return r;
	}

	parsePropertyGetOrLetDecl(startSpan, modifiers, context) {
		this.nextToken();
		let isLet = this.token.isKeyword('let') || this.token.isKeyword('set');
		if (!isLet && !this.token.isKeyword('get')) {
			throw this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
		}
		this.nextToken();

		let name = this.expectIdentifier();
		let common = this.parseFunctionCommon(isLet, false, false, name);
		this.markLocation();

		if (common.body instanceof AST.Block) {
			this.expectKeyword('end');
			this.expectKeyword('property');
		}

		let r = null;
		if (isLet) {
			r = new AST.PropertyLetDecl(name, common);
		} else {
			r = new AST.PropertyGetDecl(name, common);
		}

		if (common.optParams != null || common.restParam != null || (common.params == null && isLet)) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		if (context instanceof ModuleContext || context instanceof DefaultProgramContext) {
			this.unallowModifiers(startSpan, modifierSet, 'shared');
		} else if (context.atType('interface')) {
			this.unallowModifiers(startSpan, modifierSet, 'overrides', 'notoverridable', 'native', 'shared', 'public', 'private', 'protected', 'internal');
		} else if (!context.atType('class')) {
			this.unallowModifiers(startSpan, modifierSet, 'notoverridable');
		}

		// check function body
		if (!context.atType('interface')) {
			if (!modifiers.has('native') && common.body == null) {
				this.reportSyntaxError('syntaxErrors.functionMissingBody', startSpan);
			}
		}

		this.unallowModifiers(startSpan, modifiers,
			'notinheritable', 'flags', 'readonly', 'async');

		return r;
	}

	parseOperatorDecl(startSpan, modifiers, context) {
		this.nextToken();

		let opType = null;
		if (this.token.type == Token.KEYWORD) {
			switch (this.token.stringValue) {
				case 'mod':
					opType = Operator.MOD;
					this.nextToken();
					break;
				case 'is':
					opType = Operator.EQUALS;
					this.nextToken();
					break;
				case 'isnot':
					opType = Operator.NOT_EQUALS;
					this.nextToken();
					break;
				case 'not':
					opType = Operator.NOT;
					this.nextToken();
					break;
				case 'and':
					opType = Operator.AND;
					this.nextToken();
					break;
				case 'xor':
					opType = Operator.XOR;
					this.nextToken();
					break;
				case 'or':
					opType = Operator.OR;
					this.nextToken();
					break;
				case 'eqv':
					opType = Operator.EQV;
					this.nextToken();
					break;
				case 'imp':
					opType = Operator.IMP;
					this.nextToken();
					break;
				default:
					throw this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
			}
		} else if (this.token.type == Token.OPERATOR) {
			switch (this.token.operator) {
				case Operator.ADD:
				case Operator.SUBTRACT:
				case Operator.MULTIPLY:
				case Operator.DIVIDE:
				case Operator.EXP:
				case Operator.LEFT_SHIFT:
				case Operator.RIGHT_SHIFT:
				case Operator.UNSIGNED_RIGHT_SHIFT:
				case Operator.NOT_EQUALS:
				case Operator.LT:
				case Operator.GT:
				case Operator.LTE:
				case Operator.GTE:
					opType = this.token.operator;
					this.nextToken();
					break;
				default:
					throw this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
			}
		} else if (this.consume(Token.ASSIGNMENT_OR_EQUALS)) {
			opType = Operator.EQUALS;
		} else if (this.consumeContextKeyword('iterator')) {
			opType = Operator.ITERATOR;
		} else {
			throw this.reportSyntaxError('syntaxErrors.syntaxError', this.getTokenSpan());
		}

		let common = this.parseFunctionCommon(false, false, false);
		this.markLocation();

		if (common.body instanceof AST.Block) {
			this.expectKeyword('end');
			this.expectKeyword('operator');
		}

		let r = new AST.OperatorDecl(opType, common);

		if (common.optParams != null || common.restParam != null) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		let paramCount = common.params != null ? common.params.length : 0;

		if (opType != Operator.ITERATOR && common.isGenerator) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		if (opType == Operator.ITERATOR) {
			if (paramCount > 0) {
				this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
			}
		}
		else if (opType != Operator.GET_INDEX && opType != Operator.SET_INDEX) {
			if (paramCount == 1) {
				if (opType == Operator.SUBTRACT) {
					opType = Operator.NEGATE;
				} else if (opType == Operator.ADD) {
					opType = Operator.POSITIVE;
				} else if (!opType.isUnary && opType != Operator.ITERATOR) {
					this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
				}
			} else if (paramCount == 2) {
				if (opType.isUnary) {
					this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
				}
			} else {
				this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
			}
		} else if (paramCount < 1) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		if (context instanceof ModuleContext || context instanceof DefaultProgramContext) {
			this.unallowModifiers(startSpan, modifierSet);
		} else if (context.atType('interface')) {
			this.unallowModifiers(startSpan, modifierSet, 'native', 'shared', 'public', 'private', 'protected', 'internal');
		}

		if (!(context instanceof TypeContext)) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		// check function body
		if (!context.atType('interface')) {
			if (!modifiers.has('native') && common.body == null) {
				this.reportSyntaxError('syntaxErrors.functionMissingBody', startSpan);
			}
		}

		this.unallowModifiers(startSpan, modifiers,
			'notinheritable', 'notoverridable', 'shared', 'flags',
			'overrides', 'readonly', 'async',
			'public', 'private', 'protected', 'internal');

		return r;
	}

	parseTypeAliasDecl(startSpan, modifiers, context) {
		let name = this.expectIdentifier();
		this.expect(Token.ASSIGNMENT_OR_EQUALS);
		let exp = this.parseTypeExpression();
		r = new AST.TypeAliasDecl(name, exp);

		this.unallowModifiers(startSpan, modifiers,
			'async', 'native', 'notoverridable', 'notinheritable', 'overrides', 'shared',
			'private', 'protected', 'readonly');

		if (context instanceof FunctionContext || context instanceof TypeContext) {
			this.reportSyntaxError('syntaxErrors.syntaxError', startSpan);
		}

		return r;
	}

	parseTypeParamsAfterOf() {
		let r = [];
		do {
			r.push(this.expectIdentifier());
		} while (this.consume(Token.COMMA));
		this.expect(Token.RPAREN);
		return r;
	}
}

class OperatorPrecedence {
	constructor(value) {
		this.value = value;
		OperatorPrecedence._valueOf.set(value, this);
	}
	static valueOf(value) {
		return OperatorPrecedence._valueOf.get(value);
	}
	valueOf() {
		return this.value;
	}
}

OperatorPrecedence._valueOf = new Map;
OperatorPrecedence.POSTFIX = new OperatorPrecedence(14);
OperatorPrecedence.UNARY = new OperatorPrecedence(13);
OperatorPrecedence.MULTIPLICATIVE = new OperatorPrecedence(12);
OperatorPrecedence.ADDITIVE = new OperatorPrecedence(11);
OperatorPrecedence.CONCAT = new OperatorPrecedence(10);
OperatorPrecedence.SHIFT = new OperatorPrecedence(9);
OperatorPrecedence.RELATIONAL = new OperatorPrecedence(8);
OperatorPrecedence.EQUALITY = new OperatorPrecedence(7);
OperatorPrecedence.AND = new OperatorPrecedence(6);
OperatorPrecedence.XOR = new OperatorPrecedence(5);
OperatorPrecedence.OR = new OperatorPrecedence(4);
OperatorPrecedence.EQV = new OperatorPrecedence(3);
OperatorPrecedence.IMP = new OperatorPrecedence(2);
OperatorPrecedence.YIELD = new OperatorPrecedence(1);

class Context {
	constructor() {
		this.nextLabel = null;
		this.labels = new Map;
		this.defaultExitStatement = null;
		this.defaultContinueStatement = null;
	}

	get atModule() {
		return this instanceof ModuleContext;
	}

	get atFunction() {
		return this instanceof FunctionContext;
	}

	atType(kind) {
		return this instanceof TypeContext ? this.kind == kind : false;
	}

	clone() {
		let r = new Context;
		for (let [name, node] of this.labels)
			r.labels.set(name, node);
		r.defaultExitStatement = this.defaultExitStatement;
		r.defaultContinueStatement = this.defaultContinueStatement;
		return new Context;
	}
}

class ModuleContext extends Context {
	constructor() {
		super();
	}

	clone() {
		return new ModuleContext;
	}
}

class TypeContext extends Context {
	constructor(kind) {
		super();
		this.kind = kind.toLowerCase();
	}

	ofKind(kind) {
		return this.kind == kind.toLowerCase();
	}

	clone() {
		return new TypeContext(this.kind);
	}
}

class FunctionContext extends Context {
	constructor() {
		super();
		this.isConstructor = false;
		this.name = null;
		this.foundSuperStatement = false;
	}

	clone() {
		let r = new FunctionContext;
		for (let [name, node] of this.labels)
			r.labels.set(name, node);
		r.name = this.name;
		r.defaultExitStatement = this.defaultExitStatement;
		r.defaultContinueStatement = this.defaultContinueStatement;
		return r;
	}
}

class DefaultProgramContext extends Context {
	constructor(allowModules = true) {
		super();
		this.allowModules = allowModules;
	}

	clone() {
		return new DefaultProgramContext(this.allowModules);
	}
}