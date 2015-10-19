
function safeEval(data, fn) {
    try {
	value	= fn.call(data);
    }
    catch (e) {
	value	= '';
    }
    return value;
}
function startsWith(s, n) {
    return s.indexOf(n) === 0;
}
function format(s, data) {
    var value;
    var str		= s.slice();
    var re		= /{([^}]+)}/gi;
    var match		= re.exec(s);
    while (match !== null) {
	value		= safeEval(data, function() {
	    var value	= eval("this."+match[1].trim());
	    return value === undefined
		? '' : value;
	});
	str		= str.replace(match[0], value);
	var match	= re.exec(s);
    }
    return str;
}

function fill(s, data) {
    if (startsWith(s, '<'))
	return safeEval(data, function() {
	    return eval("this."+s.slice(1));
	});

    if (startsWith(s, ':'))
	return format(s.slice(1), data);
    else {
	var v		= format(s, data);
	if (startsWith(s, '='))
	    v		= safeEval(data, function() {
		return eval(v.slice(1));
	    });
	return v;
    }
}
fill.format	= format;
module.exports	= fill;
