
var f	= require('./index.js');

function fill(s,d) {
    var v	= f(s,d);
    fill.last	= s;
    fill.data	= d;
    fill.value	= v;
    return v;
}

function assert(e) {
    assert.count	= assert.count ? assert.count++ : 1;
    var conversion	= "'"+fill.last+"'"+"	>>	'"+fill.value+"'";
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

var str	= fill("{name.first} {name.last}", Person);
assert(str === "Travis Mottershead");

var str	= fill("{name['first']} {name['last']}", Person);
assert(str === "Travis Mottershead");

var str	= fill("{name.first} {name.first}", Person);
assert(str === "Travis Travis");

var str	= fill("< name.first", Person);
assert(str === "Travis");

var str	= fill("= {age} > 18", Person);
assert(str);

var str	= fill("{name.none}", Person);
assert(str === "");

var str	= fill("= {name.first}", Person);
assert(str === "");

var str	= fill("= {name.none}", Person);
assert(str === undefined);

var str	= fill(":= {name.full}", Person);
assert(str === "= Travis Mottershead");

var str	= fill("= '= {name.full}'", Person);
assert(str === "= Travis Mottershead");

var str	= fill(":: {name.full}", Person);
assert(str === ": Travis Mottershead");

var str	= fill("= this.name.full", Person);
assert(str === "Travis Mottershead");
