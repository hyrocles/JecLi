/**
* @author 	tobias schmalenberg <team@jecedelic-software.de>
*/


(JecLi = function(){
	try{
		/**
		* register private Vars
		*/
		var jl_baseURL			/*:String */ = '';
		var jl_systemPath		/*:String */ = 'jecLi_preAlpha.js';
		var jl_defaultPluginList	/*:String */ = 'controller/PluginList.dat';
		
		var jl_fileRequester		/*:Object */ = new Object();
		var jl_pluginList		/*:Object */ = new Object();
		
		
		/**
		* Sets all extern and intern closures until DOM is loaded
		* @access	private
		* @see		jl_createFileRequester(), jl_createPluginList(), jl_setBaseUrl()
		*/
		var jl_init = function(){
			JecLi = window.JecLi || {};
			jl_setBaseUrl()
			jl_createFileRequester();
			jl_createPluginList();
		}
		
		/**
		* created an Ajax Filerequester and provides this internally available
		* @access	private
		*/
		var jl_createFileRequester = function(){
			if(window.ActiveXObject){
				try{
					jl_fileRequester = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){
					jl_fileRequester = new ActiveXObject("Msxml2.XMLHTTP");
				}
			}else if(window.XMLHttpRequest){
				jl_fileRequester = new XMLHttpRequest();
			}else{
				jl_fileRequester = false;
			}
		}
		
		/**
		* creates a list of all available plugins and provide this list available internally
		* @access	private
		* @param 	string 	jl_filePath
		* @see		jl_getFile()
		*/
		var jl_createPluginList = function(jl_filePath/*:String */){
			var PluginListFile		/*:String */ = '';
			
			if(!jl_filePath){
				jl_filePath = jl_defaultPluginList;
			}
			
			if(PluginListFile = jl_getFile(jl_baseURL+jl_filePath)){
				
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
					eval('var '+PluginListFile);
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
					return jl_fileRequester.responseText;;
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
							if(JecLi[PLUGIN.realName].getDescription().useTemplate){
								jl_pluginCss = document.createElement('link');
								jl_pluginCss.setAttribute('rel','stylesheet');
								jl_pluginCss.setAttribute('href', jl_baseURL+'view/'+PLUGIN.path.replace('.js','.css'));
								jl_docHead.insertBefore(jl_pluginCss, jl_docHead.firstChild);
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
			
			onLoad		: function(){
				return load();
			}
		};
	}catch(e){
		return false;
	}
}()).onInclude();