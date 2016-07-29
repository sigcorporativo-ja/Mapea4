/**
 * @externs
 */

/**
 * @type {Object}
 */
var Compilerx;

/**
 * @type {Object}
 */
var Visitorx;

/**
 * @type {Object}
 */
var JavaScriptCompilerx

/**
 * @type {Object}
 */
var HandlebarsEnvironmentx;

/**
 * @type {Object}
 */
var SafeStringx;

/**
 * @type {Object}
 */
var Errorx;

/**
 * @type {Object}
 */
var Exceptionx;

/**
 * @type {Object}
 */
var Parserx;

/**
 * @type {Object}
 */
var WhitespaceControlx;

/**
 * @type {Object}
 */
var SourceNodex;

/**
 * @type {Object}
 */
var CodeGenx;

/**
 * @type {Object}
 */
var containerx;

/* typedefs for object literals provided by applications */

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.compiler;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.main;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.useData;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.equals;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.guid;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.compile;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.compileProgram;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.accept;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.Program;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.BlockStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.DecoratorBlock;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.PartialStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.PartialBlockStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.MustacheStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.Decorator;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.ContentStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.CommentStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.SubExpression;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.ambiguousSexpr;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.simpleSexpr;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.helperSexpr;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.PathExpression;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.StringLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.NumberLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.BooleanLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.UndefinedLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.NullLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.Hash;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.opcode;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.addDepth;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.classifySexpr;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.pushParams;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.pushParam;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.setupFullMustacheParams;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Compilerx.prototype.blockParamIndex;


/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.constructor;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.mutating;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.acceptKey;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.acceptRequired;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.acceptArray;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.accept;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.Program;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.MustacheStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.Decorator;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.BlockStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.DecoratorBlock;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.PartialStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.PartialBlockStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.ContentStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.CommentStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.SubExpression;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.PathExpression;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.StringLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.NumberLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.BooleanLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.UndefinedLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.NullLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.Hash;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Visitorx.prototype.HashPair;



/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.nameLookup;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.depthedLookup;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.compilerInfo;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.appendToBuffer;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.initializeBuffer;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.compile;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.preamble;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.createFunctionContext;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.mergeSource;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.blockValue;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.ambiguousBlockValue;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.appendContent;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.append;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.appendEscaped;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.getContext;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushContext;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.lookupOnContext;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.lookupBlockParam;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.lookupData;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.resolvePath;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.resolvePossibleLambda;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushStringParam;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.emptyHash;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushHash;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.popHash;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushString;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushProgram;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.registerDecorator;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.invokeHelper;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.invokeKnownHelper;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.invokeAmbiguous;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.invokePartial;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.assignToHash;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushId;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.compiler;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.compileChildren;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.matchExistingProgram;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.programExpression;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.useRegister;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.push;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushStackLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.pushSource;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.replaceStack;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.incrStack;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.topStackName;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.flushInline;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.isInline;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.popStack;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.topStack;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.contextName;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.quotedString;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.objectLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.aliasable;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.setupHelper;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.setupParams;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
JavaScriptCompilerx.prototype.setupHelperArgs;


/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
HandlebarsEnvironmentx.prototype.registerHelper;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
HandlebarsEnvironmentx.prototype.unregisterHelper;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
HandlebarsEnvironmentx.prototype.registerPartial;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
HandlebarsEnvironmentx.prototype.unregisterPartial;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
HandlebarsEnvironmentx.prototype.registerDecorator;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
HandlebarsEnvironmentx.prototype.unregisterDecorator;


/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
SafeStringx.prototype.toString;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
SafeStringx.prototype.toHTML;


/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Errorx.prototype.captureStackTrace;


/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
Parserx.prototype.lexer;


/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
WhitespaceControlx.prototype.Program;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
WhitespaceControlx.prototype.BlockStatement;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
WhitespaceControlx.prototype.Decorator;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
WhitespaceControlx.prototype.PartialStatement;


/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
SourceNodex.prototype.add;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
SourceNodex.prototype.prepend;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
SourceNodex.prototype.toStringWithSourceMap;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
SourceNodex.prototype.toString;


/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.isEmpty;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.prepend;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.push;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.merge;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.each;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.empty;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.wrap;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.functionCall;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.quotedString;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.objectLiteral;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.generateList;

/**
 * Property of Handlebars
 * @type {function}
 * @api stable
 */
CodeGenx.prototype.generateArray;

/**
 * Property of Handlebars
 */
containerx.strict;

/**
 * Property of Handlebars
 */
containerx.lookup;

/**
 * Property of Handlebars
 */
containerx.lambda;

/**
 * Property of Handlebars
 */
containerx.escapeExpression;

/**
 * Property of Handlebars
 */
containerx.invokePartial;

/**
 * Property of Handlebars
 */
containerx.fn;

/**
 * Property of Handlebars
 */
containerx.programs;

/**
 * Property of Handlebars
 */
containerx.program;

/**
 * Property of Handlebars
 */
containerx.data;

/**
 * Property of Handlebars
 */
containerx.merge;

/**
 * Property of Handlebars
 */
containerx.noop;

/**
 * Property of Handlebars
 */
containerx.compilerInfo;