var isolate		= require('./isolate.js');

function startsWith(s, n) {
    return s.indexOf(n) === 0;
}

function populater(code, ctx, fn_ctx) {
    
    if (typeof code !== 'string')
	throw new Error(
	    populater(
		"Populater can only handle string formatting not type '{{type}}' {{ctx}}",
		{ type:typeof code, ctx:JSON.stringify(code, null, 4) }
	    )
	);

    var v;
    if (startsWith(code, '<'))
	v		= isolate.eval("this."+code.slice(1), ctx, fn_ctx);
    else if (startsWith(code, ':'))
	v		= populater.fill(code.slice(1), ctx, fn_ctx);
    else {
	v		= populater.fill(code, ctx, fn_ctx);
	if (startsWith(code, '=')) {
	    v		= isolate.eval(v.slice(1), ctx, fn_ctx);
	}
    }

    populater.before	= code; // temporary: need by tests for logging
    populater.after	= v; // temporary: need by tests for logging
    return v;
}
populater.fill		= function(s, ctx, fn_ctx) {
    var v;
    var str		= s.slice();
    
    var regex		= /{{([^}]+)}}/gi;
    var match		= regex.exec(s);
    while (match !== null) {
	v		= isolate.eval("this."+match[1].trim(), ctx, fn_ctx);
	if (v === undefined)
	    v		= '';
	str		= str.replace(match[0], v);
	var match	= regex.exec(s);
    }
    
    return str;
};
populater.error		= function(fn) {
    return isolate.error(fn);
}
populater.method	= function(name, fn, err) {
    return isolate.method(name, fn, err);
}

module.exports		= populater;
