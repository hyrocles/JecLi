examplePlugin2 = function(){

	/* - description - */
	var description = {
		Title 		: "examplePlugin2",
		Version		: "0.1",
		Autor		: "Tobias Schmalenberg",
		
		dependence	: "examplePlugin1",
		useTemplate	: false
	}
	
	/* PRIVATE */
	
	/* - private - vars */
	
	/* - private - methodes */
	
	var setOnClick = function(object_o){
		object_o.onclick = function(){
			alert(JecLi.examplePlugin1.onInclude());
		}
	}
	
	/* PUBLIC */
	return {
		onLoad			: function(){
			return description.Title + ' -> onLoad';
		},
		
		onInclude		: function(object_o){
			setOnClick(object_o);
			return description.Title + ' -> onInclude';
		},
		
		getDescription	: function(){
			return description;
		}
	};
}();