preAlpha = function(){

	/* - description - */
	var description = {
		Title 		: "preAlpha",
		Version		: "0.2",
		Date		: "26.02.2009",
		
		Autor		: "Tobias Schmalenberg",
		URI			: "http://jecli.jecedelic-software.de",
		
		dependence	: 'preAlpha',
		useTemplate	: false
	}
	
	/* PRIVATE */
	
	/* - private - vars */
	
	
	/* - private - methodes */
	var dragHandler = function(e){
		if (e == null) { e = window.event;} 
		var target = e.target != null ? e.target : e.srcElement;
		if(target.getAttribute('plugin') == 'preAlpha'){
			target.dragOK=true;
			target.dragXoffset=e.clientX-parseInt(setup(target).left);
			target.dragYoffset=e.clientY-parseInt(setup(target).top);
			

			target.style.left=e.clientX-target.dragXoffset+'px';
			target.style.top=e.clientY-target.dragYoffset+'px';
			if(target.getAttribute('copy') == 'true'){
				copy = target.cloneNode(true);
				
				target.style.position = "absolute";
				target.style.left=e.clientX-target.dragXoffset+'px';
				target.style.top=e.clientY-target.dragYoffset+'px';
				
				target.parentNode.insertBefore(copy, target);
				target.setAttribute('copy','false');
			}

			target.style.position = "absolute";
			
			
			document.onmousemove=moveHandler;
			document.onmouseup=cleanup;
			return false;
		}
	}
	
	var moveHandler = function(e){
		if (e == null) { e = window.event }
		var target = e.target != null ? e.target : e.srcElement;
		if (e.button<=1&&target.dragOK){
			target.style.position = "absolute";
			target.style.left=e.clientX-target.dragXoffset+'px';
			target.style.top=e.clientY-target.dragYoffset+'px';
			
			target.setAttribute('title','Left:'+target.style.left+' - Top:'+target.style.top);
			return false;
		}
	}
	
	var cleanup = function(e){
		if (e == null) { e = window.event;} 
		var target = e.target != null ? e.target : e.srcElement;
		document.onmousemove=null;
		document.onmouseup=null;
		if(target.getAttribute('plugin') == 'preAlpha'){
			target.dragOK = false;
			document.getElementsByTagName('body')[0].appendChild(target);
			JecLi.preAlpha.onDrop(target);
		}
	}
	
	var setup = function(obj){
		var pos = {left:0, top:0};
		if(typeof obj.offsetLeft != 'undefined')
		{
		   while (obj)
		   {
			   pos.left += obj.offsetLeft;
			   pos.top += obj.offsetTop;
			   obj = obj.offsetParent;
		   }
		}
		else
		{
		   pos.left = obj.left ;
		   pos.top = obj.top ;
		}
		return pos;
	}
	/* PUBLIC */
	return {
		onLoad			: function(){
			document.onmousedown=dragHandler;
			return true;
		},
		
		onInclude		: function(object_o){
			try{
				return true;
			}catch(e){
				return false;
			}
		},
		
		onDrop			: function(object_o){
			return true;
		},
		
		getPosition		: function(object_o){
			return setup(object_o);
		},
		
		onRelease		: function(){
			return true;
		},
		
		getDescription	: function(){
			return description;
		}
	};
}();