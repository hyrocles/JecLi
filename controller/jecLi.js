/**
* @author     tobias schmalenberg <team@jecedelic-software.de>
*/


(JecLi = function(){
    try{
        /**
        * register private Vars
        */
        var jl_baseURL              /*:String */ = '';
        var jl_systemPath           /*:String */ = 'controller/jecLi.js';
        var jl_defaultPluginList    /*:String */ = 'controller/PluginList.json';
        
        var jl_fileRequester        /*:Object */ = new Object();
        var jl_pluginList           /*:Object */ = new Object();
        
        var jl_serialization        /*:Boolean*/ = true;
        var jl_allowPBSyntax        /*:Boolean*/ = true;
        
        var jl_msgQuee				/*:Array  */ = new Array();
		
		
        /**
        * Sets all extern and intern closures until DOM is loaded
        * @access    private
        * @see       jl_createFileRequester(), jl_createPluginList(), jl_setBaseUrl(), jl_setOnLoad()
        */
        var jl_init = function(){
			try{
				JecLi = window.JecLi || {};
				jl_createFileRequester();
				jl_setBaseUrl();
				if(!jl_createPluginList()){
					return false;
				}
				jl_setOnLoad();
				return true;
			}catch(e){
				jl_msgQuee.push(new jl_errorObj('#02','jl_init',e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
        }
        
        /**
        * set or rewrite the "window.onload"-Event ... (!!! yet it is an experiment !!!).
        * <body onload="..."> or any later window.onload break this part but you can use JecLi.crawlContent(rootNode:DOMNode);
        * @access    private
        */
        var jl_setOnLoad = function(){
			try{
				var tempOnLoad    =    window.onload;
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
			}catch(e){
				jl_msgQuee.push(new jl_errorObj('#03','jl_setOnLoad',e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
        }
        
        /**
        * created an Ajax Filerequester and provides this internally available
        * @access    private
        */
        var jl_createFileRequester = function(){
			try{
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
			}catch(e){
				jl_msgQuee.push(new jl_errorObj('#04','jl_createFileRequester',e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
        }
        
        /**
        * check and load preferences for serialization.
        * @access    private
        */
        var jl_getPrefs = function(){
			try{
				var jl_tempPref         /*:String */ = '';
				var jl_tempPrefArray    /*:Array  */ = new Array();
				
				if(document.cookie && jl_serialization){
					try{
						jl_tempPref = document.cookie;
						jl_tempPrefArray = jl_tempPref.split('=');
						if(jl_tempPrefArray[0] == 'jl_prefValue'){
							return jl_tempPrefArray[1];
						}
					}catch(e){
						/* ERRORCODE - #051 */
						jl_msgQuee.push(new jl_errorObj('#051','document.cookie',e));
						JecLi.onError(jl_msgQuee);
						return false;
					}
				}
				return false;
			}catch(e){
				/* ERRORCODE - #05 */
				jl_msgQuee.push(new jl_errorObj('#05','jl_getPrefs',e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
        }
        
        /**
        * save preferences for serialization.
        * @access    private
        */
        var jl_setPrefs = function(jl_prefValue/*:String */){
			try{
				if(jl_prefValue && jl_serialization){
					var jl_newPref         = new Function("", "try{jl_str='jl_prefValue="+escape(jl_prefValue)+"';return jl_str;}catch(e){return false;}");
					var jl_newPrefSize     = jl_newPref().length * 2;
					
					if(jl_newPrefSize < 3500){
						document.cookie = jl_newPref();
						return true;
					}else{
						return false;
					}
				}
			}catch(e){
				/* ERRORCODE - #06 */
				jl_msgQuee.push(new jl_errorObj('#06','jl_setPrefs',e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
        }
        
        /**
        * creates a list of all available plugins and provide this list available internally
        * @access    private
        * @param     string     jl_filePath
        * @see       jl_getFile(), jl_setPrefs(), jl_getPrefs()
        */
        var jl_createPluginList = function(jl_filePath/*:String */){
			try{
				var PluginListFile        /*:String */ = '';
				
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
						this.realName   = jl_pluginName;
						this.path       = jl_pluginPath;
						this.loaded     = false;
						this.loadingErr = false;
						this.template   = false;
					}
					
					try{
						eval('var PluginList = '+PluginListFile);
						for(var x in PluginList){
							jl_pluginList[x.toLowerCase()] = new jl_Plugin(PluginList[x], x);
						}
						return true;
					}catch(e){
						/* ERRORCODE - #071 */
						jl_msgQuee.push(new jl_errorObj('#071','Error in PluginListFile',e));
						JecLi.onError(jl_msgQuee);
						return false;
					}
				}else{
					/* ERRORCODE - #072 */
					jl_msgQuee.push(new jl_errorObj('#072','if(PluginListFile)','cant load PluginListFile'));
					JecLi.onError(jl_msgQuee);
					return false;
				}
			}catch(e){
				/* ERRORCODE - #07 */
				jl_msgQuee.push(new jl_errorObj('#07','jl_createPluginList',e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
        }
        
        /**
        * This Methode load all Files sync. and via POST
        * @access    private
        * @param     string     jl_filePath
        * @return    string or false
        */
        var jl_getFile = function(jl_filePath/*:String */){
            if(jl_filePath){
                try{
                    jl_fileRequester.open('POST', jl_filePath, false);
                    jl_fileRequester.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    jl_fileRequester.send(null);
                    return jl_fileRequester.responseText;
                }catch(e){
					/* ERRORCODE - #082 */
					jl_msgQuee.push(new jl_errorObj('#082','jl_fileRequester.open()',e));
					JecLi.onError(jl_msgQuee);
                    return false;
                }
            }else{
				/* ERRORCODE - #081 */
				jl_msgQuee.push(new jl_errorObj('#081','if(jl_filePath)','cant load jl_filePath'));
				JecLi.onError(jl_msgQuee);
                return false;
            }
        }
        
        /**
        * start the Pluginsearch and -integration
        * @access    private
        * @see       jl_setBaseUrl(), jl_crawlDOM()
        */
        var jl_load = function(){
            if(jl_setBaseUrl()){
                jl_crawlDOM(document.getElementsByTagName('body')[0]);
            }
            return true;
        }
        
        /**
        * determines the src address from the DOM script include tag JecLi
        * @access    private
        */
        var jl_setBaseUrl = function(){
            if(jl_baseURL == ""){
                var jl_Head          /*:Array  */ = [];
                var jl_HeadLenght    /*:Integer*/ = 0;
                var jl_Path          /*:String */ = '';
                
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
        * @access    private
        * @see       jl_loadPlugin(), jl_onComplete()
        */
        var jl_crawlDOM = function(jl_rootNode/*:DOMNode*/){
			try{
				var jl_htmlCollection    /*:HTMLCollection*/ = jl_rootNode.all ? jl_rootNode.all : jl_rootNode.getElementsByTagName('*');
				var i                    /*:Integer*/        = jl_htmlCollection.length;
				
				while(i --> 0) {
					var jl_pluginName    /*:String */        = jl_htmlCollection[i].getAttribute('plugin');
					if(jl_htmlCollection[i].tagName.search(/jecli.+/i) == -1){
						if(typeof jl_pluginName !== 'string'){
							continue;
						}
						continue;
					}else{
						jl_pluginName = jl_htmlCollection[i].tagName.replace(/jecli:/i,'');
					}
					jl_loadPlugin(jl_pluginName, jl_htmlCollection[i]);
				}
				jl_onComplete();
			}catch(e){
				/* ERRORCODE - #09 */
				jl_msgQuee.push(new jl_errorObj('#09','jl_crawlDOM',e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
        }
        
        /**
        * checks the validity of the plugins and whether this has already been loaded.
        * It should not be charged this will be done.
        * Then a check is made to dependencies of templates or other plugins.
        * @access    private
        * @see       jl_getFile()
        */
        var jl_loadPlugin = function(jl_pluginName/*:String*/, jl_rootNode/*:DOMNode*/){
			try{
				var jl_docHead          /*:DOMNode*/ = document.getElementsByTagName('head')[0];
				var jl_pluginCss        /*:String */ = '';
				var jl_pluginName       /*:String */ = jl_pluginName.toLowerCase();
				
				if(jl_pluginList[jl_pluginName] && jl_pluginList[jl_pluginName].loadingErr == false){
					var PLUGIN          /*:Object */ = jl_pluginList[jl_pluginName];
					if(!PLUGIN.loaded){
						var tempPlugin = jl_getFile(jl_baseURL+'model/'+PLUGIN.path);
						if(tempPlugin){
							tempPlugin = jl_pbObj.jl_search(tempPlugin, PLUGIN);
							var tempPlugin = new Function("", "try{return "+tempPlugin+";}catch(e){return false;}");
							JecLi[PLUGIN.realName] = tempPlugin();
							if(jl_callPlugin(PLUGIN.realName, "onLoad")){
								jl_pluginList[jl_pluginName].loaded = true;
								
								/**
								* check Plugin use Template and load it ondemand
								*/
								if(jl_callPlugin(PLUGIN.realName, "getDescription").useTemplate){
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
								if(jl_callPlugin(PLUGIN.realName, "getDescription").dependence){
									var jl_tempDepArray        /*:Array  */ = jl_callPlugin(PLUGIN.realName, "getDescription").dependence.split(',');
									var jl_tempDepArray_len    /*:Integer*/ = jl_tempDepArray.length;
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
						jl_callPlugin(PLUGIN.realName, "onInclude", jl_rootNode);
					}
					return true;
				}else{
					/* ERRORCODE - #101 */
					jl_msgQuee.push(new jl_errorObj('#101',jl_pluginName,'cant load Plugin '+jl_pluginName));
					JecLi.onError(jl_msgQuee);
					return false;
				}
				return true;
			}catch(e){
				/* ERRORCODE - #10 */
				jl_pluginList[jl_pluginName].loadingErr = true;
				jl_msgQuee.push(new jl_errorObj('#10',jl_pluginName,e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
        }
        
        /**
        * calling the onComplete() Method of all included Plugins.
        * this is the final Methode after all bindings.
        * @access    private
        */
        var jl_onComplete = function(){
            for(x in jl_pluginList){
                if(jl_pluginList[x].loaded == true){
					var PLUGIN           /*:Object */ = jl_pluginList[x];
				
                    try{
						jl_callPlugin(PLUGIN.realName, "onComplete");
                    }catch(e/*:ErrorObject*/){
                        /* ERRORCODE - #11 */ 
						jl_msgQuee.push(new jl_errorObj('#11','jl_onComplete','Plugin no onComplete'));
						JecLi.onError(jl_msgQuee);
                    }
                }
            }
        }
        
        /**
        * Calls as the only method in all JecLi plugin methods.
        * @access    private
        */
		var jl_callPlugin = function(jl_pluginName/*:String*/, jl_pluginFunction/*:String*/, jl_pluginFunctionArgs/*:undefined*/){
			try{
				if(jl_pluginFunction && jl_pluginName){
					if(!jl_pluginFunctionArgs){
						var jl_pluginFunctionArgs = '';
					}
					
					switch(jl_pluginFunction){
						case 'onComplete':
						case 'onInclude':
						case 'onLoad':
						case 'getDescription':
							return JecLi[jl_pluginName][jl_pluginFunction](jl_pluginFunctionArgs);
						default:
							return false;
					}
				}
			}catch(e){
				/* ERRORCODE - #12 */
				jl_msgQuee.push(new jl_errorObj('#12',jl_pluginName+'.'+jl_pluginFunction,e));
				JecLi.onError(jl_msgQuee);
				return false;
			}
		}
		
        /**
        * Allow to use PBSyntax in Plugins [experiment!]
        * @access    private
        */
		var jl_pbObj = {
			jl_search : function(pluginCode, pluginObj){
				var pb_pattern = /@jecLi:[^]*?(;)/gm
				var pb_codeSnips = pluginCode.match(pb_pattern);
				
				if(pb_codeSnips && jl_allowPBSyntax){
					for(var x in pb_codeSnips){
						var tempSnipe = pb_codeSnips[x].replace(/@jecLi:/gi,'').replace(/ /gi,'').replace(/;/gi,'');
						var tempSnipe = tempSnipe.split('=');
						
						switch(tempSnipe[0]){
							case 'import':
								var tempSnipe_new = jl_getFile(jl_baseURL+'model/'+pluginObj.realName+'/'+tempSnipe[1]);
								if(!tempSnipe_new){
									tempSnipe_new = '';
								}
								pluginCode = pluginCode.replace(new RegExp(pb_codeSnips[x],"gi"), tempSnipe_new);
							
							default:
								pluginCode = pluginCode.replace(new RegExp(pb_codeSnips[x],"gi"), '');
						}
					}
				}
				if(!jl_allowPBSyntax){
					for(var x in pb_codeSnips){
						pluginCode = pluginCode.replace(new RegExp(pb_codeSnips[x],"gi"), '');
					}
				}
				return pluginCode;
			}
		}
		
        /**
        * ErrorQuee Object
        * @access    private
        */
		var jl_errorObj = function(jl_eObjCode/*:String */,jl_eObjCall/*:String */,jl_eObjMsg/*:String */){
			this.eObjCode	= jl_eObjCode;
			this.eObjCall	= jl_eObjCall;
			this.eObjMsg	= jl_eObjMsg;
		}
		
        /**
        * register public Functions
        */
        return{    
            addPlugin    : function(pluginName/*:String*/, rootNode/*:DOMNode*/){
                if(pluginName){
                    if(!rootNode){
                        rootNode = false;
                    }
                    return jl_loadPlugin(pluginName/*:String*/, rootNode/*:DOMNode*/);
                }else{
                    return false;
                }
            },
            
            crawlContent    : function(rootNode/*:DOMNode*/){
                if(rootNode){
                    jl_crawlDOM(rootNode);
                    return true;
                }else{
                    return false;
                }
            },
            
			onError      : function(jl_msgQuee/*:Array*/){
				if(jl_msgQuee){
					alert(jl_msgQuee[jl_msgQuee.length-1].eObjCode+' : '+jl_msgQuee[jl_msgQuee.length-1].eObjMsg);
				}
			},
			
            onInclude    : function(){
                if(!jl_init()){
					JecLi = false;
				}
            },
        
            onLoad        : function(){
                return jl_load();
            }
        };
    }catch(e){
		document.write('JecLi - Error :<br/>'+e);
        return false;
    }
}()).onInclude();