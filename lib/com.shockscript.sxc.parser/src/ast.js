import Operator from './operator.js';
import { Span } from './source-objects.js';

export class Node {
	constructor() {
		this.span = null;
	}

	get patternBindsName(name) {
		return false;
	}

	get name() {
		return null;
	}
}

export class Exp extends Node {
	constructor() {
		super();
	}

	get isFlagsDecoration() {
		return this instanceof Ident && this.name.toLowerCase() == 'flags';
	}
}

export class Ident extends Exp {
	constructor(name) {
		super();
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

export class IdentOrCall extends Exp {
	constructor(name) {
		super();
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

export class StrLtr extends Exp {
	constructor(value) {
		super();
		this.value = value;
	}
}

export class BoolLtr extends Exp {
	constructor(value) {
		super();
		this.value = value;
	}
}

export class DecLtr extends Exp {
	constructor(value) {
		super();
		/**
		 * Holds 128-bit floating-point from the
		 * [double.js](https://www.npmjs.com/package/double.js) package.
		 * @type Decimal
		 */
		this.value = value;
	}
}

export class LongLtr extends Exp {
	constructor(value) {
		super();
		/**
		 * @type bigint
		 */
		this.value = value;
	}
}

export class NothingLtr extends Exp {
	constructor() {
		super();
	}
}

export class NullLtr extends Exp {
	constructor() {
		super();
	}
}

export class EmptyLtr extends Exp {
	constructor() {
		super();
	}
}

export class MeLtr extends Exp {
	constructor() {
		super();
	}
}

export class ParensExp extends Exp {
	constructor(exp) {
		super();
		this.exp = exp;
	}
}

export class FnExp extends Exp {
	constructor(common) {
		super();
		this.common = common;
	}

	get isAsync() {
		return this.common.isAsync;
	}
	set isAsync(value) {
		this.common.isAsync = value;
	}

	get isGenerator() {
		return this.common.isGenerator;
	}
	set isGenerator(value) {
		this.common.isGenerator = value;
	}
}

export class FnCommon extends Node {
	constructor(isSub, isAsync, isGenerator, params, optParams, restParam, returnType, body) {
		super();
		this.isSub = isSub;
		this.isAsync = isAsync;
		this.isGenerator = isGenerator;
		/**
		 * `DestructuringPattern`s.
		 */
		this.params = params;
		this.optParams = optParams;
		/**
		 * A `DestructuringPattern`.
		 */
		this.restParam = restParam;
		this.returnType = returnType;
		this.body = body;
	}
}

export class Spread extends Exp {
	constructor(exp) {
		super();
		this.exp = exp;
	}
}

export class TupleLtr extends Exp {
	constructor(elements) {
		super();
		this.elements = elements;
	}
}

export class CollectionLtr extends Exp {
	constructor(elements) {
		super();
		/**
		 * Expressions and spreads allowed.
		 */
		this.elements = elements;
	}
}

export class DictLtr extends Exp {
	constructor(fields) {
		super();
		/**
		 * Fields and spreads allowed.
		 */
		this.fields = fields;
	}
}

export class DictLtrField extends Node {
	constructor(name, value) {
		super();
		this._name = name;
		/**
		 * Value cannot be omitted in structure initializer.
		 */
		this.value = value;
	}

	get name() {
		return this._name;
	}
}

export class WithMemberOp extends Exp {
	constructor(name) {
		super();
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

export class WithMemberOrCallOp extends Exp {
	constructor(name) {
		super();
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

export class MemberOp extends Exp {
	constructor(base, name) {
		super();
		this.base = base;
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

export class MemberOrCallOp extends Exp {
	constructor(base, name) {
		super();
		this.base = base;
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

export class GroupOp extends Exp {
	constructor(base, argumentsList) {
		super();
		this.base = base;
		this.argumentsList = argumentsList;
	}
}

export class EmbedOp extends Exp {
	constructor(src) {
		super();
		this.src = src;
	}
}

export class NewOp extends Exp {
	constructor(base, argumentsList) {
		super();
		this.base = base;
		this.argumentsList = argumentsList;
	}
}

export class SuperExp extends Exp {
	constructor(argumentsList) {
		super();
		this.argumentsList = argumentsList;
	}
}

export class CondExp extends Exp {
	constructor(exp1, exp2, exp3) {
		super();
		this.exp1 = exp1;
		this.exp2 = exp2;
		this.exp3 = exp3;
	}
}

export class UnaryOp extends Exp {
	constructor(operator, exp) {
		super();
		this.operator = operator;
		this.exp = exp;
	}
}

export class BinOp extends Exp {
	constructor(operator, exp1, exp2) {
		super();
		this.operator = operator;
		this.exp1 = exp1;
		this.exp2 = exp2;
	}
}

export class TypeOfIsExp extends Exp {
	constructor(exp1, exp2) {
		super();
		this.exp1 = exp1;
		this.exp2 = exp2;
	}
}

export class TypeOfIsNotExp extends Exp {
	constructor(exp1, exp2) {
		super();
		this.exp1 = exp1;
		this.exp2 = exp2;
	}
}

export class OptMemberOpChain extends Exp {
	constructor(base, name) {
		super();
		this.base = base;
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

export class OptMemberOrCallOpChain extends Exp {
	constructor(base, name) {
		super();
		this.base = base;
		this._name = name;
	}

	get name() {
		return this._name;
	}
}

export class OptGroupOpChain extends Exp {
	constructor(base, argumentsList) {
		super();
		this.base = base;
		this.argumentsList = argumentsList;
	}
}

export class GetTypeExp extends Exp {
	constructor(exp) {
		super();
		this.exp = exp;
	}
}

export class CTypeExp extends Exp {
	constructor(exp1, exp2) {
		super();
		this.exp1 = exp1;
		this.exp2 = exp2;
	}
}

export class TryCastExp extends Exp {
	constructor(exp1, exp2) {
		super();
		this.exp1 = exp1;
		this.exp2 = exp2;
	}
}

export class TypeExp extends Exp {
	constructor() {
		super();
	}
}

export class TupleTypeExp extends TypeExp {
	constructor(elements) {
		super();
		this.elements = elements;
	}
}

export class FnTypeParam extends Node {
	constructor(name, type) {
		super();
		this._name = name;
		/**
		 * Nullable.
		 */
		this.type = type;
	}

	get name() {
		return this._name;
	}
}

export class NullableTypeExp extends TypeExp {
	constructor(exp) {
		super();
		this.exp = exp;
	}
}

export class Stmt extends Node {
	constructor() {
		super();
	}
}

export class Drtv extends Stmt {
	constructor() {
		super();
	}
}

export class ImportDrtv extends Drtv {
	constructor(id, alias) {
		super();
		/**
		 * An `Ident` or `MemberOp` node.
		 */
		this.id = id;
		/**
		 * Nullable.
		 * @type String
		 */
		this.alias = alias;
	}
}

export class IncludeDrtv extends Drtv {
	constructor(src) {
		super();
		this.src = src;
		this.innerScript = null;
		this.innerStatements = null;
	}
}

export class AnnotatableDecl extends Drtv {
	constructor() {
		super();
		/**
		 * Nullable.
		 * @type {Array}
		 */
		this.decorators = null;
		/**
		 * @type {Set}
		 */
		this.modifiers = new Set;
	}

	hasModifier(name) {
		return this.modifiers.indexOf(name.toLowerCase()) != -1;
	}
}

export class ModuleDecl extends AnnotatableDecl {
	constructor(id, block) {
		super();
		/**
		 * An `Ident` or `MemberOp` node.
		 */
		this.id = id;
		this.block = block;
	}
}

export class ModuleAliasDecl extends AnnotatableDecl {
	constructor(alias, id) {
		super();
		/**
		 * @type {String}
		 */
		this.alias = alias;
		/**
		 * An `Ident` or `MemberOp` node.
		 */
		this.id = id;
	}
}

export class ClassDecl extends AnnotatableDecl {
	constructor(name, inherits, implementsList, block) {
		super();
		this._name = name;
		this.inherits = inherits;
		this.implements = implementsList;
		this.block = block;
	}

	get name() {
		return this._name;
	}
}

export class StructDecl extends AnnotatableDecl {
	constructor(name, block) {
		super();
		this._name = name;
		this.block = block;
	}

	get name() {
		return this._name;
	}
}

export class ItrfcDecl extends AnnotatableDecl {
	constructor(name, inherits, block) {
		super();
		this._name = name;
		this.inherits = inherits;
		this.block = block;
	}

	get name() {
		return this._name;
	}
}

export class EnumDecl extends AnnotatableDecl {
	constructor(name, block) {
		super();
		this._name = name;
		this.block = block;
	}

	get name() {
		return this._name;
	}
}

export class TypeAliasDecl extends AnnotatableDecl {
	constructor(name, exp) {
		super();
		this._name = name;
		this.exp = exp;
	}

	get name() {
		return this._name;
	}
}

export class FnDecl extends AnnotatableDecl {
	constructor(name, common) {
		super();
		this._name = name;
		this.common = common;
	}

	get name() {
		return this._name;
	}
}

export class ConstructorDecl extends AnnotatableDecl {
	constructor(common) {
		super();
		this.common = common;
	}
}

export class MemberDecl extends AnnotatableDecl {
	constructor(name, typeExp, initExp) {
		super();
		this._name = name;
		this.typeExp = typeExp;
		this.initExp = initExp;
	}

	get name() {
		return this._name;
	}
}

export class PropertyGetDecl extends AnnotatableDecl {
	constructor(name, common) {
		super();
		this._name = name;
		this.common = common;
	}

	get name() {
		return this._name;
	}
}

export class PropertyLetDecl extends AnnotatableDecl {
	constructor(name, common) {
		super();
		this._name = name;
		this.common = common;
	}

	get name() {
		return this._name;
	}
}

export class OperatorDecl extends AnnotatableDecl {
	constructor(operator, common) {
		super();
		this.operator = operator;
		this.common = common;
	}
}

export class VarBinding extends Node {
	constructor(pattern, initExp) {
		super();
		this.pattern = pattern;
		this.initExp = initExp;
	}
}

export class DestructuringPattern extends Node {
	constructor(type) {
		super();
		this.type = type;
	}
}

export class NonDestructuringPattern extends DestructuringPattern {
	constructor(name, type) {
		super(type);
		this._name = name;
	}

	get patternBindsName(name) {
		return this.name.toLowerCase() == name.toLowerCase();
	}

	get name() {
		return this._name;
	}
}

export class CollectionOrTuplePattern extends DestructuringPattern {
	constructor(elements, type) {
		super(type);
		/**
		 * Elements. Underscore positions are filled with `null`.
		 */
		this.elements = elements;
	}

	get patternBindsName(name) {
		return this.elements.some(e => e?.patternBindsName(name));
	}
}

export class Block extends Stmt {
	constructor(substatements) {
		super();
		this.substatements = substatements;
	}
}

export class VarDecl extends Stmt {
	constructor(binding) {
		super();
		this.binding = binding;
	}
}

export class AwaitStmt extends Stmt {
	constructor(base) {
		super();
		this.base = base;
	}
}

/**
 * Assignment statement or short variable declaration.
 */
export class AssignStmt extends Stmt {
	constructor(compound, left, right) {
		super();
		/**
		 * `Operator`` or null.
		 */
		this.compound = compound;
		this.left = left;
		this.right = right;
	}
}

export class ExitStmt extends Stmt {
	constructor(label) {
		super();
		/**
		 * Target statement.
		 */
		this.target = null;
		/**
		 * Nullable.
		 * @type {String}
		 */
		this.label = label;
	}
}

export class ContStmt extends Stmt {
	constructor(label) {
		super();
		/**
		 * Target statement.
		 */
		this.target = null;
		/**
		 * Nullable.
		 * @type {String}
		 */
		this.label = label;
	}
}

export class CallStmt extends Stmt {
	constructor(base, argumentsList) {
		super();
		this.base = base;
		this.argumentsList = argumentsList;
	}
}

export class EmptyStmt extends Stmt {
}

export class LabeledStmt extends Stmt {
	constructor(label) {
		super();
		this.label = label;
	}
}

export class DoStmt extends LabeledStmt {
	constructor(block, condExp) {
		super(null);
		this.block = block;
		/**
		 * Nullable. If `null`, this is a non-loop statement.
		 */
		this.condExp = condExp;

		/**
		 * Nullable. "while" or "until".
		 */
		this.prefix = null;
		/**
		 * Nullable. "while" or "until".
		 */
		this.postfix = null;
	}
}

export class WhileStmt extends LabeledStmt {
	constructor(condExp, block) {
		super(null);
		this.condExp = condExp;
		this.block = block;
	}
}

export class ForStmt extends LabeledStmt {
	constructor(varName, varType, from, to, step, block) {
		super(null);
		this.varName = varName;
		this.varType = varType;
		this.from = from;
		this.to = to;
		this.step = step;
		this.block = block;
	}
}

export class ForEachStmt extends LabeledStmt {
	constructor(left, right, block) {
		super(null);
		this.left = left;
		this.right = right;
		this.block = block;
	}
}

export class LoopStmt extends LabeledStmt {
	constructor(block) {
		super(null);
		this.block = block;
	}
}

export class IfStmt extends Stmt {
	constructor(cond, block, elseClauses) {
		super();
		this.cond = cond;
		this.block = block;
		this.elseClauses = elseClauses;
	}
}

export class ElseClause extends Node {
	constructor(cond, block) {
		super();
		/**
		 * `Exp` node (for `ElseIf`) or null (for `Else`).
		 */
		this.cond = cond;
		this.block = block;
	}
}

export class RetStmt extends Stmt {
	constructor(exp) {
		super();
		this.exp = exp;
	}
}

export class SuperStmt extends Stmt {
	constructor(argumentsList) {
		super();
		this.argumentsList = argumentsList;
	}
}

export class SelectStmt extends Stmt {
	constructor(discriminant, cases) {
		super();
		this.discriminant = discriminant;
		this.cases = cases;
	}
}

export class SelectCase extends Node {
	constructor(expList) {
		super();
		/**
		 * List of `Exp`, `CaseTo` and `CaseOp` nodes.
		 * If empty, the `SelectCase` node is `Case Else`.
		 */
		this.expList = expList;
	}
}

export class CaseTo extends Node {
	constructor(from, to) {
		super();
		this.from = from;
		this.to = to;
	}
}

export class CaseOp extends Node {
	constructor(operator, exp) {
		super();
		this.operator = operator;
		this.exp = exp;
	}
}

export class SelectTypeStmt extends Stmt {
	constructor(discriminant, cases) {
		super();
		this.discriminant = discriminant;
		this.cases = cases;
	}
}

export class SelectTypeCase extends Node {
	constructor(pattern, block) {
		super();
		/**
		 * If null, this is a `Case Else` case.
		 */
		this.pattern = pattern;
		this.block = block;
	}
}

export class ThrowStmt extends Stmt {
	constructor(exp) {
		super();
		this.exp = exp;
	}
}

export class TryStmt extends Stmt {
	constructor(tryBlock, catchClauses, finallyClause) {
		super();
		this.tryBlock = tryBlock;
		this.catchClauses = catchClauses;
		this.finallyClause = finallyClause;
	}
}

export class TryCatch extends Node {
	constructor(pattern, block) {
		super();
		this.pattern = pattern;
		this.block = block;
	}
}

export class TryFinally extends Node {
	constructor(block) {
		super();
		this.block = block;
	}
}

export class WithStmt extends Stmt {
	constructor(exp, block) {
		super();
		this.exp = exp;
		this.block = block;
	}
}