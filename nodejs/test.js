
var fill	= require('./index.js');

function assert(e) {
    assert.count	= assert.count ? assert.count++ : 1;
    var conversion	= "'"+fill.before+"'"+"	>>	'"+fill.after+"'";
    if (e!==true)
	console.log("Failed Test "+assert.count+": "+conversion);
    else
	console.log("Passed: "+conversion);
}

var Person = {
    age: 20,
    name: {
	first: "Travis",
	last: "Mottershead",
	full: "Travis Mottershead"
    }
}

var str	= fill("{{name.first}} {{name.last}}", Person);
assert(str === "Travis Mottershead");

var str	= fill("{{name['first']}} {{name['last']}}", Person);
assert(str === "Travis Mottershead");

var str	= fill("{{name.first}} {{name.first}}", Person);
assert(str === "Travis Travis");

var str	= fill("< name.first", Person);
assert(str === "Travis");

var str	= fill("= {{age}} > 18", Person);
assert(str);

var str	= fill("{{name.none}}", Person);
assert(str === "");

fill.error(function(e) {
    if (e.toString() === "ReferenceError: Travis is not defined")
	console.log("Passed: Caught error 'ReferenceError: Travis is not defined'");
    else
	throw Error("Failed: '= {{name.first}}' didn't throw correct error");
});
var str	= fill("= {{name.first}}", Person);
assert(str === null);

var str	= fill("= {{name.none}}", Person);
assert(str === undefined);

var str	= fill(":= {{name.full}}", Person);
assert(str === "= Travis Mottershead");

var str	= fill("= '= {{name.full}}'", Person);
assert(str === "= Travis Mottershead");

var str	= fill(":: {{name.full}}", Person);
assert(str === ": Travis Mottershead");

var str	= fill("= this.name.full", Person);
assert(str === "Travis Mottershead");

fill.method('poop', function(str) {
    return str+" and "+this.name.full;
});

var str	= fill("= poop('Geoff Dick')", Person);
assert(str === "Geoff Dick and Travis Mottershead");

try {
    fill.method('eval', function() {
	return true;
    });
} catch (err) {
    if(err.message !== "eval is a reserved function name")
	console.log("Failed: To catch error for reserved method name");
    else
	console.log("Passed: Caught error for create reserved method name");
}

var name = fill("< name", Person);
assert(typeof name === 'object');

var str	= fill("= ({name:{full:'Samuel Jackson'}}).name.full", Person);
assert(str === "Samuel Jackson");


var isolate		= require('./isolate.js');

isolate.method('echo', function() {
    return this.join(' ');
});
// console.log( isolate.inspect('echo').toString() );
// console.log( isolate.eval('global["echo"] = console.log') );
// console.log( isolate.eval('echo("Console.log", "Hello", "World!", "Goodmoring", "Vietnam!")') );

var data	= isolate.eval('echo()', [
    "Hello", "World!", "Goodmorning", "Vietnam!"
]);
assert( data === "Hello World! Goodmorning Vietnam!");
