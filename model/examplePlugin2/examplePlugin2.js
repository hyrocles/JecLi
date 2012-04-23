examplePlugin2 = function(){

	/* - description - */
	var description = {
		Title 		: "examplePlugin2",
		Version		: "0.1",
		Autor		: "Tobias Schmalenberg",
		
		dependence	: "examplePlugin1",
		useTemplate	: true
	}
	
	/* PRIVATE */
	
	/* - private - vars */
	
	/* - private - methodes */
	var addButton = function(object_o){
		var _button = document.createElement('button');
		_button.appendChild(document.createTextNode('include examplePlugin1'));
		
		_button.onclick = function(){
			alert(JecLi.examplePlugin1.onInclude());
		}
		
		object_o.appendChild(_button);
		object_o.className = description.Title;
	}
	
	/* PUBLIC */
	return {
		onLoad			: function(){
			return description.Title + ' -> onLoad';
		},
		
		onInclude		: function(object_o){
			addButton(object_o);
			return description.Title + ' -> onInclude';
		},
		
		onComplete		: function(){
			alert('onComplete > examplePlugin2');
		},
		
		getDescription	: function(){
			return description;
		}
	};
}();