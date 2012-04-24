examplePlugin1 = function(){
	
	/* File import */
	@jecLi:import = bin/test1.js;
	
	/* - description - */
	var description = {
		Title 		: "examplePlugin1",
		Version		: "0.1",
		Autor		: "Tobias Schmalenberg",
		
		dependence	: false,
		useTemplate	: false
	}	
	
	/* PRIVATE */
	
	/* - private - vars */
	
	/* - private - methodes */
	
	/* PUBLIC */
	return {
		onLoad			: function(){
			return description.Title + ' -> onLoad';
		},
		
		onInclude		: function(object_o){
			return description.Title + ' -> onInclude';
		},
		
		onComplete		: function(){
			msg('onComplete > examplePlugin1');
		},
		
		getDescription	: function(){
			return description;
		}
	};
}();