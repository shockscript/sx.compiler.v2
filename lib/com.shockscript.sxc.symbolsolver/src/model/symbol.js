import { Operator } from 'com.shockscript.sxc.parser';
import Names, { NamesHierarchy } from './names.js';
import { AnyRangeNumbers, Byte, Short, Integer, Long, Single, Char } from '../numbers';
import { Double as Decimal } from 'double.js';

const Double = Number;

export default class Symbol {
    constructor() {
        this._host = null;
    }

    get host() {
        return this._host;
    }

    get isTargetAndValuePair() {
        return false;
    }
    get isShortVarDeclAssignment() {
        return false;
    }
    get isSkipVarDecl() {
        return false;
    }
    get isModule() {
        return false;
    }
    get isVariableSlot() {
        return false;
    }
    get isVirtualSlot() {
        return false;
    }
    get isMethodSlot() {
        return false;
    }
    get isInstanceMe() {
        return false;
    }
    get isClassStaticMe() {
        return false;
    }
    get isIncompatibleOverrideSignatureError() {
        return false;
    }
    get isMustOverrideAMethodError() {
        return false;
    }
    get isNotOverridableError() {
        return false;
    }
    get isOverridingPrivateError() {
        return false;
    }
    get isOverridingWithDifferentVisibilityError() {
        return false;
    }
    get isAmbiguousReferenceError() {
        return false;
    }
    get isDuplicateDefinitionError() {
        return false;
    }
    get isWrongNumberOfArgumentsError() {
        return false;
    }
    get isFunctionSignature() {
        return false;
    }
    get isValue() {
        return false;
    }
    get isConstant() {
        return false;
    }
    get isEmptyConstant() {
        return false;
    }
    get isNothingConstant() {
        return false;
    }
    get isNullConstant() {
        return false;
    }
    get isStringConstant() {
        return false;
    }
    get isBooleanConstant() {
        return false;
    }
    get isSingleConstant() {
        return false;
    }
    get isDoubleConstant() {
        return false;
    }
    get isByteConstant() {
        return false;
    }
    get isIntegerConstant() {
        return false;
    }
    get isLongConstant() {
        return false;
    }
    get isDecimalConstant() {
        return false;
    }
    get isCharConstant() {
        return false;
    }
    get isEnumConstant() {
        return false;
    }
    get isObjectValue() {
        return false;
    }
    get isFrame() {
        return false;
    }
    get isClassFrame() {
        return false;
    }
    get isStructureFrame() {
        return false;
    }
    get isEnumFrame() {
        return false;
    }
    get isInterfaceFrame() {
        return false;
    }
    get isModuleFrame() {
        return false;
    }
    get isActivation() {
        return false;
    }
    get isWithFrame() {
        return false;
    }
    get isSymbolAlias() {
        return false;
    }
    get isType() {
        return false;
    }
    get isAnyType() {
        return false;
    }
    get isEmptyType() {
        return false;
    }
    get isNothingType() {
        return false;
    }
    get isNullType() {
        return false;
    }
    get isClass() {
        return false;
    }
    get isStructure() {
        return false;
    }
    get isEnum() {
        return false;
    }
    get isInterface() {
        return false;
    }
    get isNullableType() {
        return false;
    }
    get isTupleType() {
        return false;
    }
    get isDelegate() {
        return false;
    }
    get isReferenceValue() {
        return false;
    }
    get isDynamicReferenceValue() {
        return false;
    }
    get isIndexReferenceValue() {
        return false;
    }
    get isTupleElement() {
        return false;
    }
    get isFunctionExpValue() {
        return false;
    }
    get isConversionValue() {
        return false;
    }

    get variable() {
        return null;
    }

    get readOnly() {
        return true;
    }
    set readOnly(value) {
    }

    get writeOnly() {
        return false;
    }

    get withFrame() {
        return null;
    }
    set withFrame(value) {
    }

    get name() {
        return null;
    }

    get fullyQualifiedName() {
        return (this.definedIn && this.definedIn.fullyQualifiedName.length > 0 ? this.definedIn.fullyQualifiedName + '.' : '') + this.name;
    }

    get aliasedSymbol() {
        return null;
    }

    get definedIn() {
        return null;
    }
    set definedIn(value) {
    }

    get target() {
        return null;
    }

    get value() {
        return null;
    }
    set value(value) {
    }

    get names() {
        return null;
    }

    define(name, symbol) {
        symbol.definedIn = this;
        this.names.set(name, symbol);
    }

    resolveName(name, typeOrModule = false) {
        return null;
    }

    get symbol() {
        return null;
    }
    set symbol(s) {
    }

    constantEquals(argument) {
        return false;
    }

    get stringValue() {
        return null;
    }

    get booleanValue() {
        return null;
    }

    get decimalValue() {
        return null;
    }

    get doubleValue() {
        return null;
    }

    get singleValue() {
        return null;
    }

    get longValue() {
        return null;
    }

    get integerValue() {
        return null;
    }

    get byteValue() {
        return null;
    }

    get charValue() {
        return null;
    }

    get jsNumberType() {
        return null;
    }

    get functionSignature() {
        return null;
    }
    set functionSignature(s) {
    }

    get valueType() {
        return null;
    }
    set valueType(value) {
    }

    /**
     * Used between method signatures to determine if
     * the argument is compatible. The argument may
     * introduce optional parameters and a more contravariant
     * return type.
     */
    get overridableBy(arg) {
        return false;
    }

    /**
     * Indicates the consequent scope chain frame.
     * Used in declarations, like classes and variables.
     */
    get afterFrame() {}
    set afterFrame(v) {
    }

    get foreignName() {
        return null;
    }
    set foreignName(name) {
    }

    get activation() {
        return null;
    }
    set activation(value) {
    }

    /**
     * Maps operators to method slots.
     * @type {Map<Operator, Symbol>}
     */
    get operators() {
        return new Map;
    }
    addOperator(operator, methodSlot) {
    }
    getOperator(operator) {
        return null;
    }

    get capturedSlots() {
        return [];
    }
    addCapturedSlot(p) {
    }
    hasCapturedSlot(p) {
        return false;
    }

    /**
     * Collection of (_label_, _type_) groups.
     */
    get params() {
        return [];
    }
    /**
     * Collection of (_label_, _type_) groups.
     */
    get optParams() {
        return [];
    }
    /**
     * Null or a label string.
     */
    get restParam() {
        return null;
    }
    get returnType() {
        return null;
    }

    get inheritsDelegate() {
        return null;
    }
    set inheritsDelegate(delegate) {
    }

    findInheritedOperator(operator) {
        return null;
    }

    get enumSpecialMethods() {
        return null;
    }
    declareEnumSpecialMethods() {
    }

    get enumMemberValue() {
        return null;
    }
    set enumMemberValue(p) {
    }

    get tupleElements() {
        return [];
    }

    get reflectsType() {
        return null;
    }

    isSubtypeOf(a) {
        return false;
    }

    get defaultValue() {
        return null;
    }

    get containsNull() {
        return false;
    }

    get wrapsType() {
        return null;
    }

    get superType() {
        return null;
    }
    set superType(t) {
    }

    get delegate() {
        return null;
    }
    set delegate(v) {
    }

    get classFlags() {
        return 0;
    }
    set classFlags(v) {
    }

    get enumFlags() {
        return 0;
    }
    set enumFlags(v) {
    }

    get methodFlags() {
        return 0;
    }
    set methodFlags(v) {
    }

    escapeType() {
        return this;
    }

    escapeAlias() {
        return this;
    }

    get implementsInterfaces() {
        return [];
    }

    get subclass() {
        return null;
    }

    get subclasses() {
        return [];
    }

    addSubclass(c) {
    }

    removeSubclass(c) {
    }

    get implementors() {
        return [];
    }

    get superInterfaces() {
        return [];
    }
    addSuperInterface(t) {
    }

    get subInterfaces() {
        return [];
    }
    addSubInterface(t) {
    }

    get constructorMethod() {
        return null;
    }
    set constructorMethod(v) {
    }

    /**
     * @return Collection of errors, where each one is a `DuplicateDefinitionError` symbol.
     */
    extendType(type) {
        return [];
    }

    implementType(type) {
    }

    addImplementor(type) {
    }

    /**
     * @param {(methodType: string, name: string, signature: Symbol) => void} onUndefined Callback where `methodType` is either `default`, `getter` or `setter`.
     * @param {(operator: Operator, signature: Symbol = null) => void} onOperatorUndefinedOrWrong
     * @param {(slotType: string, name: string) => void} onWrong Callback where slotType is either `methodSlot` or `virtualSlot`.
     */
    verifyInterfaceImplementations(onUndefined, onOperatorUndefinedOrWrong, onWrong) {
    }

    getAscendingSuperClasses() {
        let r = [];
        for (let st = this; st = st.superType;) {
            r.unshift(st);
        }
        return r;
    }

    /**
     * Map of string to numeric value.
     * @type {Map<string, number>}
     */
    get enumConstants() {
        return new Map;
    }

    getEnumConstant(name) {
        return null;
    }
    setEnumConstant(name, doubleValue) {
    }

    get visibility() {
        return null;
    }
    set visibility(v) {
    }

    get meValue() {
        return null;
    }

    get parentFrame() {
        return null;
    }
    set parentFrame(f) {
    }

    get importsModules() {
        return [];
    }

    importModule(symbol) {
    }

    convertExplicit(toType) {
        return null;
    }

    convertImplicit(toType) {
        return null;
    }

    convertConstant(toType) {
        return null;
    }

    get object() {
        return null;
    }

    get property() {
        return null;
    }

    get ofMethodSlot() {
        return null;
    }

    get index() {
        return 0;
    }

    get conversionBase() {
        return null;
    }
    get conversionRelationship() {
        return null;
    }

    get byCType() {
        return false;
    }
    set byCType(v) {
    }

    get byTryCast() {
        return false;
    }
    set byTryCast(v) {
    }

    get initialValue() {
        return null;
    }
    set initialValue(v) {
    }

    get getter() {
        return null;
    }
    set getter(method) {
    }

    get setter() {
        return null;
    }
    set setter(method) {
    }

    get methodOptimizations() {
        return [];
    }
    addMethodOptimization(o) {
    }

    get ofVirtualSlot() {
        return null;
    }
    set ofVirtualSlot(symbol) {
    }

    get overriders() {
        return new Map;
    }

    /**
     * @private
     */
    addOverrider(fromType, method) {
    }

    /**
     * Overrides method in one of the inherited delegates.
     *
     * @return Either `null`, `IncompatibleOverrideSignatureError`,
     * `MustOverrideAMethodError`, `NotOverridableError`, `OverridingPrivateError` or `OverridingWithDifferentVisibilityError`.
     */
    override(delegate) {
        return null;
    }

    accessibleByFrame(f) {
        let v = this.visibility;
        if (v == 'public') {
            return true;
        } else if (v == 'private') {
            let t = this.definedIn;
            if (t == null || !(t.isClass || t.isEnum || t.isStructure)) {
                return false;
            }
            let p = f;
            while (p != null) {
                if (p.symbol == t) {
                    return true;
                }
                p = p.parentFrame;
            }
        } else if (v == 'protected') {
            let t = this.definedIn;
            if (t == null || !(t.isClass || t.isEnum || t.isStructure)) {
                return false;
            }
            let p = f;
            while (p != null) {
                if (p.symbol == t || (p.symbol != null && p.symbol.isClass && p.symbol.isSubtypeOf(t))) {
                    return true;
                }
                p = p.parentFrame;
            }
        } else {
            // internal
            let t = this.definedIn;
            t = t != null && !t.isModule ? t.definedIn : t;
            if (t == null) {
                return false;
            }
            let p = f;
            while (p != null) {
                if (p.symbol == t) {
                    return true;
                }
                p = p.parentFrame;
            }
        }
        return false;
    }

    get betweenPackages() {
        return null;
    }

    get expectedArgumentsNumber() {
        return 0;
    }

    get operator() {
        return null;
    }

    get argumentIndex() {
        return 0;
    }

    get expectedArgumentType() {
        returnn null;
    }

    get gotArgumentType() {
        return null;
    }

    get duplicateDefinition() {
        return null;
    }

    get expectedMethodSignature() {
        return null;
    }
}

export const Visibility = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    PROTECTED: 'protected',
    INTERNAL: 'internal',
};

export const ClassFlags = {
    NOT_INHERITABLE: 1,
};

export const EnumFlags = {
    FLAGS: 1,
};

export const MethodFlags = {
    NOT_OVERRIDABLE: 1,
    ASYNC: 2,
    GENERATOR: 4,
};

export class EnumSpecialMethods {
    constructor() {
        this.valueOfMethod = null;
        this.toDebugStringMethod = null;
        this.hasMethod = null;
        this.filterMethod = null;
        this.addMethod = null;
        this.removeMethod = null;
        this.toggleMethod = null;
    }
}

export class TargetAndValuePair extends Symbol {
    constructor(t, v) {
        super();
        this._t = t;
        this._v = v;
    }

    get isTargetAndValuePair() {
        return true;
    }

    get target() {
        return this._t;
    }

    get value() {
        return this._v;
    }
    set value(v) {
        this._v = v;
    }
}

/**
 * Used to indicate that an assigment statement
 * declares a local variable. 
 */
export class ShortVarDeclAssignment extends Symbol {
    constructor(variable) {
        super();
        this._v = variable;
    }

    get isShortVarDeclAssignment() {
        return true;
    }

    get variable() {
        return this._v;
    }
}

export class VariableSlot extends Symbol {
    constructor(name, readOnly, type) {
        super();
        this._name = name;
        this._readOnly = readOnly;
        this._t = type;
        this._initialValue = null;
        this._afterFrame = null;
        this._definedIn = null;
        this._enumValue = null;
        this._visibility = 'public';
    }

    get isVariableSlot() {
        return true;
    }

    get visibility() {
        return this._visibility;
    }
    set visibility(v) {
        this._visibility = v;
    }

    get name() {
        return this._name;
    }

    get readOnly() {
        return this._readOnly;
    }
    set readOnly(v) {
        this._readOnly = v;
    }

    get valueType() {
        return this._t;
    }
    set valueType(t) {
        this._t = t;
    }

    get initialValue() {
        return this._initialValue;
    }
    set initialValue(v) {
        this._initialValue = v;
    }

    get afterFrame() {
        return this._afterFrame;
    }
    set afterFrame(v) {
        this._afterFrame = v;
    }

    get enumMemberValue() {
        return this._enumValue;
    }
    set enumMemberValue(p) {
        this._enumValue = p;
    }

    get definedIn() {
        return this._definedIn;
    }
    set definedIn(r) {
        this._definedIn = r;
    }
}

export class VirtualSlot extends Symbol {
    constructor(name, type) {
        super();
        this._name = name;
        this._t = type;
        this._getter = null;
        this._setter = null;
        this._params = null;
        this._definedIn = null;
        this._visibility = 'public';
    }

    get isVirtualSlot() {
        return true;
    }

    get visibility() {
        return this._visibility;
    }
    set visibility(v) {
        this._visibility = v;
    }

    get name() {
        return this._name;
    }

    get readOnly() {
        return this._setter == null;
    }

    get writeOnly() {
        return this._getter == null;
    }

    get valueType() {
        return this._t;
    }
    set valueType(t) {
        this._t = t;
    }

    get getter() {
        return this._getter;
    }
    set getter(g) {
        this._getter = g;
    }

    get setter() {
        return this._setter;
    }
    set setter(s) {
        this._setter = s;
    }

    get definedIn() {
        return this._definedIn;
    }
    set definedIn(r) {
        this._definedIn = r;
    }

    get params() {
        return this._params;
    }
    set params(l) {
        this._params = l;
    }
}

export class MethodSlot extends Symbol {
    constructor(name, signature) {
        super();
        this._name = name;
        this._s = signature;
        this._flags = 0;
        this._activation = null;
        this._definedIn = null;
        this._ofVirtualSlot = null;
        this._overriders = null;
        this._optimizations = null;
        this._foreignName = null;
        this._visibility = 'public';
        this._afterFrame = null;
    }

    get isMethodSlot() {
        return true;
    }

    get visibility() {
        return this._visibility;
    }
    set visibility(v) {
        this._visibility = v;
    }

    get name() {
        return this._name;
    }

    get functionSignature() {
        return this._s;
    }
    set functionSignature(t) {
        this._s = s;
    }

    get methodFlags() {
        return this._flags;
    }
    set methodFlags(v) {
        this._flags = v;
    }

    get activation() {
        return this._activation;
    }
    set activation(a) {
        this._activation = a;
    }

    get definedIn() {
        return this._definedIn;
    }
    set definedIn(r) {
        this._definedIn = r;
    }

    get ofVirtualSlot() {
        return this._ofVirtualSlot;
    }
    set ofVirtualSlot(r) {
        this._ofVirtualSlot = r;
    }

    get overriders() {
        return this._overriders ? new Map(this._overriders) : new Map;
    }

    addOverrider(fromType, method) {
        this._overriders = this._overriders || new Map;
        this._overriders.set(fromType, method);
    }

    get methodOptimizations() {
        return this._optimizations ? this._optimizations.slice(0) : [];
    }
    addMethodOptimization(o) {
        this._optimizations = this._optimizations || [];
        this._optimizations.push(o);
    }

    get foreignName() {
        return this._foreignName;
    }
    set foreignName(name) {
        this._foreignName = name;
    }

    override(delegate) {
        let { name } = this;
        let virtualSlot = this.ofVirtualSlot;
        let superMethodSlot = null;
        let superVirtualSlot = null;
        let superSlot = delegate.inheritsDelegate ? delegate.inheritsDelegate.resolveName(name) : null;

        let visi = superSlot != null ? superSlot.visibility : null;
        if (visi != null && visi == 'private') {
            return this.host.factory.createOverridingPrivateError();
        } else if (visi != null && visi != superSlot.visibility) {
            return this.host.factory.creatingOverridingWithDifferentVisibilityError();
        }

        if (superSlot != null && virtualSlot != null) {
            superSlot = superSlot.isVirtualSlot ? superSlot : null;
        } else if (superSlot != null) {
            superSlot = superSlot.isMethodSlot ? superSlot : null;
        }

        if (virtualSlot != null) {
            let isGetter = this == virtualSlot.getter;
            if (superSlot == null || (isGetter ? superSlot.getter == null : superSlot.setter == null)) {
                return this.host.factory.createMustOverrideAMethodError();
            }
            superMethodSlot = isGetter ? superProp.getter : superProp.setter;
            if (superProp.functionSignature != virtualSlot.functionSignature) {
                return this.host.factory.createIncompatibleOverrideSignatureError(superMethodSlot.functionSignature);
            }
        } else {
            if (superProp == null) {
                return this.host.factory.createMustOverrideAMethodError();
            }
            if (!superProp.functionSignature.overridableBy(this.functionSignature)) {
                return this.host.factory.createIncompatibleOverrideSignatureError(superProp.functionSignature);
            }
            superMethodSlot = superProp;
        }

        if (superMethodSlot.methodFlags & MethodFlags.NOT_OVERRIDABLE) {
            return this.host.factory.createNotOverridableError();
        }

        superMethodSlot.addOverrider(delegate.definedIn, this);
        this.methodFlags |= MethodFlags.OVERRIDE;
        return null;
    }

    get afterFrame() {
        return this._afterFrame;
    }
    set afterFrame(f) {
        this._afterFrame = f;
    }
}

export class MethodOptimization {
    constructor(argumentTypes, replacer) {
        this.argumentTypes = argumentTypes;
        this.replacer = replacer;
    }
}

export class Value extends Symbol {
    constructor() {
        super();
        this._type = null;
    }

    get isValue() {
        return true;
    }

    get valueType() {
        return this._type;
    }
    set valueType(type) {
        this._type = type;
    }

    get readOnly() {
        return true;
    }

    get writeOnly() {
        return false;
    }

    resolveName(name, typeOrModule = false) {
        if (this.valueType?.isAnyType) {
            return this.host.factory.createDynamicReferenceValue(this);
        }
        let r = this.valueType?.delegate?.resolveName(name, typeOrModule);
        if (r != null && r.isReferenceValue) {
            r = this.host.factory.createReferenceValue(this, r.property);
        }
        return r;
    }

    convertExplicit(toType) {
        let host = this.host;
        let factory = host.factory;
        let fromType = this.valueType;

        if (fromType == toType) {
            return this;
        }

        let toTypeEsc = toType.escapeType();
        let subconversion = this.convertImplicit(toType);

        if (subconversion != null) {
            return subconversion;
        }

        // To subclass
        if (fromType.isClass && toType.isSubtypeOf(fromType)) {
            return factory.createConversionValue(this, ConversionRelationship.TO_SUBCLASS, toType, false, false);
        }
        // To sub-interface or implementor
        else if (fromType.isInterface) {
            if (toType.isClass && toType.isSubtypeOf(fromType)) {
                return factory.createConversionValue(this, ConversionRelationship.TO_IMPLEMENTOR, toType, false, false);
            }
            else if (toType.isInterface && toType.isSubtypeOf(fromType)) {
                return factory.createConversionValue(this, ConversionRelationship.TO_SUB_INTERFACE, toType, false, false);
            }
        }
        // To nullable
        else if (toType.isNullableType) {
            subconversion = this.convertExplicit(toTYpe.wrapsType);
            if (subconversion != null) {
                return factory.createConversionValue(subconversion, ConversionRelationship.TO_NULLABLE, toType, false, false);
            }
        }
        // From nullable
        else if (fromType.isNullableType && !toType.containsNull) {
            subconversion = factory.createValue(fromType.wrapsType).convertExplicit(toType);
            if (subconversion != null) {
                return factory.createConversionValue(this, ConversionRelationship.FROM_NULLABLE, toType, false, false);
            }
        }
        // To String
        else if (toType == this.host.stringType) {
            return factory.createConversionValue(this, ConversionRelationship.TO_STRING, toType, false, false);
        }

        return null;
    }

    convertImplicit(toType) {
        let host = this.host;
        let factory = host.factory;
        let fromType = this.valueType;

        if (fromType == toType) {
            return this;
        }

        let toTypeEsc = toType.escapeType();
        let subconversion = null;

        // To Any
        if (toType == host.anyType) {
            return factory.createConversionValue(this, ConversionRelationship.TO_ANY, toType, false, false);
        }
        // Numeric
        else if (host.isNumericType(fromType) && host.isNumericType(toType)) {
            return factory.createConversionValue(this, ConversionRelationship.NUMERIC, toType, false, false);
        }
        // Super class
        else if (fromType.isClass && fromType.isSubtypeOf(toType)) {
            return factory.createConversionValue(this, ConversionRelationship.TO_SUPER_CLASS, toType, false, false);
        }
        // Empty to flags
        else if (fromType.isEmptyType && toTypeEsc.isEnum && (toTypeEsc.enumFlags & EnumFlags.FLAGS) != 0) {
            return factory.createEnumConstant(0, toType);
        }
        // To implemented interface or super interface
        else if (toType.isInterface && fromType.isSubtypeOf(toType)) {
            if (fromType.isInterface) {
                return factory.createConversionValue(this, ConversionRelationship.TO_SUPER_INTERFACE, toType, false, false);
            } else {
                return factory.createConversionValue(this, ConversionRelationship.TO_IMPLEMENTED_INTERFACE, toType, false, false);
            }
        }
        // To nullable
        else if (toType.isNullableType) {
            subconversion = this.convertImplicit(toTYpe.wrapsType);
            if (subconversion != null) {
                return factory.createConversionValue(subconversion, ConversionRelationship.TO_NULLABLE, toType, false, false);
            }
        }
        // From nullable
        else if (fromType.isNullableType && !toType.containsNull) {
            subconversion = factory.createValue(fromType.wrapsType).convertImplicit(toType);
            if (subconversion != null) {
                return factory.createConversionValue(this, ConversionRelationship.FROM_NULLABLE, toType, false, false);
            }
        }

        // From Any
        if (fromType.isAnyType) {
            return factory.createConversionValue(this, ConversionRelationship.FROM_ANY, toType, false, false);
        }
        // From Char to String
        else if (fromType == this.host.charType && toType == this.host.stringType) {
            return factory.createConversionValue(this, ConversionRelationship.TO_STRING, toType, false, false);
        }

        return this.convertConstant(toType);
    }

    convertConstant(toType) {
        let fromType = this.valueType;
        if (fromType == toType) {
            return this;
        }
        let toTypeEsc = toType.escapeType();

        if (this.isDoubleConstant || this.isIntegerConstant || this.isLongConstant || this.isByteConstant || this.isSingleConstant || this.isDecimalConstant || this.isCharConstant) {
            if (this.host.isNumericType(toTypeEsc)) {
                switch (toTypeEsc) {
                    case this.host.doubleType:
                        return this.host.factory.createDoubleConstant(AnyRangeNumbers.toType(this.doubleValue, this.jsNumberType), toType);
                    case this.host.integerType:
                        return this.host.factory.createIntegerConstant(AnyRangeNumbers.toType(this.integerValue, this.jsNumberType), toType);
                    case this.host.longType:
                        return this.host.factory.createLongConstant(AnyRangeNumbers.toType(this.longValue, this.jsNumberType), toType);
                    case this.host.byteType:
                        return this.host.factory.createByteConstant(AnyRangeNumbers.toType(this.byteValue, this.jsNumberType), toType);
                    case this.host.singleType:
                        return this.host.factory.createSingleConstant(AnyRangeNumbers.toType(this.singleValue, this.jsNumberType), toType);
                    case this.host.decimalType:
                        return this.host.factory.createDecimalConstant(AnyRangeNumbers.toType(this.decimalValue, this.jsNumberType), toType);
                    case this.host.charType:
                        return this.host.factory.createCharConstant(AnyRangeNumbers.toType(this.charValue, this.jsNumberType), toType);
                }
            }

            if (this.isDoubleConstant && (toType == this.host.anyType || toTypeEsc == this.host.objectType || toTypeEsc == this.host.doubleType)) {
                return this.host.factory.createDoubleConstant(this.doubleValue, toType);
            }
            if (this.isIntegerConstant && (toType == this.host.anyType || toTypeEsc == this.host.objectType || toTypeEsc == this.host.integerType)) {
                return this.host.factory.createIntegerConstant(this.integerValue, toType);
            }
            if (this.isLongConstant && (toType == this.host.anyType || toTypeEsc == this.host.objectType || toTypeEsc == this.host.longType)) {
                return this.host.factory.createLongConstant(this.longValue, toType);
            }
            if (this.isByteConstant && (toType == this.host.anyType || toTypeEsc == this.host.objectType || toTypeEsc == this.host.byteType)) {
                return this.host.factory.createByteConstant(this.byteValue, toType);
            }
            if (this.isSingleConstant && (toType == this.host.anyType || toTypeEsc == this.host.objectType || toTypeEsc == this.host.singleType)) {
                return this.host.factory.createSingleConstant(this.singleValue, toType);
            }
            if (this.isDecimalConstant && (toType == this.host.anyType || toTypeEsc == this.host.objectType || toTypeEsc == this.host.decimalType)) {
                return this.host.factory.createDecimalConstant(this.decimalValue, toType);
            }
            if (this.isCharConstant && (toType == this.host.anyType || toTypeEsc == this.host.objectType || toTypeEsc == this.host.xType)) {
                return this.host.factory.createCharConstant(this.charValue, toType);
            }
        }
        else if (this.isStringConstant) {
            if (toTypeEsc == this.host.charType) {
                return this.host.factory.createCharConstant(this.stringValue.charCodeAt(0), toType);
            }
            if (toType == this.host.anyType || toTypeEsc == this.host.objectType) {
                return this.host.factory.createStringConstant(this.stringValue, toType);
            }
        }
        else if (this.isBooleanConstant && (toType == this.host.anyType || toTypeEsc == this.host.objectType)) {
            return this.host.factory.createBooleanConstant(this.booleanValue, toType);
        }
        else if (this.isEmptyConstant && (toType.containsNull || toType == this.host.anyType || toTypeEsc == this.host.emptyType || toTypeEsc == this.host.nothingType)) {
            return this.host.factory.createEmptyConstant(toType);
        }
        // Empty to flags
        else if (this.isEmptyConstant && toTypeEsc.isEnum && (toTypeEsc.enumFlags & EnumFlags.FLAGS) != 0) {
            return this.host.factory.createEnumConstant(0, toType);
        }
        else if (this.isNothingConstant && (toType.containsNull || toType == this.host.anyType || toTypeEsc == this.host.emptyType || toTypeEsc == this.host.nothingType)) {
            return this.host.factory.createNothingConstant(toType);
        }
        else if (this.isNullConstant && (toType.containsNull || toType == this.host.anyType || toTypeEsc == this.host.emptyType || toTypeEsc == this.host.nothingType)) {
            return this.host.factory.createNullConstant(toType);
        }

        return null;
    }
}

export class Constant extends Value {
    constructor() {
        super();
    }

    get isConstant() {
        return true;
    }
}

export class ObjectValue extends Constant {
    constructor() {
        super();
        this._names = new Names;
        this._definedIn = null;
    }

    get names() {
        return this._names;
    }

    get isObjectValue() {
        return true;
    }

    get definedIn() {
        return this._definedIn;
    }
    set definedIn(r) {
        this._definedIn = r;
    }

    resolveName(name, typeOrModule = false) {
        let r = this.names.resolveName(name, typeOrModule);
        return r ? this.host.factory.createReferenceValue(this, r) : null;
    }
}

export class Module extends ObjectValue {
    constructor(name) {
        super();
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get isModule() {
        return true;
    }
}

export class SymbolAlias extends Symbol {
    constructor(name, aliasedSymbol) {
        super();
        this._name = name;
        this._aliasedSymbol = aliasedSymbol;
        this._visibility = 'public';
        this._definedIn = null;
    }

    get isSymbolAlias() {
        return true;
    }

    get isType() {
        return this._aliasedSymbol.isType;
    }

    get isModule() {
        return this._aliasedSymbol.isModule;
    }

    get isVariableSlot() {
        return this._aliasedSymbol.isVariableSlot;
    }

    get isVirtualSlot() {
        return this._aliasedSymbol.isVirtualSlot;
    }

    get isMethodSlot() {
        return this._aliasedSymbol.isMethodSlot;
    }

    escapeAlias() {
        return this._aliasedSymbol;
    }

    get name() {
        return this._name;
    }

    get aliasedSymbol() {
        return this._aliasedSymbol;
    }

    get definedIn() {
        return this._definedIn;
    }
    set definedIn(d) {
        this._definedIn = d;
    }

    get visibility() {
        return this._visibility;
    }
    set visibility(v) {
        this._visibility = v;
    }
}

export class ScopeChain {
    constructor() {
        this._frame = null;
    }

    get currentFrame() {
        return this._frame;
    }

    resolveName(name, typeOrModule = false) {
        return this._frame.resolveName(name, typeOrModule);
    }

    enterFrame(f) {
        f._parentFrame = f._parentFrame || this._frame;
        this._frame = f;
    }

    exitFrame() {
        this._frame = this.frame.parentFrame;
    }
}

export class IncompatibleOverrideSignatureError extends Symbol {
    constructor(expected) {
        super();
        this._e = expected;
    }

    get isIncompatibleOverrideSignatureError() {
        return true;
    }

    get expectedMethodSignature() {
        return this._e;
    }
}

export class MustOverrideAMethodError extends Symbol {
    constructor() {
        super();
    }

    get isMustOverrideAMethodError() {
        return true;
    }
}

export class NotOverridableError extends Symbol {
    constructor() {
        super();
    }

    get isNotOverridableError() {
        return true;
    }
}

export class OverridingPrivateError extends Symbol {
    constructor() {
        super();
    }

    get isOverridingPrivateError() {
        return true;
    }
}

export class OverridingWithDifferentVisibilityError extends Symbol {
    constructor() {
        super();
    }

    get isOverridingWithDifferentVisibilityError() {
        return true;
    }
}

export class AmbiguousReferenceError extends Symbol {
    constructor(name, betweenPackages = null) {
        super();
        this._name = name;
        this._p = betweenPackages;
    }

    get isAmbiguousReferenceError() {
        return true;
    }

    get name() {
        return this._name;
    }

    get betweenPackages() {
        return this._p?.slice(0) || [];
    }
}

export class DuplicateDefinitionError extends Symbol {
    constructor(name, definition) {
        super();
        this._name = name;
        this._d = definition;
    }

    get isDuplicateDefinitionError() {
        return true;
    }

    get name() {
        return this._name;
    }

    get duplicateDefinition() {
        return this._d;
    }
}

export class WrongNumberOfArgumentsError extends Symbol {
    constructor(expected) {
        super();
        this._n = expected;
    }

    get isWrongNumberOfArgumentsError() {
        return true;
    }

    get expectedArgumentsNumber() {
        return this._n;
    }
}

export class InstanceMe extends Value {
    constructor() {
        super();
        this._a = null;
    }

    get isInstanceMe() {
        return true;
    }

    get activation() {
        return this._a;
    }
    set activation(a) {
        this._a = a;
    }
}

export class ClassStaticMe extends Value {
    constructor(forType) {
        super();
        this._t = forType;
        this._a = null;
    }

    get isClassStaticMe() {
        return true;
    }

    get reflectsType() {
        return this._t;
    }

    get activation() {
        return this._a;
    }
    set activation(a) {
        this._a = a;
    }

    resolveName(name, typeOrModule = false) {
        return this._t.resolveName(name, typeOrModule);
    }
}

/**
 * Empty constant. Associated value type can be `Any`, `Empty`, `Nothing`, `Null` or nullable.
 */
export class EmptyConstant extends Constant {
    constructor() {
        super();
    }

    get isEmptyConstant() {
        return true;
    }

    constantEquals(argument) {
        return argument.isEmptyConstant && this.valueType == argument.valueType;
    }

    toString() {
        return 'Empty';
    }
}

/**
 * Nothing constant. Associated value type can be `Any`, `Empty`, `Nothing`, `Null` or nullable.
 */
export class NothingConstant extends Constant {
    constructor() {
        super();
    }

    get isNothingConstant() {
        return true;
    }

    constantEquals(argument) {
        return argument.isNothingConstant && this.valueType == argument.valueType;
    }

    toString() {
        return 'Nothing';
    }
}

/**
 * Null constant. Associated value type can be `Any`, `Empty`, `Nothing`, `Null` or nullable.
 */
export class NullConstant extends Constant {
    constructor() {
        super();
    }

    get isNullConstant() {
        return true;
    }

    constantEquals(argument) {
        return argument.isNullConstant && this.valueType == argument.valueType;
    }

    toString() {
        return 'Null';
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, String or String?.
 */
export class StringConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isStringConstant() {
        return true;
    }

    get stringValue() {
        return this._v;
    }

    constantEquals(argument) {
        return argument.isStringConstant && this._v == argument.stringValue && this.valueType == argument.valueType;
    }

    toString() {
        return '"' + this._v.replace(/"/g, '""') + '"';
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, Boolean or Boolean?.
 */
export class BooleanConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isBooleanConstant() {
        return true;
    }

    get booleanValue() {
        return this._v;
    }

    constantEquals(argument) {
        return argument.isBooleanConstant && this.booleanValue == argument.booleanValue && this.valueType == argument.valueType;
    }

    toString() {
        return this._v ? 'True' : 'False';
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, Single or Single?.
 */
export class SingleConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isSingleConstant() {
        return true;
    }

    get singleValue() {
        return this._v;
    }

    get jsNumberType() {
        return Single;
    }

    constantEquals(argument) {
        return argument.isSingleConstant && this.singleValue.equals(argument.singleValue) && this.valueType == argument.valueType;
    }

    toString() {
        return this._v.toString();
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, Double or Double?.
 */
export class DoubleConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isDoubleConstant() {
        return true;
    }

    get doubleValue() {
        return this._v;
    }

    get jsNumberType() {
        return Double;
    }

    constantEquals(argument) {
        return argument.isDoubleConstant && this.doubleValue == argument.doubleValue && this.valueType == argument.valueType;
    }

    toString() {
        return this._v.toString();
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, Byte or Byte?.
 */
export class ByteConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isByteConstant() {
        return true;
    }

    get byteValue() {
        return this._v;
    }

    get jsNumberType() {
        return Byte;
    }

    constantEquals(argument) {
        return argument.isByteConstant && this.byteValue.equals(argument.byteValue) && this.valueType == argument.valueType;
    }

    toString() {
        return this._v.toString();
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, Integer or Integer?.
 */
export class IntegerConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isIntegerConstant() {
        return true;
    }

    get integerValue() {
        return this._v;
    }

    get jsNumberType() {
        return Integer;
    }

    constantEquals(argument) {
        return argument.isIntegerConstant && this.integerValue.equals(argument.integerValue) && this.valueType == argument.valueType;
    }

    toString() {
        return this._v.toString();
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, Long or Long?.
 */
export class LongConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isLongConstant() {
        return true;
    }

    get longValue() {
        return this._v;
    }

    get jsNumberType() {
        return Long;
    }

    constantEquals(argument) {
        return argument.isLongConstant && this.longValue.equals(argument.longValue) && this.valueType == argument.valueType;
    }

    toString() {
        return this._v.toString();
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, Decimal or Decimal?.
 */
export class DecimalConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isDecimalConstant() {
        return true;
    }

    get decimalValue() {
        return this._v;
    }

    get jsNumberType() {
        return Decimal;
    }

    constantEquals(argument) {
        return argument.isDecimalConstant && this.decimalValue.eq(argument.decimalValue) && this.valueType == argument.valueType;
    }

    toString() {
        return this._v.toString();
    }
}

/**
 * Constant whose static type may be Any, Object, Object?, Char or Char?.
 */
export class CharConstant extends Constant {
    constructor(v) {
        super();
        this._v = v;
    }

    get isCharConstant() {
        return true;
    }

    get charValue() {
        return this._v;
    }

    get jsNumberType() {
        return Char;
    }

    constantEquals(argument) {
        return argument.isCharConstant && this.charValue.equals(argument.charValue) && this.valueType == argument.valueType;
    }

    toString() {
        return this._v.toString();
    }
}

export class EnumConstant extends Constant {
    constructor(doubleValue) {
        super();
        this._v = doubleValue;
    }

    get isEnumConstant() {
        return true;
    }

    get doubleValue() {
        return this._v;
    }

    constantEquals(argument) {
        return argument.isEnumConstant && this.valueType == argument.valueType && this._v == argument.doubleValue;
    }

    toString() {
        let t = this.valueType.escapeType();
        if (t.enumFlags & EnumFlags.FLAGS && this._v == 0) {
            return 'Empty';
        }
        const r = [];
        for (let [name, v] of t.enumConstants) {
            if (this._v & v != 0) {
                r.push(name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase());
            }
        }
        return r.length > 1 ? "{" + r.join(', ') + "}" : r[0];
    }
}

export class Frame extends ObjectValue {
    constructor() {
        super();
        this._importsModules = null;
        this._parentFrame = null;
    }

    get parentFrame() {
        return this._parentFrame;
    }
    set parentFrame(f) {
        this._parentFrame = f;
    }

    get activation() {
        for (let f = this; f; f = f.parentFrame) {
            if (f.isActivation) {
                return f;
            }
        }
        return null;
    }

    get importsModules() {
        return this._importsModules ? this._importsModules.slice(0) : [];
    }

    importModule(m) {
        if (this.symbol == m) {
            return;
        }
        this._importsModules = this._importsModules || [];
        if (this._importsModules.indexOf(m) == -1) {
            this._importsModules.push(m);
        }
    }

    resolveName(name, typeOrModule = false) {
        let s1 = null;
        let s2 = null;
        let typeOrModule = this.isActivation || this.isWithFrame ? null : this.symbol;

        if (typeOrModule) {
            while (typeOrModule != null) {
                s2 = typeOrModule.resolveName(name, typeOrModule);
                if (s2 != null) {
                    if (s1 != null) {
                        return this.host.factory.createAmbiguousReferenceError(name);
                    } else {
                        s1 = s2;
                    }
                }
                typeOrModule = typeOrModule.superType;
            }
        }

        s2 = this.names.resolveName(name, typeOrModule);
        if (s2 != null) {
            if (s1 != null) {
                return this.host.factory.createAmbiguousReferenceError(name);
            } else {
                s1 = this.host.factory.createReferenceValue(this, s2);
            }
        }

        if (this._importsModules) {
            for (let p of this._importsModules) {
                s2 = p.resolveName(name, typeOrModule);
                if (s2 != null) {
                    if (s1 != null) {
                        return this.host.factory.createAmbiguousReferenceError(name);
                    } else {
                        s1 = s2;
                    }
                }
            }
        }

        return s1 || (this.parentFrame ? this.parentFrame.resolveName(name, typeOrModule) : null);
    }
}

export class ClassFrame extends Frame {
    constructor(s) {
        super();
        this._s = s;
    }

    get isClassFrame() {
        return true;
    }

    get symbol() {
        return this._s;
    }
}

export class StructureFrame extends Frame {
    constructor(s) {
        super();
        this._s = s;
    }

    get isStructureFrame() {
        return true;
    }

    get symbol() {
        return this._s;
    }
}

export class EnumFrame extends Frame {
    constructor(s) {
        super();
        this._s = s;
    }

    get isEnumFrame() {
        return true;
    }

    get symbol() {
        return this._s;
    }
}

export class InterfaceFrame extends Frame {
    constructor(s) {
        super();
        this._s = s;
    }

    get isInterfaceFrame() {
        return true;
    }

    get symbol() {
        return this._s;
    }
}

export class ModuleFrame extends Frame {
    constructor(s) {
        super();
        this._s = s;
    }

    get isModuleFrame() {
        return true;
    }

    get symbol() {
        return this._s;
    }
}

export class ActivationFrame extends Frame {
    constructor(meValue) {
        super();
        this._meValue = meValue;
        this._capturedSlots = null;
    }

    get isActivation() {
        return true;
    }

    get meValue() {
        return this._meValue;
    }

    get capturedSlots() {
        return this._capturedSlots ? new Set(this._capturedSlots) : new Set;
    }
    addCapturedSlot(p) {
        this._capturedSlots = this._capturedSlots || new Map;
        this._capturedSlots.add(p);
    }
    hasCapturedSlot(p) {
        return this._capturedSlots ? this._capturedSlots.has(p) : false;
    }    

    resolveName(name, typeOrModule = false) {
        let s = this.names.resolveName(name, typeOrModule);
        if (s != null) {
            return this.host.factory.createReferenceValue(this, s);
        }
        s = this._meValue.resolveName(name, typeOrModule);
        if (s != null) {
            return s;
        }
        s = super.resolveName(name, typeOrModule);
        if (s != null) {
            return s;
        }
        retuern this.parentFrame ? this.parentFrame.resolveName(name, typeOrModule) : null;
    }
}

export class WithFrame extends Frame {
    constructor(symbol) {
        super();
        this._s = null;
    }

    get isWithFrame() {
        return true;
    }

    /**
     * Reference value with the frame itself as the base object.
     */
    get symbol() {
        return this._s;
    }
    set symbol(s) {
        this._s = s;
    }
}

export class Type extends ObjectValue {
    constructor() {
        super();
        this._visibility = 'public';
        this._superType = null;
        this._delegate = null;
        this._operators = null;
    }

    get isType() {
        return true;
    }

    get visibility() {
        return this._visibility;
    }
    set visibility(v) {
        this._visibility = v;
    }

    get delegate() {
        return this._delegate;
    }
    set delegate(d) {
        this._delegate = d;
    }

    get operators() {
        return this._operators || new Map;
    }
    addOperator(operator, slot) {
        this._operators = this._operators || new Map;
        this._operators.add(operator, slot);
    }
    getOperator(operator) {
        return this._operators?.get(operator) || null;
    }
    findInheritedOperator(operator) {
        return this.getOperator(operator) || this.superType?.findInheritedOperator(operator) || null;
    }

    get superType() {
        let t = this._superType;
        if (t == null && !this.isAnyType) {
            return this.host.anyType;
        }
        return t;
    }
    set superType(t) {
        this._superType = t;
        this._delegate?.inheritsDelegate = t.delegate;
    }

    isSubtypeOf(type) {
        if (this == type) {
            return true;
        }
        if (type.isAnyType) {
            return true;
        }
        let {superType} = this;
        if (superType != null && (superType == type || superType.isSubtypeOf(type))) {
            return true;
        }

        if (type.isInterface && this.implementsInterfaces?.some(itrfc => itrfc == type || itrfc.isSubtypeOf(type))) {
            return true;
        }
        if (this.superInterfaces?.some(itrfc => itrfc == type || itrfc.isSubtypeOf(type))) {
            return true;
        }
        return false;
    }

    resolveName(name, typeOrModule = false) {
        let r = this.names.resolveName(name, typeOrModule);
        if (r != null) {
            return this.host.factory.createReferenceValue(this, r);
        }
        return this.superType?.resolveName(name, typeOrModule);
    }
}

export class AnyType extends Type {
    constructor() {
        super();
        this.visibility = 'public';
    }

    get isAnyType() {
        return true;
    }

    toString() {
        return 'Any';
    }
}

export class EmptyType extends Type {
    constructor() {
        super();
        this.visibility = 'public';
    }

    get isEmptyType() {
        return true;
    }

    toString() {
        return 'Empty';
    }
}

export class NothingType extends Type {
    constructor() {
        super();
        this.visibility = 'public';
    }

    get isNothingType() {
        return true;
    }

    toString() {
        return 'Nothing';
    }
}

export class NullType extends Type {
    constructor() {
        super();
        this.visibility = 'public';
    }

    get isNullType() {
        return true;
    }

    get containsNull() {
        return true;
    }

    toString() {
        return 'Null';
    }
}

export class ClassType extends Type {
    constructor(name, flags) {
        super();
        this._name = name;
        this._flags = flags;
        this._constructorMethod = null;
        this._foreignName = null;
        this._interfaces = null;
        this._subclasses = null;
        this._afterFrame = null;
    }

    get isClass() {
        return true;
    }

    get classFlags() {
        return this._flags;
    }
    set classFlags(f) {
        this._flags = f;
    }

    get subclasses() {
        return this._subclasses?.slice(0) || [];
    }

    addSubclass(c) {
        this._subclasses = this._subclasses || [];
        this._subclasses.push(c);
    }

    removeSubclass(c) {
        let list = this._subclasses;
        let i = list ? list.indexOf(c) : -1;
        if (i != -1) {
            list.splice(i, 1);
        }
    }

    get implementsInterfaces() {
        return this._interfaces?.slice(0) || [];
    }

    get constructorMethod() {
        return this._constructorMethod;
    }
    set constructorMethod(m) {
        this._constructorMethod = m;
    }

    get foreignName() {
        return this._foreignName;
    }
    set foreignName(name) {
        this._foreignName = name;
    }

    extendType(type) {
        if (type.isSubtypeOf(this.type) || !type.isClass) {
            return [];
        }
        let superClass = this.superType;
        if (superClass != null) {
            superClass.removeSubclass(this);
            this.delegate.inheritsDelegate = null;
        }
        this.delegate.inheritsDelegate = type.delegate;
        type.addSubclass(this);
        return [];
    }

    implementType(type) {
        if (!type.isInterface) {
            return;
        }
        this._interfaces = this._interfaces || [];
        if (this._interfaces.indexOf(type) == -1) {
            this._interfaces.push(type);
            type.addImplementor(this);
        }
    }

    /**
     * @param {(methodType: string, name: string, signature: Symbol) => void} onUndefined Callback where `methodType` is either `default`, `getter` or `setter`.
     * @param {(operator: Operator, signature: Symbol = null) => void} onOperatorUndefinedOrWrong
     * @param {(slotType: string, name: string) => void} onWrong Callback where slotType is either `methodSlot` or `virtualSlot`.
     */
    verifyInterfaceImplementations(onUndefined, onOperatorUndefinedOrWrong, onWrong) {
        if (!this._interfaces) {
            return;
        }
        for (let itrfc of this._interfaces) {
            for (let [op, provided] of itrfc.operators) {
                let impl = this.delegate.findInheritedOperator(op);
                if (provided.methodFlags & MethodFlags.NATIVE) {
                    if (impl == null) {
                        onOperatorUndefinedOrWrong(op);
                    }
                } else if (impl != null && impl.valueType != provided.valueType) {
                    onOperatorUndefinedOrWrong(op, provided.valueType);
                }
            }
            for (let [name, provided] of new NamesHierarchy(itrfc)) {
                let impl = this.delegate.resolveName(name);
                if (impl != null && impl.visibility != 'public') {
                    impl = null;
                }
                if (provided.isVirtualSlot) {
                    this._verifyVirtualSlotImpl(name, provided, impl, onUndefined, onWrong);
                } else {
                    this._verifyMethodSlotImpl(name, provided, impl, onUndefined, onWrong);
                }
            }
        }
    }

    _verifyVirtualSlotImpl(name, provided, impl, onUndefined, onWrong) {
        if (impl == null) {
            if (provided.getter && (provided.getter.methodFlags & MethodFlags.NATIVE))
                onUndefined('getter', name, provided.getter.valueType);
            if (provided.setter && (provided.setter.methodFlags & MethodFlags.NATIVE))
                onUndefined('setter', name, provided.setter.valueType);
        } else {
            // Report when getter is required and it is either undefined or incompatible
            if ((provided.getter && (provided.getter.methodFlags & MethodFlags.NATIVE) && !impl.getter)
            || (provided.getter && impl.getter && provided.getter.valueType != impl.getter.valueType))
                onUndefined('getter', name, provided.getter.valueType);

            // Report when setter is required and it is either undefined or incompatible
            if ((provided.setter && (provided.setter.methodFlags & MethodFlags.NATIVE) && !impl.setter)
            || (provided.setter && impl.setter && provided.setter.valueType != impl.setter.valueType))
                onUndefined('setter', name, provided.setter.valueType);
        } else {
            onWrong('virtualSlot', name)
        }
    }

    _verifyMethodSlotImpl(name, provided, impl, onUndefined, onWrong) {
        if (!impl) {
            if (provided.methodFlags & MethodFlags.NATIVE) {
                onUndefined('default', name, provided.valueType);
            }
        } else if (!impl.isMethodSlot) {
            onWrong('methodSlot', name);
        } else if (!impl.valueType.equals(provided.valueType)) {
            onUndefined('default', name, provided.valueType);
        }
    }

    resolveName(name, typeOrModule = false) {
        let r = this.names.resolveName(name, typeOrModule);
        if (r) {
            return this.host.factory.createReferenceValue(this, r);
        }
        return this.superType?.resolveName(name, typeOrModule);
    }

    getOperator(operator) {
        return this._operators?.get(operator) || this.superType?.getOperator(operator);
    }

    get afterFrame() {
        return this._afterFrame;
    }
    set afterFrame(f) {
        this._afterFrame = f;
    }

    toString() {
        if (this.definedIn == this.host.sxGlobalModule) {
            return this.name;
        }
        return this.fullyQualifiedName;
    }
}

export class StructureType extends Type {
    constructor(name) {
        super();
        this._name = name;
        this._constructorMethod = null;
        this._foreignName = null;
        this._afterFrame = null;
    }

    get isStructure() {
        return true;
    }

    get subclasses() {
        return this._subclasses?.slice(0);
    }

    get constructorMethod() {
        return this._constructorMethod;
    }
    set constructorMethod(m) {
        this._constructorMethod = m;
    }

    get foreignName() {
        return this._foreignName;
    }
    set foreignName(name) {
        this._foreignName = name;
    }

    get defaultValue() {
        let {host} = this;
        switch (this) {
            case host.booleanType:
                return host.factory.createConstant();
            case host.doubleType:
                return host.factory.createDoubleConstant(0);
            case host.integerType:
                return host.factory.createIntegerConstant(new Integer(0));
            case host.singleType:
                return host.factory.createSingleConstant(new Single(0));
            case host.byteType:
                return host.factory.createByteConstant(new Byte(0));
            case host.longType:
                return host.factory.createLongConstant(new Long(0));
            case host.decimalType:
                return host.factory.createDecimalConstant(new Decimal(0));
        }
        return null;
    }

    resolveName(name, typeOrModule = false) {
        let r = this.names.resolveName(name, typeOrModule);
        if (r) {
            return this.host.factory.createReferenceValue(this, r);
        }
        return this.superType?.resolveName(name, typeOrModule);
    }

    getOperator(operator) {
        return this._operators?.get(operator) || this.superType?.getOperator(operator);
    }

    get afterFrame() {
        return this._afterFrame;
    }
    set afterFrame(f) {
        this._afterFrame = f;
    }

    toString() {
        if (this.definedIn == this.host.sxGlobalModule) {
            return this.name;
        }
        return this.fullyQualifiedName;
    }
}

export class EnumType extends Type {
    constructor(name, flags) {
        super();
        this._name = name;
        this._flags = flags;
        this._constants = new Map;
        this._specialMethods = new EnumSpecialMethods;
        this._foreignName = null;
        this._afterFrame = null;
    }

    get name() {
        return this._name;
    }

    get isEnum() {
        return true;
    }

    get enumFlags() {
        return this._flags;
    }
    set enumFlags(f) {
        this._flags = f;
    }

    get enumConstants() {
        return new Map(this._constants);
    }
    getEnumConstant(name) {
        return this._constants.get(name.toLowerCase()) || null;
    }
    setEnumConstant(name, doubleValue) {
        this._constants.set(name.toLowerCase(), doubleValue);
    }

    declareEnumSpecialMethods() {
        let {host} = this;
        let {factory} = host;

        let valueOfMethod = factory.createMethodSlot('ValueOf', factory.createFunctionSignature(null, null, null, this.host.doubleType));
        valueOfMethod.flags = MethodFlags.NATIVE;
        this.delegate.define('ValueOf', valueOfMethod);
        this.enumSpecialMethods.valueOfMethod = valueOfMethod;

        let toDebugStringMethod = factory.createMethodSlot('ToDebugString', factory.createFunctionSignature(null, null, null, this.stringType));
        toDebugStringMethod.flags = MethodFlags.NATIVE;
        this.delegate.define('ToDebugString', toDebugStringMethod);
        this.enumSpecialMethods.toDebugStringMethod = toDebugStringMethod;

        if ((this.enumFlags & EnumFlags.FLAGS) == 0) {
            return;
        }

        let hasMethod = factory.createMethodSlot('Has', factory.createFunctionSignature([this], null, null, host.booleanType));
        hasMethod.flags = MethodFlags.NATIVE;
        this.delegate.define('Has', hasMethod);
        this.enumSpecialMethods.hasMethod = hasMethod;

        let filterMethod = factory.createMethodSlot('Filter', factory.createFunctionSignature([this], null, null, this));
        filterMethod.flags = MethodFlags.NATIVE;
        this.delegate.define('Filter', filterMethod);
        this.enumSpecialMethods.filterMethod = filterMethod;

        let addMethod = factory.createMethodSlot('Add', factory.createFunctionSignature([this], null, null, this));
        addMethod.flags = MethodFlags.NATIVE;
        this.delegate.define('Add', addMethod);
        this.enumSpecialMethods.addMethod = addMethod;

        let removeMethod = factory.createMethodSlot('Remove', factory.createFunctionSignature([this], null, null, this));
        removeMethod.flags = MethodFlags.NATIVE;
        this.delegate.define('Remove', removeMethod);
        this.enumSpecialMethods.removeMethod = removeMethod;

        let toggleMethod = factory.createMethodSlot('Toggle', factory.createFunctionSignature([this], null, null, this));
        toggleMethod.flags = MethodFlags.NATIVE;
        this.delegate.define('Toggle', toggleMethod);
        this.enumSpecialMethods.toggleMethod = toggleMethod;
    }

    get foreignName() {
        return this._foreignName;
    }
    set foreignName(name) {
        this._foreignName = name;
    }

    get afterFrame() {
        return this._afterFrame;
    }
    set afterFrame(f) {
        this._afterFrame = f;
    }

    toString() {
        if (this.definedIn == this.host.sxGlobalModule) {
            return this.name;
        }
        return this.fullyQualifiedName;
    }
}

export class InterfaceType extends Type {
    constructor(name) {
        super();
        this._name = name;
        this._foreignName = null;
        this._superInterfaces = null;
        this._subInterfaces = null;
        this._implementors = [];
        this._afterFrame = null;
    }

    get isInterface() {
        return true;
    }

    get name() {
        return this._name;
    }

    get foreignName() {
        return this._foreignName;
    }
    set foreignName(name) {
        this._foreignName = name;
    }

    get implementors() {
        return this._implementors?.slice(0) || [];
    }
    addImplementor(c) {
        if (this._implementors.indexOf(c) == -1) {
            this._implementors.push(c);
        }
    }

    get superInterfaces() {
        return this._superInterfaces?.slice(0) || [];
    }
    addSuperInterface(t) {
        this._superInterfaces = this._superInterfaces || [];
        if (this._superInterfaces.indexOf(t) == -1) {
            this._superInterfaces.push(t);
        }
    }

    get subInterfaces() {
        return this._subInterfaces?.slice(0) || [];
    }
    addSubInterface(t) {
        this._subInterfaces = this._subInterfaces || [];
        if (this._subInterfaces.indexOf(t) == -1) {
            this._subInterfaces.push(t);
        }
    }

    extendType(type) {
        if (type.isSubtypeOf(this) || this.isSubtypeOf(type) || !type.isInterface) {
            return [];
        }
        type.addSubInterface(this);
        this.addSuperInterface(type);

        for (let [name, slot] of new NamesHierarchy(type.delegate)) {
            this.delegate.names.set(name, slot);
        }
        for (let [operator, slot] of type.operators) {
            this.addOperator(operator, slot);
        }
        for (let [operator, slot] of type.delegate.operators) {
            this.delegate.addOperator(operator, slot);
        }
        return [];
    }

    resolveName(name, typeOrModule = false) {
        let r = this.names.resolveName(name, typeOrModule);
        if (r) {
            return this.host.factory.createReferenceValue(this, r);
        }
        return this.superType?.resolveName(name, typeOrModule);
    }

    getOperator(operator) {
        return this._operators?.get(operator) || this.superType?.getOperator(operator);
    }

    get afterFrame() {
        return this._afterFrame;
    }
    set afterFrame(f) {
        this._afterFrame = f;
    }

    toString() {
        if (this.definedIn == this.host.sxGlobalModule) {
            return this.name;
        }
        return this.fullyQualifiedName;
    }
}

export class NullableType extends Type {
    constructor(wrapsType) {
        super();
        this._wrapsType = wrapsType;
    }

    get isNullableType() {
        return true;
    }

    get wrapsType() {
        return this._wrapsType;
    }

    escapeType() {
        return this._wrapsType;
    }

    get superType() {
        return this._wrapsType.superType;
    }

    get defaultValue() {
        return this.host.factory.createNullConstant(this);
    }

    get classFlags() {
        return this.wrapsType.classFlags;
    }

    get enumFlags() {
        return this.wrapsType.enumFlags;
    }

    get containsNull() {
        return true;
    }

    toString() {
        return this.wrapsType.toString() + "?";
    }
}

export class TupleType extends Type {
    constructor(elements) {
        super();
        this._elements = elements.slice(0);
    }

    get isTupleType() {
        return true;
    }

    get tupleElements() {
        return this._elements.slice(0);
    }

    get superType() {
        return this.host.objectType;
    }

    toString() {
        return "(" + this._elements.map(e => e.join(', ')) + ")";
    }
}

export class FunctionSignature extends Symbol {
    constructor(params, optParams, rest, returnType) {
        super();
        this._params = params?.slice(0);
        this._optParams = optParams?.slice(0);
        this._rest = rest;
        this._returnType = returnType;
    }

    get isFunctionSignature() {
        return true;
    }

    get params() {
        return this._params?.slice(0);
    }

    get optParams() {
        return this._optParams?.slice(0);
    }

    get restParam() {
        return this._rest;
    }

    get returnType() {
        return this._returnType;
    }

    overridableBy(argument) {
        let i = 0;
        let l = 0;

        // required parameters
        if (this._params != null) {
            l = this._params.length;
            if (argument._params?.length != l) {
                return false;
            }
            for (i = 0; i < this._params.length; ++i) {
                if (this._params[i][1] != argument._params[i][1]) {
                    return false;
                }
            }
        } else if (argument._params != null) {
            return false;
        }

        // optional parameters
        if (this._optParams != null) {
            l = this._optParams.length;
            if (argument._optParams?.length < l) {
                return false;
            }
            for (i = 0; i != l; ++i) {
                let pA = this._optParams[i];
                let pB = argument._optParams[i];
                if (pA[1] != pB[1]) {
                    return false;
                }
            }
            // cannot introduce extra optional parameters when the super
            // method has a rest parameter
            if (argument._optParams.length > l && this._rest != null) {
                return false;
            }
        } else if (argument._optParams != null && this._rest != null) {
            return false;
        }

        if (this._rest != null && argument.restParam == null) {
            return false;
        }

        // overrider result type can be subtype of the super method result type
        return this._returnType == argument._returnType || argument._returnType.isSubtypeOf(this._returnType);
    }

    toString() {
        let p = [];
        for (let pa of this._params) {
            let t = pa[1].isAnyType ? '' : ' As ' + pa[1].toString();
            p.push(pa[0] + t);
        }
        for (let pa of this._optParams) {
            let t = pa[1].isAnyType ? '' : ' As ' + pa[1].toString();
            p.push(pa[0] + t + ' = ' + pa[2].toString());
        }
        if (this._rest) {
            p.push('...' + this._rest);
        }
        if (this.returnType == this.host.nothingType) {
            return "Sub(" + p.join(', ') + ")";
        }
        return "Function(" + p.join(', ') + ") As " + this.returnType.toString();
    }
}

export class Delegate extends ObjectValue {
    constructor(definedIn) {
        super();
        this.definedIn = definedIn;
        this._inherits = null;
        this._operators = null;
    }

    get isDelegate() {
        return true;
    }

    get reflectsType() {
        return this.definedIn;
    }

    get inheritsDelegate() {
        return this._inherits;
    }

    set inheritsDelegate(d) {
        this._inherits = d || null;
    }

    resolveName(name, typeOrModule = false) {
        let r = this.names.resolveName(name, typeOrModule);
        return r ? this.host.factory.createReferenceValue(this, r) : this._inherits?.resolveName(name, typeOrModule);
    }

    get operators() {
        return new Map(this._operators || new Map);
    }

    addOperator(o, slot) {
        this._operators = this._operators || new Map;
        this._operators.set(o, slot);
    }

    getOperator(o) {
        return this._operators?.get(o);
    }

    findInheritedOperator(operator) {
        return this.getOperator(operator) || this._inherits?.findInheritedOperator(operator) || null;
    }
}

class ReferenceValue extends Value {
    constructor(object, property) {
        super();
        this._object = object;
        this._property = property;
    }

    get object() {
        return this._object;
    }

    get property() {
        return this._property;
    }

    get isReferenceValue() {
        return true;
    }

    get readOnly() {
        return this.property.readOnly;
    }

    get writeOnly() {
        return this.property.writeOnly;
    }
}

class DynamicReferenceValue extends Value {
    constructor(object) {
        super();
        this._object = object;
    }

    get isDynamicReferenceValue() {
        return true;
    }

    get object() {
        return this._object;
    }

    get readOnly() {
        return false;
    }

    get writeOnly() {
        return false;
    }
}

class IndexReferenceValue extends Value {
    constructor(object) {
        super();
        this._object = object;
    }

    get isIndexReferenceValue() {
        return true;
    }

    get object() {
        return this._object;
    }

    get readOnly() {
        let d = this._object.valueType.delegate;
        return !!(d?.findInheritedOperator(Operator.SET_INDEX) == null);
    }

    get writeOnly() {
        let d = this._object.valueType.delegate;
        return !!(d?.findInheritedOperator(Operator.GET_INDEX) == null);
    }
}

class TupleElement extends Value {
    constructor(object, index) {
        super();
        this._object = object;
        this._index = index;
    }

    get isTupleElement() {
        return true;
    }

    get object() {
        return this._object;
    }

    get index() {
        return this._index;
    }

    get readOnly() {
        return true;
    }

    get writeOnly() {
        return false;
    }
}

class FunctionExpValue extends Value {
    constructor(slot) {
        super();
        this._slot = slot;
    }

    get isFunctionExpValue() {
        return true;
    }

    get ofMethodSlot() {
        return this._slot;
    }
}

class ConversionValue extends Value {
    constructor(base, relationship, toType, byCType, byTryCast) {
        super();
        this._base = base;
        this._rel = relationship;
        this.valueType = toType;
        this._byCType = byCType;
        this._byTryCast = byTryCast;
    }

    get isConversionValue() {
        return true;
    }

    get conversionBase() {
        return this._base;
    }

    get conversionRelationship() {
        return this._rel;
    }

    get byCType() {
        return this._byCType;
    }
    set byCType(v) {
        this._byCType = v;
    }

    get byTryCast() {
        return this._byTryCast;
    }
    set byTryCast(v) {
        this._byTryCast = v;
    }
}

class SkipVarDecl extends Symbol {
    get isSkipVarDecl() {
        return true;
    }
}

class ConversionRelationship {
    constructor(id) {
        this._value = id
        ConversionRelationship._byValue.set(id, this);
    }

    static fromId(id) {
        return ConversionRelationship._byValue.get(id) || null;
    }

    valueOf() {
        return this._value;
    }
}

ConversionRelationship._byValue = new Map;

ConversionRelationship.NUMERIC = new ConversionRelationship(0);
ConversionRelationship.TO_ANY = new ConversionRelationship(1);
ConversionRelationship.FROM_ANY = new ConversionRelationship(2);
ConversionRelationship.TO_STRING = new ConversionRelationship(3);
ConversionRelationship.NUMBER_TO_FLAGS = new ConversionRelationship(4);
ConversionRelationship.TO_IMPLEMENTED_INTERFACE = new ConversionRelationship(5);
ConversionRelationship.TO_SUPER_CLASS = new ConversionRelationship(6);
ConversionRelationship.TO_SUBCLASS = new ConversionRelationship(7);
ConversionRelationship.TO_SUPER_INTERFACE = new ConversionRelationship(8);
ConversionRelationship.TO_SUB_INTERFACE = new ConversionRelationship(9);
ConversionRelationship.FROM_NULLABLE = new ConversionRelationship(10);
ConversionRelationship.TO_NULLABLE = new ConversionRelationship(11);
ConversionRelationship.TO_IMPLEMENTOR = new ConversionRelationship(12);

export class Host {
    constructor() {
        this.factory = new HostFactory(this);
        this.sxModule = null;
        this.sxGlobalModule = null;
        this.anyType = null;
        this.emptyType = null;
        this.nothingType = null;
        this.nullType = null;
        this.objectType = null;
        this.callableType = null;
        this.reflectModule = null;
        this.reflectClassType = null;
        this.stringType = null;
        this.integerType = null;
        this.longType = null;
        this.byteType = null;
        this.singleType = null;
        this.doubleType = null;
        this.decimalType = null;
        this.charType = null;
        this.numericTypes = new Set;
        this.integerTypes = new Set;
        this.booleanType = null;
        this.collectionType = null;
        this.byteCollectionType = null;
        this.generatorType = null;
        this.promiseType = null;

        this._rootModules = new Map;
        this._typeInstantiations = new Map;
        this._nullableTypes = new Map;
        this._tupleTypes = [[]];
    }

    init() {
        this.sxModule = this.factory.createModule('ShockScript');
        this.setRootModule('ShockScript', this.sxModule);
        this.sxGlobalModule = this.factory.createModule('Global');
        this.sxModule.define('Global', this.sxGlobalModule);
        this.anyType = this.factory.createAnyType();
        this.emptyType = this.factory.createEmptyType();
        this.nothingType = this.factory.createNothingType();
        this.nullType = this.factory.createNullType();
        this.objectType = this._declareGlobalClass('Object', false);
        this.callableType = this._declareGlobalClass('Callable');

        this.stringType = this._declareGlobalClass('String');
        this.integerType = this._declareGlobalStructure('Integer');
        this.longType = this._declareGlobalStructure('Long');
        this.byteType = this._declareGlobalStructure('Byte');
        this.singleType = this._declareGlobalStructure('Single');
        this.doubleType = this._declareGlobalStructure('Double');
        this.decimalType = this._declareGlobalStructure('Decimal');
        this.charType = this._declareGlobalStructure('Char');
        this.booleanType = this._declareGlobalStructure('Boolean');

        this.numericTypes = new Set([this.integerType, this.longType, this.byteType, this.singleType, this.doubleType, this.decimalType, this.charType]);
        this.integerTypes = new Set([this.integerType, this.longType, this.byteType, this.charType]);

        this.collectionType = this._declareGlobalClass('Collection');
        this.byteCollectionType = this._declareGlobalClass('ByteCollection');
        this.generatorType = this._declareGlobalClass('Generator');
        this.promiseType = this._declareGlobalClass('Promise');

        this.reflectModule = this.factory.createModule('Reflect');
        this.sxGlobalModule.define('Reflect', this.reflectModule);
        this.reflectClassType = this.factory.createClass('Class');
        this.reflectModule.define('Class', this.reflectClassType);

        this.sxGlobalModule.define('Any', this.anyType);
    }

    _declareGlobalClass(name, notInheritable = true) {
        let sym = this.factory.createClass(name, (notInheritable ? ClassFlags.NOT_INHERITABLE : 0));
        if (name.toLowerCase() != 'object') {
            sym.superType = this.objectType;
        }
        this.sxGlobalModule.define(name, sym);
        return sym;
    }

    _declareGlobalStructure(name) {
        let sym = this.factory.createStructure(name);
        sym.superType = this.objectType;
        this.sxGlobalModule.define(name, sym);
        return sym;
    }

    isNumericType(t) {
        return this.numericTypes.has(t);
    }

    isIntegerType(t) {
        return this.integerTypes.has(t);
    }

    getTupleTypes() {
        let r = [];
        for (let list of this.factory._tupleTypes) {
            r.push.apply(r, list);
        }
        return r;
    }

    getRootModule(name) {
        return this._rootModules.get(name.toLowerCase());
    }
    hasRootModule(name) {
        return this._rootModules.has(name.toLowerCase());
    }
    setRootModule(name, symbol) {
        this._rootModules.set(name.toLowerCase(), symbol);
    }
    get rootModules() {
        let r = [];
        for (let [_, symbol] of this._rootModules) {
            r.push(symbol);
        }
        return r;
    }
}

export class HostFactory {
    constructor(host) {
        this._host = host;
        this._nullableTypes = new Map;
        this._tupleTypes = [];
    }

    createIncompatibleOverrideSignatureError(expectedSignature) {
        let r = new IncompatibleOverrideSignatureError(expectedSignature);
        r._host = this._host;
        return r;
    }

    createMustOverrideAMethodError() {
        let r = new MustOverrideAMethodError;
        r._host = this._host;
        return r;
    }

    createNotOverridableError() {
        let r = new NotOverridableError;
        r._host = this._host;
        return r;
    }

    createOverridingPrivateError() {
        let r = new OverridingPrivateError;
        r._host = this._host;
        return r;
    }

    createOverridingWithDifferentVisibilityError() {
        let r = new OverridingWithDifferentVisibilityError;
        r._host = this._host;
        return r;
    }

    createAmbiguousReferenceError(name, betweenPackages = null) {
        let r = new AmbiguousReferenceError(name, betweenPackages);
        r._host = this._host;
        return r;
    }

    createDuplicateDefinitionError(name, definition) {
        let r = new DuplicateDefinitionError(name, definition);
        r._host = this._host;
        return r;
    }

    createWrongNumberOfArgumentsError(expected) {
        let r = new WrongNumberOfArgumentsError(expected);
        r._host = this._host;
        return r;
    }

    createModule(name) {
        let r = new Module(name);
        r._host = this._host;
        return r;
    }

    createDelegate(forType) {
        let r = new Delegate(forType);
        r._host = this._host;
        return r;
    }

    createTargetAndValuePair(target, value) {
        let r = new TargetAndValuePair(target, value);
        r._host = this._host;
        return r;
    }

    createShortVarDeclAssignment(variable) {
        let r = new ShortVarDeclAssignment(variable);
        r._host = this._host;
        return r;
    }

    createSkipVarDecl() {
        let r = new SkipVarDecl;
        r._host = this._host;
        return r;
    }

    createSymbolAlias(name, aliased) {
        let r = new SymbolAlias(name, aliased);
        r._host = this._host;
        return r;
    }

    createVariableSlot(name, readOnly, type) {
        let r = new VariableSlot(name, readOnly, type);
        r._host = this._host;
        return r;
    }

    createVirtualSlot(name, type) {
        let r = new VirtualSlot(name, type);
        r._host = this._host;
        return r;
    }

    createMethodSlot(name, signature) {
        let r = new MethodSlot(name, signature);
        r._host = this._host;
        return r;
    }

    createValue(type) {
        let r = new Value;
        r.valueType = type;
        r._host = this._host;
        return r;
    }

    createInstanceMe(type) {
        let r = new InstanceMe;
        r.valueType = type;
        r._host = this._host;
        return r;
    }

    createClassStaticMe(forType) {
        let r = new ClassStaticMe(forType);
        r.valueType = this._host.anyType;
        r._host = this._host;
        return r;
    }

    createEmptyConstant(type) {
        let r = new EmptyConstant;
        r.valueType = type || this._host.emptyType;
        r._host = this._host;
        return r;
    }

    createNothingConstant(type) {
        let r = new NothingConstant;
        r.valueType = type || this._host.nothingType;
        r._host = this._host;
        return r;
    }

    createNullConstant(type) {
        let r = new NullConstant;
        r.valueType = type || this._host.nullType;
        r._host = this._host;
        return r;
    }

    createStringConstant(value, type) {
        let r = new StringConstant(value);
        r.valueType = type || this._host.stringType;
        r._host = this._host;
        return r;
    }

    createBooleanConstant(value, type) {
        let r = new BooleanConstant(value);
        r.valueType = type || this._host.booleanType;
        r._host = this._host;
        return r;
    }

    createSingleConstant(value, type) {
        let r = new SingleConstant(value);
        r.valueType = type || this._host.singleType;
        r._host = this._host;
        return r;
    }

    createDoubleConstant(value, type) {
        let r = new DoubleConstant(value);
        r.valueType = type || this._host.doubleType;
        r._host = this._host;
        return r;
    }

    createByteConstant(value, type) {
        let r = new ByteConstant(value);
        r.valueType = type || this._host.byteType;
        r._host = this._host;
        return r;
    }

    createIntegerConstant(value, type) {
        let r = new IntegerConstant(value);
        r.valueType = type || this._host.integerType;
        r._host = this._host;
        return r;
    }

    createLongConstant(value, type) {
        let r = new LongConstant(value);
        r.valueType = type || this._host.longType;
        r._host = this._host;
        return r;
    }

    createDecimalConstant(value, type) {
        let r = new DecimalConstant(value);
        r.valueType = type || this._host.decimalType;
        r._host = this._host;
        return r;
    }

    createCharConstant(value, type) {
        let r = new CharConstant(value);
        r.valueType = type || this._host.charType;
        r._host = this._host;
        return r;
    }

    createEnumConstant(value, type) {
        let r = new EnumConstant(value);
        r.valueType = type;
        r._host = this._host;
        return r;
    }

    createFrame() {
        let r = new Frame;
        r._host = this._host;
        return r;
    }

    createClassFrame(c) {
        let r = new ClassFrame(c);
        r._host = this._host;
        return r;
    }

    createEnumFrame(e) {
        let r = new EnumFrame(e);
        r._host = this._host;
        return r;
    }

    createInterfaceFrame(i) {
        let r = new InterfaceFrame(i);
        r._host = this._host;
        return r;
    }

    createModuleFrame(m) {
        let r = new ModuleFrame(m);
        r._host = this._host;
        return r;
    }

    createActivationFrame(a) {
        let r = new ActivationFrame(a);
        r._host = this._host;
        return r;
    }

    createWithFrame(type) {
        let r = new WithFrame;
        r._host = this._host;
        r.symbol = this.createReferenceValue(r, this.createVariableSlot(null, true, type));
        return r;
    }

    createFunctionSignature(params, optParams, restParam, returnType) {
        let r = new FunctionSignature(params, optParams, restParam, returnType);
        r._host = this._host;
        return r;
    }

    createAnyType() {
        if (this._host.anyType != null) {
            return this._host.anyType;
        }
        let r = new AnyType;
        r._host = this._host;
        this._host.anyType = r;
        return r;
    }

    createEmptyType() {
        if (this._host.emptyType != null) {
            return this._host.emptyType;
        }
        let r = new EmptyType;
        r._host = this._host;
        this._host.emptyType = r;
        return r;
    }

    createNothingType() {
        if (this._host.nothingType != null) {
            return this._host.nothingType;
        }
        let r = new NothingType;
        r._host = this._host;
        this._host.nothingType = r;
        return r;
    }

    createNullType() {
        if (this._host.nullType != null) {
            return this._host.nullType;
        }
        let r = new NullType;
        r._host = this._host;
        this._host.nullType = r;
        return r;
    }

    createClass(name, flags = 0) {
        let r = new ClassType(name, flags);
        r._host = this._host;
        r.delegate = createDelegate(r);
        r.delegate.inheritsDelegate = this._host.objectType?.delegate;
        return r;
    }

    createStructureType(name) {
        let r = new StructureType(name);
        r._host = this._host;
        r.delegate = createDelegate(r);
        r.delegate.inheritsDelegate = this._host.objectType?.delegate;
        return r;
    }

    createEnumType(name, enumFlags = 0) {
        let r = new EnumType(name, enumFlags);
        r._host = this._host;
        r.delegate = createDelegate(r);
        r.delegate.inheritsDelegate = this._host.objectType?.delegate;
        return r;
    }

    createInterfaceType(name) {
        let r = new InterfaceType(name);
        r._host = this._host;
        r.delegate = createDelegate(r);
        return r;
    }

    createNullableType(type) {
        if (type.containsNull) {
            return type;
        }
        let r = this._nullableTypes.get(type);
        let r = new NullableType(type);
        r._host = this._host;
        r.delegate = r.delegate;
        this._nullableTypes.set(type, r);
        return r;
    }

    createTupleType(elements) {
        let r = null;
        let i = 0;
        let l = elements.length;
        for (i = this._tupleTypes.length; i < l; ++i) {
            this._tupleTypes.push([]);
        }
        let list = this._tupleTypes[l - 1];

        search:
        for (let type2 of list) {
            let elements2 = type2.tupleElements;
            if (elements.some((e, i) => e != elements2[i])) {
                continue search;
            }
            return type2;
        }

        r = new TupleType(elements);
        r._host = this._host;
        r.delegate = this._host.objectType?.delegate;
        list.push(r);
        return r;
    }

    createConversionValue(cBase, cRelationship, toType, byCType = false, byTryCast = false) {
        let r = new ConverisonValue(cBase, cRelationship, toType, byCType, byTryCast);
        r.valueType = type;
        r._host = this._host;
        return r;
    }

    createFunctionExpValue(methodSlot) {
        let r = new FunctionExpValue(methodSlot);
        r.valueType = type;
        r._host = this._host;
        return r;
    }

    createReferenceValue(object, property) {
        if (property.isModule || property.isType) {
            return property;
        }
        let r = new ReferenceValue(object, property);
        r.valueType = property.valueType || this.host.callableType;
        r._host = this._host;
        return r;
    }

    createDynamicReferenceValue(object) {
        let r = new DynamicReferenceValue(object);
        r.valueType = this.host.anyType;
        r._host = this._host;
        return r;
    }

    createIndexReferenceValue(object) {
        let vt = null;
        let d = this._object.valueType.delegate;
        let iom = d.findInheritedOperator(Operator.GET_INDEX);
        if (iom != null) {
            vt = iom.functionSignature.returnType;
        } else {
            iom = d.findInheritedOperator(Operator.SET_INDEX);
            vt = iom.functionSignature.params[iom.functionSignature.params.length - 1][1];
        }
        let r = new IndexReferenceValue(object);
        r.valueType = vt;
        r._host = this._host;
        return r;
    }

    createTupleElement(object, index) {
        let r = new TupleElement(object, index);
        r.valueType = object.valueType.escapeType().tupleElements[index];
        r._host = this._host;
        return r;
    }
}