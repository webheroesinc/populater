
import logging

from populater			import ( Populater, isolate )

log				= logging.getLogger("tests")
log.setLevel( logging.DEBUG )


def test_isolate_method():
    isolate.method('chin', lambda self, *args: max(*args))

    assert isolate.evaluate('chin(1,2,3)') == 3

def test_isolate_method_decorator():
    @isolate.method()
    def chin(self, *args):
        return max(*args)

    assert isolate.evaluate('chin(1,2,3)') == 3

def test_isolate_method_fail():
    def assert_error(e):
        log.warn("ERROR: {}".format(e))
        assert isinstance(e, Exception)
        
    isolate.method('chin', max, assert_error)

    assert isolate.evaluate('chin(1,2,3)') == None

def test_ctx():
    Person = {
        "age": 20,
        "name": {
	    "first": "Travis",
	    "last": "Mottershead",
	    "full": "Travis Mottershead"
        }
    }
    ctx			=  Populater( Person )

    assert ctx('{{ age }}') == '20'
    assert ctx('< age') == 20
    assert ctx('= {{ age }}') == 20
    assert ctx("{{ name.first }} {{ name.last }}") == "Travis Mottershead"
    assert ctx("{{ name.first }} {{ name.first }}") == "Travis Travis"
    assert ctx("< name.first")			== "Travis"
    assert ctx("= {{ age }} > 18") is True
    assert ctx("{{ name.none }}")		== ""
    assert ctx("= {{ name.none }}") is None
    assert ctx(":= {{ name.full }}")		== "= Travis Mottershead"
    assert ctx("= '= {{ name.full }}'")		== "= Travis Mottershead"
    assert ctx(":: {{ name.full }}")		== ": Travis Mottershead"
    assert ctx("= self['name']['full']")	== "Travis Mottershead"

def test_ctx_class():
    class Data( object ):
        def test(self):
            return "Monkey man"
    ctx			=  Populater( Data() )

    assert ctx("= self.test()") == "Monkey man"

def test_ctx_dict_callable():
    data		= {
        "Mod": {
            "chin": max
        }
    }
    ctx			=  Populater( data )

    assert ctx("< Mod.chin(1,2,3)") == 3

def test_ctx_save_dict():
    data		= {}
    ctx			=  Populater( data )
    ctx.save("Mod.chin", max)
    
    assert ctx("< Mod.chin(1,2,3)") == 3

def test_ctx_save_dict():
    data		= {}
    ctx			= Populater( data )
    ctx.save("chin", max)
    
    assert ctx("< chin(1,2,3)") == 3

def test_ctx_save_dict():
    class Mod( object ):
        def hip(self, *args):
            return min(*args)
        
    data		= {
        "Mod": Mod()
    }
    ctx			= Populater( data )
    ctx.save("Mod.check.chin", max)
    
    assert ctx("< Mod.check.chin(1,2,3)") == 3

def test_ctx_save_object():
    class Mod( object ):
        def hip(self, *args):
            return min(*args)
        
    data		= {
        "Mod": Mod()
    }
    ctx			= Populater( data )
    ctx.save("Mod.check.chin", max)
    
    assert ctx("< Mod.check.chin(1,2,3)") == 3

def test_ctx_save_object_object():
    class Mod( object ):
        def hip(self, *args):
            return min(*args)
    class Check( object ):
        pass
    m			= Mod()
    m.check		= Check()
    data		= {
        "Mod": m
    }
    ctx			= Populater( data )
    ctx.save("Mod.check.chin", max)
    
    assert ctx("< Mod.check.chin(1,2,3)") == 3
