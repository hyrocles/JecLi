/**
* @author 	tobias schmalenberg <team@jecedelic-software.de>
*/


(JecLi = function(){
	try{
		/**
		* register private Vars
		*/
		var jl_baseURL			/*:String */ = '';
		var jl_systemPath		/*:String */ = 'controller/jecLi.js';
		var jl_defaultPluginList	/*:String */ = 'controller/PluginList.json';
		
		var jl_fileRequester		/*:Object */ = new Object();
		var jl_pluginList		/*:Object */ = new Object();
		
		var jl_serialization		/*:Boolean*/ = true;
		
		
		/**
		* Sets all extern and intern closures until DOM is loaded
		* @access	private
		* @see		jl_createFileRequester(), jl_createPluginList(), jl_setBaseUrl(), jl_setOnLoad()
		*/
		var jl_init = function(){
			JecLi = window.JecLi || {};
			jl_setOnLoad();
			jl_createFileRequester();
			jl_setBaseUrl();
			jl_createPluginList();
		}
		
		/**
		* set or rewrite the "window.onload"-Event ... (!!! yet it is an experiment !!!).
		* <body onload="..."> or any later window.onload break this part but you can use JecLi.crawlContent(rootNode:DOMNode);
		* @access	private
		*/
		var jl_setOnLoad = function(){
			var tempOnLoad	=	window.onload;
			if(!tempOnLoad){
				window.onload = function(){
					JecLi.onLoad();
				}
			}else{
				window.onload = function(){
					JecLi.onLoad();
					tempOnLoad();
				}
			}
		}
		
		/**
		* created an Ajax Filerequester and provides this internally available
		* @access	private
		*/
		var jl_createFileRequester = function(){
			if(!location.protocol ==="file:"){
				if(window.XMLHttpRequest){
					jl_fileRequester = new XMLHttpRequest;
					return;
				}
			}
			if(window.ActiveXObject){
				try{
					jl_fileRequester = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){
					jl_fileRequester = new ActiveXObject("Msxml2.XMLHTTP");
				}
			}else if(window.XMLHttpRequest){
				jl_fileRequester = new XMLHttpRequest;
			}else{
				jl_fileRequester = false;
			}
		}
		
		/**
		* check and load preferences for serialization.
		* @access	private
		*/
		var jl_getPrefs = function(){
			var jl_tempPref 		/*:String */ = '';
			var jl_tempPrefArray		/*:Array  */ = new Array();
			
			if(document.cookie && jl_serialization){
				try{
					jl_tempPref = document.cookie;
					jl_tempPrefArray = jl_tempPref.split('=');
					if(jl_tempPrefArray[0] == 'jl_prefValue'){
						return jl_tempPrefArray[1];
					}
				}catch(e){
					/* ERRORCODE - jl_getPrefs damaged */
					return false;
				}
			}
			return false;
		}
		
		/**
		* save preferences for serialization.
		* @access	private
		*/
		var jl_setPrefs = function(jl_prefValue/*:String */){
			if(jl_prefValue && jl_serialization){
				var jl_newPref 		= new Function("", "try{jl_str='jl_prefValue="+escape(jl_prefValue)+"';return jl_str;}catch(e){return false;}");
				var jl_newPrefSize 	= jl_newPref().length * 2;
				
				if(jl_newPrefSize < 3500){
					document.cookie = jl_newPref();
					return true;
				}
			}
		}
		
		/**
		* creates a list of all available plugins and provide this list available internally
		* @access	private
		* @param 	string 	jl_filePath
		* @see		jl_getFile(), jl_setPrefs(), jl_getPrefs()
		*/
		var jl_createPluginList = function(jl_filePath/*:String */){
			var PluginListFile		/*:String */ = '';
			
			if(!jl_filePath){
				jl_filePath = jl_defaultPluginList;
			}
			
			PluginListFile = unescape(jl_getPrefs());
			if(PluginListFile == "false"){
				if(PluginListFile = jl_getFile(jl_baseURL+jl_filePath)){
					jl_setPrefs(PluginListFile);
				}
			}
			
			if(PluginListFile){
				/**
				* PluginList Template Object
				*/
				var jl_Plugin = function(jl_pluginPath/*:String */, jl_pluginName/*:String */){
					this.realName	= jl_pluginName;
					this.path 		= jl_pluginPath;
					this.loaded 	= false;
					this.loadingErr = false;
					this.template	= false;
				}
				
				try{
					eval('var PluginList = '+PluginListFile);
					for(var x in PluginList){
						jl_pluginList[x.toLowerCase()] = new jl_Plugin(PluginList[x], x);
					}
				}catch(e){
					/* ERRORCODE - jl_filePath damaged */
				}
			}else{
				/* ERRORCODE - can't load jl_filePath */
			}
		}
		
		/**
		* This Methode load all Files sync. and via POST
		* @access	private
		* @param 	string 	jl_filePath
		* @return	string or false
		*/
		var jl_getFile = function(jl_filePath/*:String */){
			if(jl_filePath){
				try{
					jl_fileRequester.open('POST', jl_filePath, false);
					jl_fileRequester.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					jl_fileRequester.send(null);
					return jl_fileRequester.responseText;
				}catch(e){
					return false;
				}
			}else{
				return false;
			}
		}
		
		/**
		* start the Pluginsearch and -integration
		* @access	private
		* @see		jl_setBaseUrl(), jl_crawlDOM()
		*/
		var load = function(){
			if(jl_setBaseUrl()){
				jl_crawlDOM(document.getElementsByTagName('body')[0]);
			}
			return true;
		}
		
		/**
		* determines the src address from the DOM script include tag JecLi
		* @access	private
		*/
		var jl_setBaseUrl = function(){
			if(jl_baseURL == ""){
				var jl_Head		/*:Array  */ = [];
				var jl_HeadLenght	/*:Integer*/ = 0;
				var jl_Path		/*:String */ = '';
				
				jl_Head = document.getElementsByTagName('head');
				jl_Head = jl_Head[0];
				jl_HeadLenght = jl_Head.childNodes.length;
				
				for(var x=jl_HeadLenght; x--;){
					if(jl_Head.childNodes[x].src){
						jl_Path = jl_Head.childNodes[x].src;
						if(jl_Path.indexOf(jl_systemPath) != -1){
							jl_baseURL = jl_Path.replace(jl_systemPath,'');
							return true;
						}
					}
				}
			}else{
				return true;
			}
		}
		
		/**
		* search the DOM tree for nodes with the attribute plugin and passes it on
		* @access	private
		* @see		jl_loadPlugin()
		*/
		var jl_crawlDOM = function(jl_rootNode/*:DOMNode*/){
			var jl_htmlCollection	/*:HTMLCollection*/ = jl_rootNode.all ? jl_rootNode.all : jl_rootNode.getElementsByTagName('*');
			var i				/*:Integer*/ 		= jl_htmlCollection.length;
			
			while(i --> 0) {
				var jl_pluginName	/*:String */ 		= jl_htmlCollection[i].getAttribute('plugin');
				if(typeof jl_pluginName !== 'string'){
					continue;
				}
				jl_loadPlugin(jl_pluginName, jl_htmlCollection[i]);
			}
		}
		
		/**
		* checks the validity of the plugins and whether this has already been loaded.
		* It should not be charged this will be done.
		* Then a check is made to dependencies of templates or other plugins.
		* @access	private
		* @see		jl_getFile()
		*/
		var jl_loadPlugin = function(jl_pluginName/*:String*/, jl_rootNode/*:DOMNode*/){
			var jl_docHead			/*:DOMNode*/ = document.getElementsByTagName('head')[0];
			var jl_pluginCss		/*:String */ = '';
			var jl_pluginName		/*:String */ = jl_pluginName.toLowerCase();
			
			if(jl_pluginList[jl_pluginName] && jl_pluginList[jl_pluginName].loadingErr == false){
				var PLUGIN 			/*:Object */ = jl_pluginList[jl_pluginName];
				if(!PLUGIN.loaded){
					var tempPlugin = jl_getFile(jl_baseURL+'model/'+PLUGIN.path);
					if(tempPlugin){
						var tempPlugin = new Function("", "try{return "+tempPlugin+";}catch(e){return false;}");
						JecLi[PLUGIN.realName] = tempPlugin();
						if(JecLi[PLUGIN.realName].onLoad()){
							jl_pluginList[jl_pluginName].loaded = true;
							
							/**
							* check Plugin use Template and load it ondemand
							*/
							if(JecLi[PLUGIN.realName].getDescription().useTemplate){
								jl_pluginCss = document.createElement('link');
								jl_pluginCss.setAttribute('rel','stylesheet');
								jl_pluginCss.setAttribute('href', jl_baseURL+'view/'+PLUGIN.path.replace('.js','.css'));
								jl_docHead.insertBefore(jl_pluginCss, jl_docHead.firstChild);
							}
							
							/**
							* ToDo:
							* implementation XUL/HTML Template
							*/
							
							/**
							* check Plugin for dependence
							*/
							if(JecLi[PLUGIN.realName].getDescription().dependence){
								var jl_tempDepArray		/*:Array  */ = JecLi[PLUGIN.realName].getDescription().dependence.split(',');
								var jl_tempDepArray_len	/*:Integer*/ = jl_tempDepArray.length;
								for(var x=jl_tempDepArray_len; x--;){
									if(!jl_loadPlugin(jl_tempDepArray[x].replace(/ /gi,''))){
										jl_pluginList[jl_pluginName].loadingErr = true;
										return false;
									}
								}
							}
						}else{
							jl_pluginList[jl_pluginName].loadingErr = true;
							return false;
						}
						
						try{
							delete window[PLUGIN.realName];
						}catch(e/*:ErrorObject*/){
							window[PLUGIN.realName] = null;
						}
					}
				}
				if(jl_rootNode){
					JecLi[PLUGIN.realName].onInclude(jl_rootNode);
				}
				return true;
			}else{
				return false;
			}
			return true;
		}
		
		return{
			onInclude	: function(){
				jl_init();
			},
			
			addPlugin	: function(pluginName/*:String*/, rootNode/*:DOMNode*/){
				if(pluginName){
					if(!rootNode){
						rootNode = false;
					}
					return jl_loadPlugin(pluginName/*:String*/, rootNode/*:DOMNode*/);
				}else{
					return false;
				}
			},
			
			crawlContent	: function(rootNode/*:DOMNode*/){
				if(rootNode){
					jl_crawlDOM(rootNode);
					return true;
				}else{
					return false;
				}
			},
			
			onLoad		: function(){
				return load();
			}
		};
	}catch(e){
		return false;
	}
}()).onInclude();