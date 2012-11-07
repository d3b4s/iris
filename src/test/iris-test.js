test( "Iris lang load", function() {

	iris.lang.Load("es-ES", {TEST:{LABEL:"VALUE"}});

	var translated = iris.lang.Get("TEST.LABEL");
	strictEqual( translated, "VALUE", "Should get a lang value" );

	iris.lang.Locale("en-US");
	translated = iris.lang.Get("TEST.LABEL");
	strictEqual( translated, "??TEST.LABEL??", "Should get a non created value" );

});

test( "Iris date format", function() {

	var date = "1331954654564";
	var formatted = iris.util.DateFormat(date, "d/m/y h:i:s");
  	strictEqual( formatted, "17/03/12 04:24:14", "Custom DateFormat" );
});

test( "Iris currency format", function() {

  	var amount = 1234.56;
  	iris.lang.Locale("es-ES");
  	formatted = iris.util.Currency(amount);
  	strictEqual( formatted, "1.234,56", "Currency Spanish Format" );
  	

  	iris.lang.Locale("en-US");
  	formatted = iris.util.Currency(amount);
  	strictEqual( formatted, "1,234.56", "Currency USA Format" );

});