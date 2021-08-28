import { TokenInfo, Token } from './lexer-token.js';
import { Script, SourceCharacter, Comment, Span } from './source-objects.js';
import { Problem, ProblemWordId } from './problem.js';
import Operator from './operator.js';
import { Double as Decimal } from 'double.js';

export { TokenInfo, Token };

export class Lexer {
	constructor(script) {
		if (typeof script == 'string')
			script = new Script('Anonymous.sx', script);
		this._script = script;
		this._text = script.text;
		this._textPosition = 0;
		this._textLength = script.text.length;
		this._line = 1;
		this._token = new TokenInfo;
		this._sectionStart = -1;
	}

	reflectScript() {
		return this._script;
	}

	get token() {
		return this._token;
	}

	lookahead(from = 0) {
		return this._text.charCodeAt(this._textPosition + from);
	}

	lookaheadSeq(from = 0, count = 1) {
		let i = this._textPosition + from;
		return this._text.slice(i, i + count);
	}

	nextChar() {
		let r = this.lookahead(0);
		this.skipChar();
		return r;
	}

	skipChar() {
		if (this._textPosition < this._textLength)
			++this._textPosition;
	}
	skipChars(amount) {
		this._textPosition += amount;
		if (this._textPosition > this._textLength)
			this._textPosition = this._textLength;
	}

	beginToken() {
		this._token.start = this._textPosition;
		this._token.firstLine = this._line;
	}

	endToken(type, skipChars = 0) {
		if (skipChars > 0)
			this._textPosition += skipChars,
			this._textPosition = this._textPosition > this._textLength ? this._textLength : this._textPosition;
		this._token.type = type;
		this._token.end = this._textPosition;
		this._token.lastLine = this._line;
	}

	beginCharSection() {
		this._sectionStart = this._textPosition;
	}

	endCharSection() {
		let k = this._sectionStart;
		this._sectionStart = -1;
		return this._text.slice(k, this._textPosition);
	}

	get hasRemainingChars() {
		return this._textPosition < this._textLength;
	}

	reportUnexpectedChar() {
		let p = null;
		if (!this.hasRemainingChars)
			p = new Problem('syntaxErrors.empty', 'syntaxError', null, this.getCharacterLocation());
		else p = new Problem('syntaxErrors.unexpectedCharacter', 'syntaxError', { charac: this.lookaheadSeq(0, 1) }, this.getCharacterLocation());
		this._script.collect(p);
		return p;
	}

	getCharacterLocation() {
		return Span.point(this._script, this._line, this._textPosition);
	}

	getCharacterForProblem() {
		return this.hasRemainingChars ? this.lookaheadSeq(0, 1) : Token.EMPTY;
	}

	scan() {
		let cv = 0;
		while (Infinity) {
			cv = this.lookahead();
			if (SourceCharacter.isWhitespace(cv)) {
				this.skipChar();
			} else if (!this.scanLineTerminator() && !this.scanComment()) {
				break;
			}
		}
		this.beginToken();
		if (SourceCharacter.isIdentifierStart(cv) || (cv == 0x5F && SourceCharacter.isIdentifierPart(this.lookahead(1)))) {
			this.beginCharSection();
			this.skipChar();
			while (SourceCharacter.isIdentifierPart(this.lookahead(0)))
				this.skipChar();
			let s = this.endCharSection();
			let [kw, booleanLiteral] = this.filterKeyword(s);
			if (booleanLiteral)
				this.endToken(Token.BOOLEAN_LITERAL),
				this._token.booleanValue = s.toLowerCase() == 'true';
			else this.endToken(kw ? Token.KEYWORD : Token.IDENTIFIER),
				this._token.stringValue = kw ? s.toLowerCase() : s;
		}
		else if (cv == 0x5B) {
			this.skipChar();
			this.beginCharSection();
			if (SourceCharacter.isIdentifierPart(this.lookahead(0)))
				this.skipChar();
			else this.reportUnexpectedChar();
			while (SourceCharacter.isIdentifierPart(this.lookahead(0)))
					this.skipChar();
			let s = this.endCharSection();
			if (this.lookahead(0) == 0x5D)
				this.skipChar();
			else this.reportUnexpectedChar();
			this.endToken(Token.IDENTIFIER);
			this._token.stringValue = s;
		}
		else if (SourceCharacter.isDecimalDigit(cv))
			return this.scanNumericLiteral();
		else if (cv == 0x22 || cv == 0x201c)
			return this.scanStringLiteral();
		else {
			let slice = this.lookaheadSeq(0, 4);
			switch (slice) {
				case '>>>=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 4);
					this._token.operator = Operator.UNSIGNED_RIGHT_SHIFT;
					return;
			}
			switch (slice.slice(0, 3)) {
				case '...':
					this.endToken(Token.ELLIPSIS, 3);
					return;
				case '>>>':
					this.endToken(Token.OPERATOR, 3);
					this._token.operator = Operator.UNSIGNED_RIGHT_SHIFT;
					return;
				case '<<=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 3);
					this._token.operator = Operator.LEFT_SHIFT;
					return;
				case '>>=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 3);
					this._token.operator = Operator.RIGHT_SHIFT;
					return;
			}
			switch (slice.slice(0, 2)) {
				case '<<':
					this.endToken(Token.OPERATOR, 2);
					this._token.operator = Operator.LEFT_SHIFT;
					return;
				case '>>':
					this.endToken(Token.OPERATOR, 2);
					this._token.operator = Operator.RIGHT_SHIFT;
					return;
				case '<=':
					this.endToken(Token.OPERATOR, 2);
					this._token.operator = Operator.LTE;
					return;
				case '>=':
					this.endToken(Token.OPERATOR, 2);
					this._token.operator = Operator.GTE;
					return;
				case '<>':
					this.endToken(Token.OPERATOR, 2);
					this._token.operator = Operator.NOT_EQUALS;
					return;
				case '+=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 2);
					this._token.operator = Operator.ADD;
					return;
				case '-=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 2);
					this._token.operator = Operator.SUBTRACT;
					return;
				case '*=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 2);
					this._token.operator = Operator.MULTIPLY;
					return;
				case '/=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 2);
					this._token.operator = Operator.DIVIDE;
					return;
				case '^=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 2);
					this._token.operator = Operator.EXP;
					return;
				case '&=':
					this.endToken(Token.COMPOUND_ASSIGNMENT, 2);
					this._token.operator = Operator.X;
					return;
			}
			switch (slice.charAt(0)) {
				case '&': {
					let c2 = this.lookaheadSeq(1, 1).toLowerCase();
					if (c2 == 'h') return this.scanHexLiteral();
					if (c2 == 'o') return this.scanOctalLiteral();
					if (c2 == 'b') return this.scanBinLiteral();
					this.endToken(Token.AMP, 1);
					return;
				}
				case '.': {
					if (SourceCharacter.isDecimalDigit(this.lookahead(1)))
						this.scanNumericLiteral();
					else this.endToken(Token.DOT, 1);
					return;
				}
				case '=':
					this.endToken(Token.ASSIGNMENT_OR_EQUALS, 1);
					return;
				case '(':
					this.endToken(Token.LPAREN, 1);
					return;
				case ')':
					this.endToken(Token.RPAREN, 1);
					return;
				case '{':
					this.endToken(Token.LBRACE, 1);
					return;
				case '}':
					this.endToken(Token.RBRACE, 1);
					return;
				case ':':
					this.endToken(Token.COLON, 1);
					return;
				case ',':
					this.endToken(Token.COMMA, 1);
					return;
				case '?':
					this.endToken(Token.QMARK, 1);
					return;
				case '_':
					this.endToken(Token.UNDERSCORE, 1);
					return;
				case '+':
					this.endToken(Token.OPERATOR, 1);
					this._token.operator = Operator.ADD;
					return;
				case '-':
					this.endToken(Token.OPERATOR, 1);
					this._token.operator = Operator.SUBTRACT;
					return;
				case '*':
					this.endToken(Token.OPERATOR, 1);
					this._token.operator = Operator.MULTIPLY;
					return;
				case '/':
					this.endToken(Token.OPERATOR, 1);
					this._token.operator = Operator.DIVIDE;
					return;
				case '^':
					this.endToken(Token.OPERATOR, 1);
					this._token.operator = Operator.EXP;
					return;
				case '<':
					this.endToken(Token.OPERATOR, 1);
					this._token.operator = Operator.LT;
					return;
				case '>':
					this.endToken(Token.OPERATOR, 1);
					this._token.operator = Operator.GT;
					return;
				case '#':
					this.endToken(Token.HASH, 1);
					return;
			}
			if (this.hasRemainingChars) {
				throw this.reportUnexpectedChar();
				this.scan();
			}
			else this.endToken(Token.EMPTY);
		}
	}

	filterKeyword(s) {
		s = s.toLowerCase();
		switch (s.length) {
			case 2:
				return s == 'as' || s == 'do' || s == 'in' || s == 'is' || s == 'me' || s == 'or' || s == 'to' ? [ true, false ] : [ false, false ];
			case 3:
				return s == 'and' || s == 'end' || s == 'eqv' || s == 'for' || s == 'get' || s == 'imp' || s == 'let' || s == 'mod' || s == 'new' || s == 'not' || s == 'set' || s == 'sub' || s == 'try' || s == 'xor' ? [ true, false ] : [ false, false ];
			case 4:
				return s == 'call' || s == 'case' || s == 'else' || s == 'enum' || s == 'exit' || s == 'loop' || s == 'next' || s == 'null' || s == 'step' || s == 'then' || s == 'wend' || s == 'when' || s == 'with' ? [ true, false ] :
					s == 'true' ? [ true, true ] : [ false, false ];
			case 5:
				return s == 'async' || s == 'await' || s == 'catch' || s == 'class' || s == 'ctype' || s == 'empty' || s == 'false' || s == 'isnot' || s == 'super' || s == 'throw' || s == 'until' || s == 'where' || s == 'while' || s == 'yield' ? [ true, false ] :
					s == 'false' ? [ true, true ] : [ false, false ];
			case 6:
				return s == 'elseif' || s == 'import' || s == 'module' || s == 'native' || s == 'public' || s == 'return' || s == 'select' || s == 'shared' || s == 'typeof' ? [ true, false ] : [ false, false ];
			case 7:
				return s == 'finally' || s == 'gettype' || s == 'imports' || s == 'nothing' || s == 'private' || s == 'trycast' ? [ true, false ] : [ false, false ];
			case 8:
				return s == 'continue' || s == 'function' || s == 'inherits' || s == 'internal' || s == 'operator' || s == 'property' || s == 'readonly' ? [ true, false ] : [ false, false ];
			case 9:
				return s == 'closureof' || s == 'interface' || s == 'namespace' || s == 'overrides' || s == 'protected' || s == 'structure' || s == 'typealias' ? [ true, false ] : [ false, false ];
			case 10:
				return s == 'implements' ? [ true, false ] : [ false, false ];
			case 14:
				return s == 'notinheritable' || s == 'notoverridable' ? [ true, false ] : [ false, false ];
		}
		return [ false, false ];
	}

	scanLineTerminator() {
		let c1 = this.lookahead(0);
		let crlf = c1 == 0x0D && this.lookahead(1) == 0x0A;
		if (crlf || SourceCharacter.isLineTerminator(c1)) {
			this.skipChars(crlf ? 2 : 1);
			this._line += 1;
			this._script._lineStarts.push(this._textPosition);
			return true;
		}
		return false;
	}

	scanComment() {
		if (this.lookahead(0) != 0x27) {
			return false;
		}
		this.beginCharSection();
		let start = this._textPosition;
		while (this.hasRemainingChars && !SourceCharacter.isLineTerminator(this.lookahead(0))) {
			this.skipChar();
		}
		let s = this.endCharSection();
		this._script._comments.push(new Comment(s, Span.inline(this._script, this._line, start, this._textPosition)));
		return true;
	}

	scanStringLiteral() {
		let lines = [];
		let builder = [];
		let delim = this.lookahead(0);
		delim = delim == 0x201c ? 0x201d : delim;
		this.skipChar();
		this.scanLineTerminator();
		this.beginCharSection();
		while (Infinity) {
			let c = this.lookahead(0);
			if (c == delim) {
				if (this.lookahead(1) == delim)
					builder.push(this.endCharSection(), '"'),
					this.skipChars(2),
					this.beginCharSection();
				else break;
			}
			else if (SourceCharacter.isLineTerminator(c))
				builder.push(this.endCharSection()),
				lines.push(builder.join('')),
				builder.length = 0,
				this.scanLineTerminator(),
				this.beginCharSection();
			else if (!this.hasRemainingChars)
				throw this.reportUnexpectedChar();
			else this.skipChar();
		}
		builder.push(this.endCharSection());
		lines.push(builder.join(''));
		this.skipChar();
		this.endToken(Token.STRING_LITERAL);
		this._token.stringValue = this.joinStringLiteralLines(lines);
	}

	joinStringLiteralLines(lines) {
		let leadLine = lines.pop();
		let indent = 0;
		let i = 0;
		for (i = 0; i < leadLine.length; ++i)
			if (!SourceCharacter.isWhitespace(leadLine.charCodeAt(i)))
				break;
		indent = i;
		lines = lines.map(line => {
			for (i = 0; i < indent; ++i)
				if (!SourceCharacter.isWhitespace(line.charCodeAt(i)))
					break;
			return line.slice(i);
		});
		lines.push(leadLine.slice(indent));
		return lines.join('\n');
	}

	scanNumericLiteral() {
		this.beginCharSection();
		let c = this.lookahead(0);
		let startedWithDot = c == 0x2E;
		let startedWithZero = c == 0x30;
		let hadAnyDot = startedWithDot;
		if (startedWithDot) {
			this.skipChars(2);
		}
		if (!startedWithZero) {
			while (SourceCharacter.isDecDigit(this.lookahead(0))) {
				this.skipChar();
			}
		} else {
			this.skipChar();
		}
		if (!startedWithDot && this.lookahead(0) == 0x2E) {
			hadAnyDot = true;
			do {
				this.skipChar();
			} while (SourceCharacter.isDecDigit(this.lookahead(0)));
		}

		c = this.lookahead(0);
		let hadE = false;

		if (c == 0x45 || c == 0x65) {
			hadE = true;
			this.skipChar();
			c = this.lookahead(0);
			if (c == 0x2B || c == 0x2D) {
				this.skipChar();
			}
			if (!SourceCharacter.isDecDigit(this.lookahead(0))) {
				this.reportUnexpectedChar();
			}
			do {
				this.skipChar();
			} while (SourceCharacter.isDecDigit(this.lookahead(0)))
		}
		let str = this.endCharSection();

		if (!hadAnyDot && !hadE) {
			this.endToken(Token.LONG_LITERAL);
			this.bigIntValue = BigInt(str);
		} else {
			if (startedWithDot) {
				str = '0' + str;
			}
			this.endToken(Token.DECIMAL_LITERAL);
			this.decimalValue = new Decimal(str);
		}
	}

	scanOctalLiteral() {
		this.skipChars(2);
		this.beginCharSection();
		if (!SourceCharacter.isOctalDigit(this.lookahead(0)))
			this.reportUnexpectedChar();
		do
			this.skipChar();
		while (SourceCharacter.isOctalDigit(this.lookahead(0)))
		this.endCharSection();
		this.endToken(Token.LONG_LITERAL);
		this.bigIntValue = BigInt('0o' + this.endCharSection());
	}

	scanBinLiteral() {
		this.skipChars(2);
		this.beginCharSection();
		if (!SourceCharacter.isBinDigit(this.lookahead(0)))
			this.reportUnexpectedChar();
		do
			this.skipChar();
		while (SourceCharacter.isBinDigit(this.lookahead(0)))
		this.endCharSection();
		this.endToken(Token.LONG_LITERAL);
		this.bigIntValue = BigInt('0b' + this.endCharSection());
	}

	scanHexLiteral() {
		this.skipChars(2);
		this.beginCharSection();
		if (!SourceCharacter.isHexDigit(this.lookahead(0)))
			this.reportUnexpectedChar();
		do
			this.skipChar();
		while (SourceCharacter.isHexDigit(this.lookahead(0)))
		this.endCharSection();
		this.endToken(Token.LONG_LITERAL);
		this.bigIntValue = BigInt('0x' + this.endCharSection());
	}
}
