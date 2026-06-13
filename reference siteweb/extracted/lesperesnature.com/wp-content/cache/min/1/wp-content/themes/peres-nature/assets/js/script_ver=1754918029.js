window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var newarr=[].slice.call(arguments);(typeof console.log==='object'?log.apply.call(console.log,console,newarr):console.log.apply(console,newarr))}};(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console}catch(err){return window.console={}}})());var DOM=window.DOM||{};DOM.Methods={};DOM.LoadMethod=function(context){if(context===undefined){context=$(document)}
context.find('*[data-method]').each(function(){var that=$(this),methods=that.attr('data-method');$.each(methods.split(" "),function(index,methodName){try{var MethodClass=DOM.Methods[methodName],initializedMethod=new MethodClass(that)}catch(e){}})})};DOM.onReady=function(){DOM.LoadMethod();$('html').removeClass('no-js').addClass('js')};$(document).ready(function(){DOM.onReady()});(function(window,document){'use strict';var supportsObjectFit=function(){var testElem=document.createElement('div').style;if('object-fit' in testElem||'-o-object-fit' in testElem){return!0}
return!1};if(!1===supportsObjectFit()){var images=document.getElementsByClassName('obj-fit-cover'),images_length=images.length,image_cur_src,image_classes,i=0;for(i;i<images_length;i++){if('currentSrc' in images[i]){image_cur_src=images[i].currentSrc;if(''===image_cur_src){image_cur_src=images[i].src}}else{image_cur_src=images[i].src}
image_classes=images[i].className;var shim_wrapper=document.createElement('div');shim_wrapper.className=image_classes;shim_wrapper.style.background='url('+image_cur_src+') center center / cover no-repeat';var shim_img=document.createElement('img');shim_img.src=image_cur_src;shim_img.style.cssText='display: block; width: 100%; height: 100%; visibility: hidden!important; opacity: 0!important;';shim_wrapper.appendChild(shim_img);images[i].parentNode.replaceChild(shim_wrapper,images[i]);shim_wrapper=null;shim_img=null}
images=null}})(window,document);(function(){var defaultOptions={frameRate:150,animationTime:700,stepSize:100,pulseAlgorithm:!0,pulseScale:4,pulseNormalize:1,accelerationDelta:50,accelerationMax:3,keyboardSupport:!0,arrowScroll:50,fixedBackground:!0,excluded:''};var options=defaultOptions;var isExcluded=!1;var isFrame=!1;var direction={x:0,y:0};var initDone=!1;var root=document.documentElement;var activeElement;var observer;var refreshSize;var deltaBuffer=[];var deltaBufferTimer;var isMac=/^Mac/.test(navigator.platform);var key={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36};var arrowKeys={37:1,38:1,39:1,40:1};function initTest(){if(options.keyboardSupport){addEvent('keydown',keydown)}}
function init(){if(initDone||!document.body)return;initDone=!0;var body=document.body;var html=document.documentElement;var windowHeight=window.innerHeight;var scrollHeight=body.scrollHeight;root=(document.compatMode.indexOf('CSS')>=0)?html:body;activeElement=body;initTest();if(top!=self){isFrame=!0}else if(isOldSafari&&scrollHeight>windowHeight&&(body.offsetHeight<=windowHeight||html.offsetHeight<=windowHeight)){var fullPageElem=document.createElement('div');fullPageElem.style.cssText='position:absolute; z-index:-10000; '+'top:0; left:0; right:0; height:'+root.scrollHeight+'px';document.body.appendChild(fullPageElem);var pendingRefresh;refreshSize=function(){if(pendingRefresh)return;pendingRefresh=setTimeout(function(){if(isExcluded)return;fullPageElem.style.height='0';fullPageElem.style.height=root.scrollHeight+'px';pendingRefresh=null},500)};setTimeout(refreshSize,10);addEvent('resize',refreshSize);var config={attributes:!0,childList:!0,characterData:!1};observer=new MutationObserver(refreshSize);observer.observe(body,config);if(root.offsetHeight<=windowHeight){var clearfix=document.createElement('div');clearfix.style.clear='both';body.appendChild(clearfix)}}
if(!options.fixedBackground&&!isExcluded){body.style.backgroundAttachment='scroll';html.style.backgroundAttachment='scroll'}}
function cleanup(){observer&&observer.disconnect();removeEvent(wheelEvent,wheel);removeEvent('mousedown',mousedown);removeEvent('keydown',keydown);removeEvent('resize',refreshSize);removeEvent('load',init)}
var que=[];var pending=!1;var lastScroll=Date.now();function scrollArray(elem,left,top){directionCheck(left,top);if(options.accelerationMax!=1){var now=Date.now();var elapsed=now-lastScroll;if(elapsed<options.accelerationDelta){var factor=(1+(50/elapsed))/2;if(factor>1){factor=Math.min(factor,options.accelerationMax);left*=factor;top*=factor}}
lastScroll=Date.now()}
que.push({x:left,y:top,lastX:(left<0)?0.99:-0.99,lastY:(top<0)?0.99:-0.99,start:Date.now()});if(pending){return}
var scrollRoot=getScrollRoot();var isWindowScroll=(elem===scrollRoot||elem===document.body);if(elem.$scrollBehavior==null&&isScrollBehaviorSmooth(elem)){elem.$scrollBehavior=elem.style.scrollBehavior;elem.style.scrollBehavior='auto'}
var step=function(time){var now=Date.now();var scrollX=0;var scrollY=0;for(var i=0;i<que.length;i++){var item=que[i];var elapsed=now-item.start;var finished=(elapsed>=options.animationTime);var position=(finished)?1:elapsed/options.animationTime;if(options.pulseAlgorithm){position=pulse(position)}
var x=(item.x*position-item.lastX)>>0;var y=(item.y*position-item.lastY)>>0;scrollX+=x;scrollY+=y;item.lastX+=x;item.lastY+=y;if(finished){que.splice(i,1);i--}}
if(isWindowScroll){window.scrollBy(scrollX,scrollY)}else{if(scrollX)elem.scrollLeft+=scrollX;if(scrollY)elem.scrollTop+=scrollY}
if(!left&&!top){que=[]}
if(que.length){requestFrame(step,elem,(1000/options.frameRate+1))}else{pending=!1;if(elem.$scrollBehavior!=null){elem.style.scrollBehavior=elem.$scrollBehavior;elem.$scrollBehavior=null}}};requestFrame(step,elem,0);pending=!0}
function wheel(event){if(!initDone){init()}
var target=event.target;if(event.defaultPrevented||event.ctrlKey){return!0}
if(isNodeName(activeElement,'embed')||(isNodeName(target,'embed')&&/\.pdf/i.test(target.src))||isNodeName(activeElement,'object')||target.shadowRoot){return!0}
var deltaX=-event.wheelDeltaX||event.deltaX||0;var deltaY=-event.wheelDeltaY||event.deltaY||0;if(isMac){if(event.wheelDeltaX&&isDivisible(event.wheelDeltaX,120)){deltaX=-120*(event.wheelDeltaX/Math.abs(event.wheelDeltaX))}
if(event.wheelDeltaY&&isDivisible(event.wheelDeltaY,120)){deltaY=-120*(event.wheelDeltaY/Math.abs(event.wheelDeltaY))}}
if(!deltaX&&!deltaY){deltaY=-event.wheelDelta||0}
if(event.deltaMode===1){deltaX*=40;deltaY*=40}
var overflowing=overflowingAncestor(target);if(!overflowing){if(isFrame&&isChrome){Object.defineProperty(event,"target",{value:window.frameElement});return parent.wheel(event)}
return!0}
if(isTouchpad(deltaY)){return!0}
if(Math.abs(deltaX)>1.2){deltaX*=options.stepSize/120}
if(Math.abs(deltaY)>1.2){deltaY*=options.stepSize/120}
scrollArray(overflowing,deltaX,deltaY);event.preventDefault();scheduleClearCache()}
function keydown(event){var target=event.target;var modifier=event.ctrlKey||event.altKey||event.metaKey||(event.shiftKey&&event.keyCode!==key.spacebar);if(!document.body.contains(activeElement)){activeElement=document.activeElement}
var inputNodeNames=/^(textarea|select|embed|object)$/i;var buttonTypes=/^(button|submit|radio|checkbox|file|color|image)$/i;if(event.defaultPrevented||inputNodeNames.test(target.nodeName)||isNodeName(target,'input')&&!buttonTypes.test(target.type)||isNodeName(activeElement,'video')||isInsideYoutubeVideo(event)||target.isContentEditable||modifier){return!0}
if((isNodeName(target,'button')||isNodeName(target,'input')&&buttonTypes.test(target.type))&&event.keyCode===key.spacebar){return!0}
if(isNodeName(target,'input')&&target.type=='radio'&&arrowKeys[event.keyCode]){return!0}
var shift,x=0,y=0;var overflowing=overflowingAncestor(activeElement);if(!overflowing){return(isFrame&&isChrome)?parent.keydown(event):!0}
var clientHeight=overflowing.clientHeight;if(overflowing==document.body){clientHeight=window.innerHeight}
switch(event.keyCode){case key.up:y=-options.arrowScroll;break;case key.down:y=options.arrowScroll;break;case key.spacebar:shift=event.shiftKey?1:-1;y=-shift*clientHeight*0.9;break;case key.pageup:y=-clientHeight*0.9;break;case key.pagedown:y=clientHeight*0.9;break;case key.home:if(overflowing==document.body&&document.scrollingElement)
overflowing=document.scrollingElement;y=-overflowing.scrollTop;break;case key.end:var scroll=overflowing.scrollHeight-overflowing.scrollTop;var scrollRemaining=scroll-clientHeight;y=(scrollRemaining>0)?scrollRemaining+10:0;break;case key.left:x=-options.arrowScroll;break;case key.right:x=options.arrowScroll;break;default:return!0}
scrollArray(overflowing,x,y);event.preventDefault();scheduleClearCache()}
function mousedown(event){activeElement=event.target}
var uniqueID=(function(){var i=0;return function(el){return el.uniqueID||(el.uniqueID=i++)}})();var cacheX={};var cacheY={};var clearCacheTimer;var smoothBehaviorForElement={};function scheduleClearCache(){clearTimeout(clearCacheTimer);clearCacheTimer=setInterval(function(){cacheX=cacheY=smoothBehaviorForElement={}},1*1000)}
function setCache(elems,overflowing,x){var cache=x?cacheX:cacheY;for(var i=elems.length;i--;)
cache[uniqueID(elems[i])]=overflowing;return overflowing}
function getCache(el,x){return(x?cacheX:cacheY)[uniqueID(el)]}
function overflowingAncestor(el){var elems=[];var body=document.body;var rootScrollHeight=root.scrollHeight;do{var cached=getCache(el,!1);if(cached){return setCache(elems,cached)}
elems.push(el);if(rootScrollHeight===el.scrollHeight){var topOverflowsNotHidden=overflowNotHidden(root)&&overflowNotHidden(body);var isOverflowCSS=topOverflowsNotHidden||overflowAutoOrScroll(root);if(isFrame&&isContentOverflowing(root)||!isFrame&&isOverflowCSS){return setCache(elems,getScrollRoot())}}else if(isContentOverflowing(el)&&overflowAutoOrScroll(el)){return setCache(elems,el)}}while((el=el.parentElement));}
function isContentOverflowing(el){return(el.clientHeight+10<el.scrollHeight)}
function overflowNotHidden(el){var overflow=getComputedStyle(el,'').getPropertyValue('overflow-y');return(overflow!=='hidden')}
function overflowAutoOrScroll(el){var overflow=getComputedStyle(el,'').getPropertyValue('overflow-y');return(overflow==='scroll'||overflow==='auto')}
function isScrollBehaviorSmooth(el){var id=uniqueID(el);if(smoothBehaviorForElement[id]==null){var scrollBehavior=getComputedStyle(el,'')['scroll-behavior'];smoothBehaviorForElement[id]=('smooth'==scrollBehavior)}
return smoothBehaviorForElement[id]}
function addEvent(type,fn,arg){window.addEventListener(type,fn,arg||!1)}
function removeEvent(type,fn,arg){window.removeEventListener(type,fn,arg||!1)}
function isNodeName(el,tag){return el&&(el.nodeName||'').toLowerCase()===tag.toLowerCase()}
function directionCheck(x,y){x=(x>0)?1:-1;y=(y>0)?1:-1;if(direction.x!==x||direction.y!==y){direction.x=x;direction.y=y;que=[];lastScroll=0}}
if(window.localStorage&&localStorage.SS_deltaBuffer){try{deltaBuffer=localStorage.SS_deltaBuffer.split(',')}catch(e){}}
function isTouchpad(deltaY){if(!deltaY)return;if(!deltaBuffer.length){deltaBuffer=[deltaY,deltaY,deltaY]}
deltaY=Math.abs(deltaY);deltaBuffer.push(deltaY);deltaBuffer.shift();clearTimeout(deltaBufferTimer);deltaBufferTimer=setTimeout(function(){try{localStorage.SS_deltaBuffer=deltaBuffer.join(',')}catch(e){}},1000);var dpiScaledWheelDelta=deltaY>120&&allDeltasDivisableBy(deltaY);var tp=!allDeltasDivisableBy(120)&&!allDeltasDivisableBy(100)&&!dpiScaledWheelDelta;if(deltaY<50)return!0;return tp}
function isDivisible(n,divisor){return(Math.floor(n/divisor)==n/divisor)}
function allDeltasDivisableBy(divisor){return(isDivisible(deltaBuffer[0],divisor)&&isDivisible(deltaBuffer[1],divisor)&&isDivisible(deltaBuffer[2],divisor))}
function isInsideYoutubeVideo(event){var elem=event.target;var isControl=!1;if(document.URL.indexOf('www.youtube.com/watch')!=-1){do{isControl=(elem.classList&&elem.classList.contains('html5-video-controls'));if(isControl)break}while((elem=elem.parentNode));}
return isControl}
var requestFrame=(function(){return(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(callback,element,delay){window.setTimeout(callback,delay||(1000/60))})})();var MutationObserver=(window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver);var getScrollRoot=(function(){var SCROLL_ROOT=document.scrollingElement;return function(){if(!SCROLL_ROOT){var dummy=document.createElement('div');dummy.style.cssText='height:10000px;width:1px;';document.body.appendChild(dummy);var bodyScrollTop=document.body.scrollTop;var docElScrollTop=document.documentElement.scrollTop;window.scrollBy(0,3);if(document.body.scrollTop!=bodyScrollTop)(SCROLL_ROOT=document.body);else(SCROLL_ROOT=document.documentElement);window.scrollBy(0,-3);document.body.removeChild(dummy)}
return SCROLL_ROOT}})();function pulse_(x){var val,start,expx;x=x*options.pulseScale;if(x<1){val=x-(1-Math.exp(-x))}else{start=Math.exp(-1);x-=1;expx=1-Math.exp(-x);val=start+(expx*(1-start))}
return val*options.pulseNormalize}
function pulse(x){if(x>=1)return 1;if(x<=0)return 0;if(options.pulseNormalize==1){options.pulseNormalize/=pulse_(1)}
return pulse_(x)}
var userAgent=window.navigator.userAgent;var isEdge=/Edge/.test(userAgent);var isChrome=/chrome/i.test(userAgent)&&!isEdge;var isSafari=/safari/i.test(userAgent)&&!isEdge;var isMobile=/mobile/i.test(userAgent);var isIEWin7=/Windows NT 6.1/i.test(userAgent)&&/rv:11/i.test(userAgent);var isOldSafari=isSafari&&(/Version\/8/i.test(userAgent)||/Version\/9/i.test(userAgent));var isEnabledForBrowser=(isChrome||isSafari||isIEWin7)&&!isMobile;var supportsPassive=!1;try{window.addEventListener("test",null,Object.defineProperty({},'passive',{get:function(){supportsPassive=!0}}))}catch(e){}
var wheelOpt=supportsPassive?{passive:!1}:!1;var wheelEvent='onwheel' in document.createElement('div')?'wheel':'mousewheel';if(wheelEvent&&isEnabledForBrowser){addEvent(wheelEvent,wheel,wheelOpt);addEvent('mousedown',mousedown);addEvent('load',init)}
function SmoothScroll(optionsToSet){for(var key in optionsToSet)
if(defaultOptions.hasOwnProperty(key))
options[key]=optionsToSet[key]}
SmoothScroll.destroy=cleanup;if(window.SmoothScrollOptions)
SmoothScroll(window.SmoothScrollOptions);if(typeof define==='function'&&define.amd)
define(function(){return SmoothScroll});else if('object'==typeof exports)
module.exports=SmoothScroll;else window.SmoothScroll=SmoothScroll})();(function(){'use strict'
var keyCounter=0
var allWaypoints={}
function Waypoint(options){if(!options){throw new Error('No options passed to Waypoint constructor')}
if(!options.element){throw new Error('No element option passed to Waypoint constructor')}
if(!options.handler){throw new Error('No handler option passed to Waypoint constructor')}
this.key='waypoint-'+keyCounter
this.options=Waypoint.Adapter.extend({},Waypoint.defaults,options)
this.element=this.options.element
this.adapter=new Waypoint.Adapter(this.element)
this.callback=options.handler
this.axis=this.options.horizontal?'horizontal':'vertical'
this.enabled=this.options.enabled
this.triggerPoint=null
this.group=Waypoint.Group.findOrCreate({name:this.options.group,axis:this.axis})
this.context=Waypoint.Context.findOrCreateByElement(this.options.context)
if(Waypoint.offsetAliases[this.options.offset]){this.options.offset=Waypoint.offsetAliases[this.options.offset]}
this.group.add(this)
this.context.add(this)
allWaypoints[this.key]=this
keyCounter+=1}
Waypoint.prototype.queueTrigger=function(direction){this.group.queueTrigger(this,direction)}
Waypoint.prototype.trigger=function(args){if(!this.enabled){return}
if(this.callback){this.callback.apply(this,args)}}
Waypoint.prototype.destroy=function(){this.context.remove(this)
this.group.remove(this)
delete allWaypoints[this.key]}
Waypoint.prototype.disable=function(){this.enabled=!1
return this}
Waypoint.prototype.enable=function(){this.context.refresh()
this.enabled=!0
return this}
Waypoint.prototype.next=function(){return this.group.next(this)}
Waypoint.prototype.previous=function(){return this.group.previous(this)}
Waypoint.invokeAll=function(method){var allWaypointsArray=[]
for(var waypointKey in allWaypoints){allWaypointsArray.push(allWaypoints[waypointKey])}
for(var i=0,end=allWaypointsArray.length;i<end;i++){allWaypointsArray[i][method]()}}
Waypoint.destroyAll=function(){Waypoint.invokeAll('destroy')}
Waypoint.disableAll=function(){Waypoint.invokeAll('disable')}
Waypoint.enableAll=function(){Waypoint.Context.refreshAll()
for(var waypointKey in allWaypoints){allWaypoints[waypointKey].enabled=!0}
return this}
Waypoint.refreshAll=function(){Waypoint.Context.refreshAll()}
Waypoint.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight}
Waypoint.viewportWidth=function(){return document.documentElement.clientWidth}
Waypoint.adapters=[]
Waypoint.defaults={context:window,continuous:!0,enabled:!0,group:'default',horizontal:!1,offset:0}
Waypoint.offsetAliases={'bottom-in-view':function(){return this.context.innerHeight()-this.adapter.outerHeight()},'right-in-view':function(){return this.context.innerWidth()-this.adapter.outerWidth()}}
window.Waypoint=Waypoint}());(function(){'use strict'
function requestAnimationFrameShim(callback){window.setTimeout(callback,1000/60)}
var keyCounter=0
var contexts={}
var Waypoint=window.Waypoint
var oldWindowLoad=window.onload
function Context(element){this.element=element
this.Adapter=Waypoint.Adapter
this.adapter=new this.Adapter(element)
this.key='waypoint-context-'+keyCounter
this.didScroll=!1
this.didResize=!1
this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()}
this.waypoints={vertical:{},horizontal:{}}
element.waypointContextKey=this.key
contexts[element.waypointContextKey]=this
keyCounter+=1
if(!Waypoint.windowContext){Waypoint.windowContext=!0
Waypoint.windowContext=new Context(window)}
this.createThrottledScrollHandler()
this.createThrottledResizeHandler()}
Context.prototype.add=function(waypoint){var axis=waypoint.options.horizontal?'horizontal':'vertical'
this.waypoints[axis][waypoint.key]=waypoint
this.refresh()}
Context.prototype.checkEmpty=function(){var horizontalEmpty=this.Adapter.isEmptyObject(this.waypoints.horizontal)
var verticalEmpty=this.Adapter.isEmptyObject(this.waypoints.vertical)
var isWindow=this.element==this.element.window
if(horizontalEmpty&&verticalEmpty&&!isWindow){this.adapter.off('.waypoints')
delete contexts[this.key]}}
Context.prototype.createThrottledResizeHandler=function(){var self=this
function resizeHandler(){self.handleResize()
self.didResize=!1}
this.adapter.on('resize.waypoints',function(){if(!self.didResize){self.didResize=!0
Waypoint.requestAnimationFrame(resizeHandler)}})}
Context.prototype.createThrottledScrollHandler=function(){var self=this
function scrollHandler(){self.handleScroll()
self.didScroll=!1}
this.adapter.on('scroll.waypoints',function(){if(!self.didScroll||Waypoint.isTouch){self.didScroll=!0
Waypoint.requestAnimationFrame(scrollHandler)}})}
Context.prototype.handleResize=function(){Waypoint.Context.refreshAll()}
Context.prototype.handleScroll=function(){var triggeredGroups={}
var axes={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:'right',backward:'left'},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:'down',backward:'up'}}
for(var axisKey in axes){var axis=axes[axisKey]
var isForward=axis.newScroll>axis.oldScroll
var direction=isForward?axis.forward:axis.backward
for(var waypointKey in this.waypoints[axisKey]){var waypoint=this.waypoints[axisKey][waypointKey]
if(waypoint.triggerPoint===null){continue}
var wasBeforeTriggerPoint=axis.oldScroll<waypoint.triggerPoint
var nowAfterTriggerPoint=axis.newScroll>=waypoint.triggerPoint
var crossedForward=wasBeforeTriggerPoint&&nowAfterTriggerPoint
var crossedBackward=!wasBeforeTriggerPoint&&!nowAfterTriggerPoint
if(crossedForward||crossedBackward){waypoint.queueTrigger(direction)
triggeredGroups[waypoint.group.id]=waypoint.group}}}
for(var groupKey in triggeredGroups){triggeredGroups[groupKey].flushTriggers()}
this.oldScroll={x:axes.horizontal.newScroll,y:axes.vertical.newScroll}}
Context.prototype.innerHeight=function(){if(this.element==this.element.window){return Waypoint.viewportHeight()}
return this.adapter.innerHeight()}
Context.prototype.remove=function(waypoint){delete this.waypoints[waypoint.axis][waypoint.key]
this.checkEmpty()}
Context.prototype.innerWidth=function(){if(this.element==this.element.window){return Waypoint.viewportWidth()}
return this.adapter.innerWidth()}
Context.prototype.destroy=function(){var allWaypoints=[]
for(var axis in this.waypoints){for(var waypointKey in this.waypoints[axis]){allWaypoints.push(this.waypoints[axis][waypointKey])}}
for(var i=0,end=allWaypoints.length;i<end;i++){allWaypoints[i].destroy()}}
Context.prototype.refresh=function(){var isWindow=this.element==this.element.window
var contextOffset=isWindow?undefined:this.adapter.offset()
var triggeredGroups={}
var axes
this.handleScroll()
axes={horizontal:{contextOffset:isWindow?0:contextOffset.left,contextScroll:isWindow?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:'right',backward:'left',offsetProp:'left'},vertical:{contextOffset:isWindow?0:contextOffset.top,contextScroll:isWindow?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:'down',backward:'up',offsetProp:'top'}}
for(var axisKey in axes){var axis=axes[axisKey]
for(var waypointKey in this.waypoints[axisKey]){var waypoint=this.waypoints[axisKey][waypointKey]
var adjustment=waypoint.options.offset
var oldTriggerPoint=waypoint.triggerPoint
var elementOffset=0
var freshWaypoint=oldTriggerPoint==null
var contextModifier,wasBeforeScroll,nowAfterScroll
var triggeredBackward,triggeredForward
if(waypoint.element!==waypoint.element.window){elementOffset=waypoint.adapter.offset()[axis.offsetProp]}
if(typeof adjustment==='function'){adjustment=adjustment.apply(waypoint)}else if(typeof adjustment==='string'){adjustment=parseFloat(adjustment)
if(waypoint.options.offset.indexOf('%')>-1){adjustment=Math.ceil(axis.contextDimension*adjustment/100)}}
contextModifier=axis.contextScroll-axis.contextOffset
waypoint.triggerPoint=Math.floor(elementOffset+contextModifier-adjustment)
wasBeforeScroll=oldTriggerPoint<axis.oldScroll
nowAfterScroll=waypoint.triggerPoint>=axis.oldScroll
triggeredBackward=wasBeforeScroll&&nowAfterScroll
triggeredForward=!wasBeforeScroll&&!nowAfterScroll
if(!freshWaypoint&&triggeredBackward){waypoint.queueTrigger(axis.backward)
triggeredGroups[waypoint.group.id]=waypoint.group}else if(!freshWaypoint&&triggeredForward){waypoint.queueTrigger(axis.forward)
triggeredGroups[waypoint.group.id]=waypoint.group}else if(freshWaypoint&&axis.oldScroll>=waypoint.triggerPoint){waypoint.queueTrigger(axis.forward)
triggeredGroups[waypoint.group.id]=waypoint.group}}}
Waypoint.requestAnimationFrame(function(){for(var groupKey in triggeredGroups){triggeredGroups[groupKey].flushTriggers()}})
return this}
Context.findOrCreateByElement=function(element){return Context.findByElement(element)||new Context(element)}
Context.refreshAll=function(){for(var contextId in contexts){contexts[contextId].refresh()}}
Context.findByElement=function(element){return contexts[element.waypointContextKey]}
window.onload=function(){if(oldWindowLoad){oldWindowLoad()}
Context.refreshAll()}
Waypoint.requestAnimationFrame=function(callback){var requestFn=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||requestAnimationFrameShim
requestFn.call(window,callback)}
Waypoint.Context=Context}());(function(){'use strict'
function byTriggerPoint(a,b){return a.triggerPoint-b.triggerPoint}
function byReverseTriggerPoint(a,b){return b.triggerPoint-a.triggerPoint}
var groups={vertical:{},horizontal:{}}
var Waypoint=window.Waypoint
function Group(options){this.name=options.name
this.axis=options.axis
this.id=this.name+'-'+this.axis
this.waypoints=[]
this.clearTriggerQueues()
groups[this.axis][this.name]=this}
Group.prototype.add=function(waypoint){this.waypoints.push(waypoint)}
Group.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}}
Group.prototype.flushTriggers=function(){for(var direction in this.triggerQueues){var waypoints=this.triggerQueues[direction]
var reverse=direction==='up'||direction==='left'
waypoints.sort(reverse?byReverseTriggerPoint:byTriggerPoint)
for(var i=0,end=waypoints.length;i<end;i+=1){var waypoint=waypoints[i]
if(waypoint.options.continuous||i===waypoints.length-1){waypoint.trigger([direction])}}}
this.clearTriggerQueues()}
Group.prototype.next=function(waypoint){this.waypoints.sort(byTriggerPoint)
var index=Waypoint.Adapter.inArray(waypoint,this.waypoints)
var isLast=index===this.waypoints.length-1
return isLast?null:this.waypoints[index+1]}
Group.prototype.previous=function(waypoint){this.waypoints.sort(byTriggerPoint)
var index=Waypoint.Adapter.inArray(waypoint,this.waypoints)
return index?this.waypoints[index-1]:null}
Group.prototype.queueTrigger=function(waypoint,direction){this.triggerQueues[direction].push(waypoint)}
Group.prototype.remove=function(waypoint){var index=Waypoint.Adapter.inArray(waypoint,this.waypoints)
if(index>-1){this.waypoints.splice(index,1)}}
Group.prototype.first=function(){return this.waypoints[0]}
Group.prototype.last=function(){return this.waypoints[this.waypoints.length-1]}
Group.findOrCreate=function(options){return groups[options.axis][options.name]||new Group(options)}
Waypoint.Group=Group}());(function(){'use strict'
var $=window.jQuery
var Waypoint=window.Waypoint
function JQueryAdapter(element){this.$element=$(element)}
$.each(['innerHeight','innerWidth','off','offset','on','outerHeight','outerWidth','scrollLeft','scrollTop'],function(i,method){JQueryAdapter.prototype[method]=function(){var args=Array.prototype.slice.call(arguments)
return this.$element[method].apply(this.$element,args)}})
$.each(['extend','inArray','isEmptyObject'],function(i,method){JQueryAdapter[method]=$[method]})
Waypoint.adapters.push({name:'jquery',Adapter:JQueryAdapter})
Waypoint.Adapter=JQueryAdapter}());(function(){'use strict'
var Waypoint=window.Waypoint
function createExtension(framework){return function(){var waypoints=[]
var overrides=arguments[0]
if(framework.isFunction(arguments[0])){overrides=framework.extend({},arguments[1])
overrides.handler=arguments[0]}
this.each(function(){var options=framework.extend({},overrides,{element:this})
if(typeof options.context==='string'){options.context=framework(this).closest(options.context)[0]}
waypoints.push(new Waypoint(options))})
return waypoints}}
if(window.jQuery){window.jQuery.fn.waypoint=createExtension(window.jQuery)}
if(window.Zepto){window.Zepto.fn.waypoint=createExtension(window.Zepto)}}());$(document).ready(function(){init_menu();scroll_to();changeSelect();filter_posts();loadMoreNews()});function init_menu(){$("#hamburger").click(function(e){e.preventDefault();$(this).toggleClass('active');$("body").toggleClass("menu-active")});$(".menu-wrapper a").click(function(){$('#hamburger').trigger('click')});$(window).on("resize",function(){if($(window).width()>1320){$("#hamburger").removeClass('active');$("body").removeClass('menu-active')}})}
function load_reveal(){var notMobile=$(window).width()>767?!0:!1;if(notMobile){$(".reveal").waypoint({handler:function(){var delay_time=$(this.element).data("delay")||0;var element=$(this.element);setTimeout(function(){element.addClass("animated")},delay_time)},offset:function(){var elemOffset=$(this.element).data("offset")||0;if(Waypoint.viewportWidth()<=480){return Waypoint.viewportHeight()-180}
return Waypoint.viewportHeight()+elemOffset}})}else{$(".reveal").addClass("animated")}}
$(window).on("load",function(){setTimeout(function(){$("body").addClass("loaded");reveal_gsap()},400);setTimeout(function(){load_reveal()},800)});function reveal_gsap(){var notMobile=$(window).width()>767?!0:!1;if(notMobile){$(".reveal-text").waypoint({handler:function(){var element=$(this.element);var delay_time=$(this.element).data("delay")||100;var delay_time_ms=delay_time/1000;if(!element.hasClass("animated")){if(element.hasClass("anim-title")&&!element.hasClass("animtitle-done")){element.addClass("animtitle-done");element.parentSplit=new SplitText(element,{type:"lines",linesClass:"split-parent"});element.childSplit=new SplitText(element,{type:"words,chars"});element.anim=gsap.from(element.childSplit.chars,{duration:1,ease:Power3,rotate:10,y:"200%",stagger:0.02});setTimeout(function(){element.addClass("animated")},delay_time)}}},offset:function(){var elemOffset=$(this.element).data("offset")||0;if(Waypoint.viewportWidth()<=480){return Waypoint.viewportHeight()-180}
return Waypoint.viewportHeight()+elemOffset}})}else{$(".reveal-text").each(function(index){$(".reveal-text").addClass("animated")})}}
function scroll_to(){$(".scroll-to-section").click(function(e){var id=$(this).attr("href").split("#")[1];$("html, body").animate({scrollTop:$("#"+id).offset().top-100},1400,"swing")})}
function changeSelect(){$(".gfield_select").on("mousedown",function(){if($(".gfield_select").hasClass('open')){$('.gfield_select').removeClass('open');$('.gfield_select').addClass('close')}else{$('.gfield_select').removeClass('close');$('.gfield_select').addClass('open')}});$(document).click(function(event){if(!$(event.target).is(".gfield_select")){$('.gfield_select').removeClass('open');$('.gfield_select').addClass('close')}});$(".gfield_select").on("change",function(event){$('.gfield_select').removeClass('open');$('.gfield_select').addClass('close')})}
function filter_posts(){var insertPosts=$("#page-wrapper").find(".blogs-wrapper");var filterPostCategory=$("#page-wrapper").find("#picker2");var filterPostDate=$("#page-wrapper").find("#picker");var filterValueCategory=filterPostCategory.val();var filterValueDate=filterPostDate.val();filterPostCategory.dropkick({change:function(){filterValueCategory=$(this)[0].value;insertPosts.animate({'opacity':'0.0'},500);$.ajax({type:'POST',url:admin_url,dataType:'html',data:{action:'filter_post',category:filterValueCategory,date:filterValueDate,},success:function(data){setTimeout(function(){insertPosts.html(data);insertPosts.animate({'opacity':'1.0'},500);loadMoreNews()},500);setTimeout(function(){$(window).trigger('resize')},550)}})}});filterPostDate.dropkick({change:function(){filterValueDate=$(this)[0].value;insertPosts.animate({'opacity':'0.0'},500);$.ajax({type:'POST',url:admin_url,dataType:'html',data:{action:'filter_post',category:filterValueCategory,date:filterValueDate,},success:function(data){setTimeout(function(){insertPosts.html(data);insertPosts.animate({'opacity':'1.0'},500);loadMoreNews()},500);setTimeout(function(){$(window).trigger('resize')},550)}})}})}
function loadMoreNews(){var question=$("body").find(".blog-single-item-target");var count=question.length;var x=12;var paginationItem=$("body").find("#loadmorebutton");if(count<13){paginationItem.addClass('hidden')}else{paginationItem.removeClass('hidden')}
paginationItem.on("click",function(e){$(window).trigger('resize');e.preventDefault();x=x+12<=count?x+12:count;$('.blogs-wrapper .blog-single-item-target:lt('+x+')').addClass('visible');if(x==count){paginationItem.addClass("hidden")}})}
DOM.Methods.allJobsApi=function($this){function getTemporaryTokenAndAllJobOffers(){const apiUrl='https://folkshr.app/cvirtuose/Api/V1/Authentification/getToken/QquuuHwjJ89Qfb91vRu8vxpYqhMT0EpphyAfhaq3?scopes=["AllJobOffer.read"]';fetch(apiUrl).then(response=>{if(!response.ok){throw new Error('Failed to get access token')}
return response.json()}).then(data=>{const accessToken=data.token;if(accessToken){const jobOfferUrl='https://folkshr.app/cvirtuose/Api/V1/JobOffer/list';return fetch(jobOfferUrl,{method:'GET',headers:{'Accept':'application/json','Token':accessToken}})}else{throw new Error('Access token is invalid')}}).then(response=>{if(!response.ok){throw new Error('Failed to get job offers')}
return response.json()}).then(jobOffers=>{displayJobOffers(jobOffers.jobs)}).catch(error=>{console.error('Error:',error.message)})}
function displayJobOffers(jobOffers){const jobContainer=document.getElementById('job-container');jobContainer.innerHTML='';jobOffers.forEach(job=>{const jobWrap=document.createElement('div');jobWrap.className='job-wrap';const leftSide=document.createElement('div');leftSide.className='left-side';const jobTitle=document.createElement('h4');jobTitle.className='job-title';jobTitle.textContent=job.title;const jobInfo=document.createElement('div');jobInfo.className='job-info';jobInfo.innerHTML=`<span>${job.facility_city}</span>`;const jobDescription=document.createElement('p');jobDescription.className='job-description';const parser=new DOMParser();const descriptionDoc=parser.parseFromString(job.description,'text/html');const firstParagraph=descriptionDoc.querySelector('p')?descriptionDoc.querySelector('p').textContent:'';jobDescription.textContent=firstParagraph;leftSide.appendChild(jobTitle);leftSide.appendChild(jobInfo);leftSide.appendChild(jobDescription);const rightSide=document.createElement('div');rightSide.className='right-side';const reveal=document.createElement('div');reveal.className='button-wrap';const ctaLink=document.createElement('a');ctaLink.href=`details-du-poste/?id=${job.id}`;ctaLink.className='swiper-cards--text-holder--cta';const svgDiv=document.createElement('div');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.className='plus';const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','#plus-small-green');svg.appendChild(use);const p=document.createElement('p');p.textContent='Voir plus';svgDiv.appendChild(svg);ctaLink.appendChild(svgDiv);ctaLink.appendChild(p);reveal.appendChild(ctaLink);rightSide.appendChild(reveal);jobWrap.appendChild(leftSide);jobWrap.appendChild(rightSide);jobContainer.appendChild(jobWrap);gsap.set(jobContainer,{autoAlpha:0,height:0});gsap.to(jobContainer,{duration:.5,autoAlpha:1,height:'auto',})})}
getTemporaryTokenAndAllJobOffers()};DOM.Methods.candidateFormControl=function($this){const el=$this[0];const formControl=el.querySelector('#candidateFormID');const cvFile=el.querySelector('#cv');const cvFileName=el.querySelector('#cv-file-name');const letterFile=el.querySelector('#il');const letterFileName=el.querySelector('#letter-file-name');const submitBtn=el.querySelector('#main-submit');const topSubmitBtn=el.querySelector('#top-submit-btn');const submitBtnWrap=el.querySelector('.job-details-button');const thankYouMessageColumn=el.querySelector('.thank-you-message-column');function getCandidateTokenAndSendForm(){const apiUrl='https://folkshr.app/cvirtuose/Api/V1/Authentification/getToken/QquuuHwjJ89Qfb91vRu8vxpYqhMT0EpphyAfhaq3?scopes=["Candidate.write"]';fetch(apiUrl).then(response=>{if(!response.ok){throw new Error('Failed to get access token')}
return response.json()}).then(data=>{const accessToken=data.token;if(accessToken){const candidateUrl='https://folkshr.app/cvirtuose/Api/V1/Candidate/';var formData=new FormData(document.getElementById('candidateFormID'));return fetch(candidateUrl,{method:'POST',headers:{'Token':accessToken},body:formData})}else{throw new Error('Access token is invalid')}}).then(response=>{if(!response.ok){throw new Error('Network response was not ok')}
return response.json()}).then(formData=>{thankYouMessageColumn.classList.add("show-message");submitBtnWrap.classList.remove("loading");setTimeout(()=>{formControl.reset();cvFileName.innerHTML=cvFileName.dataset.text;letterFileName.innerHTML=letterFileName.dataset.text},2000)}).catch(error=>{console.error('There was a problem with the fetch operation:',error)})}
function getElement(id){return document.getElementById(id)}
function validateFormData(){clearErrorMessages();thankYouMessageColumn.classList.remove("show-message");let isValid=!0;if(!validateEmptyField(getElement('first_name'))){isValid=!1}
if(!validateEmptyField(getElement('last_name'))){isValid=!1}
if(!validateEmptyField(getElement('phone'))){isValid=!1}
if(!validateEmail(getElement('email'))){isValid=!1}
if(!validateFile(cvFile)){isValid=!1}
return isValid}
function validateEmptyField(field){if(!field||field.value.trim()===''){showError(field,'This field is required.');return!1}
return!0}
function validateEmail(emailField){if(!emailField){return!1}
if(!validateEmptyField(emailField)){return!1}
const emailReg=/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;let isValidFormat=emailReg.test(emailField.value);if(!isValidFormat){showError(emailField,'The email address entered is invalid, please check the formatting (e.g. email@domain.com).');return!1}
return!0}
function validateFile(fileInput){const allowedTypes=['pdf','doc','docx','rtf','txt','jpg'];const file=fileInput.files[0];var erorrDiv=fileInput.parentNode.querySelector('.checkout_error_message');if(erorrDiv){erorrDiv.remove()}
if(!file){showError(fileInput,'This field is required.');return!1}
const fileType=file.name.split('.').pop().toLowerCase();if(!allowedTypes.includes(fileType)){showError(fileInput,'Invalid file type. Please upload a pdf, doc, docx, rtf, txt, or jpg file.');fileInput.value='';return!1}
return!0}
function showError(field,message){if(!field)return;const error=document.createElement('div');error.className='checkout_error_message';error.innerText=message;field.parentNode.appendChild(error);field.classList.add('checkout_error')}
function clearErrorMessages(){const errors=document.querySelectorAll('.checkout_error_message');errors.forEach(error=>error.remove());const fields=document.querySelectorAll('.checkout_error');fields.forEach(field=>field.classList.remove('checkout_error'))}
cvFile.addEventListener('change',function(event){uploadFile(event.target,cvFileName)});letterFile.addEventListener('change',function(event){uploadFile(event.target,letterFileName)});function uploadFile(target,fileNameDisplay){if(validateFile(target)){fileNameDisplay.innerHTML=target.files[0].name}else{fileNameDisplay.innerHTML=fileNameDisplay.dataset.text}}
topSubmitBtn.addEventListener('click',function(){submitBtn.click()});submitBtn.addEventListener('click',function(event){if(!validateFormData()){event.preventDefault()}else{event.preventDefault();submitBtnWrap.classList.add("loading");getCandidateTokenAndSendForm()}})};DOM.Methods.closePopup=function($this){var modalContainer=$('.modal-container');$this.click(function(e){e.preventDefault();$('body').removeClass('popup-open');$('.popup-box.active').removeClass('active');modalContainer.fadeOut(400)})};DOM.Methods.displaySelect=function($this){$this.dropkick({mobile:!0})};DOM.Methods.filterSelect=function($this){$this.dropkick({mobile:!0})};DOM.Methods.fullJobDescriptionControl=function($this){const el=$this;function getTemporaryTokenAndJobOffer(){const jobId=getQueryParam('id');if(!jobId){console.error('Job ID not found in URL');return}
const apiUrl='https://folkshr.app/cvirtuose/Api/V1/Authentification/getToken/QquuuHwjJ89Qfb91vRu8vxpYqhMT0EpphyAfhaq3?scopes=["JobOffer.read"]';fetch(apiUrl).then(response=>{if(!response.ok){throw new Error('Failed to get access token')}
return response.json()}).then(data=>{const accessToken=data.token;if(accessToken){const jobOfferUrl='https://folkshr.app/cvirtuose/Api/V1/JobOffer/'+jobId;return fetch(jobOfferUrl,{method:'GET',headers:{'Accept':'application/json','Token':accessToken}})}else{throw new Error('Access token is invalid')}}).then(response=>{if(!response.ok){throw new Error('Failed to get job offers')}
return response.json()}).then(jobOffers=>{if(!jobOffers||!jobOffers.job||!jobOffers.job.title){const backButton=document.querySelector('.back-button');const redirectUrl=backButton?backButton.getAttribute('href'):'/';window.location.href=redirectUrl;return}
document.title=jobOffers.job.title||'Job Offer';displayJobOffer(jobOffers.job)}).catch(error=>{console.error('There was a problem with the fetch operation:',error);const backButton=document.querySelector('.back-button');const redirectUrl=backButton?backButton.getAttribute('href'):'/';window.location.href=redirectUrl})}
function getQueryParam(param){const urlParams=new URLSearchParams(window.location.search);return urlParams.get(param)}
function displayJobOffer(job){const jobTitle=el[0].querySelector('#job-main-title-id');const jobContainer=el[0].querySelector('#full-job-description-wrap-id');jobTitle.innerHTML='';const title=document.createElement('h1');title.className='job-main-title';title.textContent=job.title||'Titre du poste non disponible';jobTitle.appendChild(title);jobContainer.innerHTML='';const jobInfoWrapper=document.createElement('div');jobInfoWrapper.className='location-wrapper';const svgIcon=document.createElementNS('http://www.w3.org/2000/svg','svg');svgIcon.setAttribute('width','24');svgIcon.setAttribute('height','24');svgIcon.setAttribute('viewBox','0 0 24 24');svgIcon.setAttribute('fill','none');svgIcon.setAttribute('xmlns','http://www.w3.org/2000/svg');const path1=document.createElementNS('http://www.w3.org/2000/svg','path');path1.setAttribute('d','M12 24C12 24 22 17.4545 22 9.81818C22 7.21424 20.9464 4.71695 19.0711 2.87568C17.1957 1.03441 14.6522 0 12 0C9.34784 0 6.8043 1.03441 4.92893 2.87568C3.05357 4.71695 2 7.21424 2 9.81818C2 17.4545 12 24 12 24Z');path1.setAttribute('fill','#819B57');const path2=document.createElementNS('http://www.w3.org/2000/svg','path');path2.setAttribute('d','M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14Z');path2.setAttribute('fill','#F6F2EF');svgIcon.appendChild(path1);svgIcon.appendChild(path2);const jobInfo=document.createElement('div');jobInfo.className='location';jobInfo.textContent=job.facility_city;jobInfoWrapper.appendChild(svgIcon);jobInfoWrapper.appendChild(jobInfo);jobContainer.appendChild(jobInfoWrapper);const jobDescription=document.createElement('div');jobDescription.className='full-desciption';jobDescription.innerHTML=job.description||'Pas de description disponible';jobContainer.appendChild(jobDescription);if(job.complementary_description){if(jobContainer.dataset.title1.length>0){const titleWrapper=document.createElement('div');titleWrapper.className='title-wrapper';const svgIcon=document.createElementNS('http://www.w3.org/2000/svg','svg');svgIcon.setAttribute('width','24');svgIcon.setAttribute('height','24');svgIcon.setAttribute('viewBox','0 0 24 24');svgIcon.setAttribute('fill','none');svgIcon.setAttribute('xmlns','http://www.w3.org/2000/svg');const path1=document.createElementNS('http://www.w3.org/2000/svg','path');path1.setAttribute('d','M23 20.3333V23H1V20.3333C1 18.9188 1.57946 17.5623 2.61091 16.5621C3.64236 15.5619 5.04131 15 6.5 15H17.5C18.9587 15 20.3576 15.5619 21.3891 16.5621C22.4205 17.5623 23 18.9188 23 20.3333Z');path1.setAttribute('fill','#819B57');const path2=document.createElementNS('http://www.w3.org/2000/svg','path');path2.setAttribute('d','M12 12C15.3137 12 18 9.31371 18 6C18 2.68629 15.3137 0 12 0C8.68629 0 6 2.68629 6 6C6 9.31371 8.68629 12 12 12Z');path2.setAttribute('fill','#819B57');svgIcon.appendChild(path1);svgIcon.appendChild(path2);const title1=document.createElement('h4');title1.className='full-job-title-1';title1.textContent=jobContainer.dataset.title1;titleWrapper.appendChild(svgIcon);titleWrapper.appendChild(title1);jobContainer.appendChild(titleWrapper)}
const complementary_description=document.createElement('div');complementary_description.className='comlpementary-description full-desciption';complementary_description.innerHTML=job.complementary_description;jobContainer.appendChild(complementary_description)};if(job.benefits&&job.benefits.length>0){if(jobContainer.dataset.title2.length>0){const titleWrapper2=document.createElement('div');titleWrapper2.className='title-wrapper';const svgIcon2=document.createElementNS('http://www.w3.org/2000/svg','svg');svgIcon2.setAttribute('width','24');svgIcon2.setAttribute('height','24');svgIcon2.setAttribute('viewBox','0 0 24 24');svgIcon2.setAttribute('fill','none');svgIcon2.setAttribute('xmlns','http://www.w3.org/2000/svg');const path3=document.createElementNS('http://www.w3.org/2000/svg','path');path3.setAttribute('d','M14 6.00005V9.00002H19.66C19.9499 8.99674 20.2371 9.05652 20.5016 9.17524C20.7661 9.29395 21.0016 9.46875 21.1919 9.68753C21.3821 9.90631 21.5225 10.1638 21.6033 10.4423C21.6842 10.7207 21.7035 11.0134 21.66 11.3L20.28 20.3C20.2077 20.7769 19.9654 21.2116 19.5979 21.524C19.2304 21.8364 18.7623 22.0055 18.28 22H7H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0392 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7C7 11 9.5 2.99994 10.5 1.99996C11.5 1.00002 12.4373 1.93738 12.9999 2.49999L13 2.50005C13.5626 3.06266 14 4.00005 14 6.00005Z');path3.setAttribute('fill','#819B57');const path4=document.createElementNS('http://www.w3.org/2000/svg','path');path4.setAttribute('d','M7 11C7 11 9.5 2.99994 10.5 1.99996C11.5 0.999983 12.4374 1.93744 13 2.50005C13.5626 3.06266 14 4.00005 14 6.00005V9.00002H19.66C19.9499 8.99674 20.2371 9.05652 20.5016 9.17524C20.7661 9.29395 21.0016 9.46875 21.1919 9.68753C21.3821 9.90631 21.5225 10.1638 21.6033 10.4423C21.6842 10.7207 21.7035 11.0134 21.66 11.3L20.28 20.3C20.2077 20.7769 19.9654 21.2116 19.5979 21.524C19.2304 21.8364 18.7623 22.0055 18.28 22H7M7 11V22M7 11H4C3.46957 11 2.96086 11.2107 2.58579 11.5858C2.21071 11.9609 2 12.4696 2 13V20C2 20.5304 2.21071 21.0392 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H7');path4.setAttribute('stroke','#F6F2EF');path4.setAttribute('stroke-width','1.5');path4.setAttribute('stroke-linecap','round');path4.setAttribute('stroke-linejoin','round');svgIcon2.appendChild(path3);svgIcon2.appendChild(path4);const title2=document.createElement('h4');title2.className='full-job-title-2';title2.textContent=jobContainer.dataset.title2;titleWrapper2.appendChild(svgIcon2);titleWrapper2.appendChild(title2);jobContainer.appendChild(titleWrapper2)}
const benefitsList=document.createElement('ul');benefitsList.className='job-benefits-list';job.benefits.forEach(benefit=>{const benefitItem=document.createElement('li');benefitItem.textContent=benefit.cb_name;benefitsList.appendChild(benefitItem)});jobContainer.appendChild(benefitsList)};gsap.set(jobTitle,{autoAlpha:0,height:0});gsap.set(jobContainer,{autoAlpha:0,height:0});gsap.to(jobTitle,{duration:.5,autoAlpha:1,height:'auto',});gsap.to(jobContainer,{duration:1,autoAlpha:1,height:'auto',delay:0.4})}
getTemporaryTokenAndJobOffer()};DOM.Methods.menuHover=function($this){$($this).mouseenter(function(){console.log($($this).find(".menu-cards--item--content--cta"))}).mouseleave(function(){console.log("izasao sam")})};DOM.Methods.emailPopup=function($this){$($this).on("click",(e)=>{e.preventDefault();e.stopPropagation();let mailID=$(e.currentTarget).data("mail");$(".email-box--wrapper .email-box--popup--content-email").html(mailID).promise().then(()=>{$("#default-app").attr("href",`mailto:${mailID}?subject=Hello%20%F0%9F%91%8B&cc=&bcc=&body=`);$("#gmail-app").attr("href",`https://mail.google.com/mail/?view=cm&fs=1&to=${mailID}&su=Hello%20%F0%9F%91%8B&cc=&bcc=&body=`);$("#outlook-app").attr("href",`https://outlook.office.com/owa/?path=/mail/action/compose&to=${mailID}&subject=Hello%20%F0%9F%91%8B&body=`)}).then(()=>{$(".email-box--wrapper").fadeIn(400).addClass("active")})});$(".email-box--popup--header-close-button").on("click",(e)=>{e.preventDefault();e.stopPropagation();$("#clipboard").removeClass("copied");$(".email-box--wrapper").fadeOut(400).removeClass("active")});$("#clipboard").on("click",(e)=>{e.preventDefault();e.stopPropagation();let mailEl=$(".email-box--wrapper .email-box--popup--content-email");let tempEl=$("<input>");$("body").append(tempEl);tempEl.val($(mailEl).text()).select();document.execCommand("copy");tempEl.remove();$(e.currentTarget).addClass("copied")})};DOM.Methods.productGallery=function($this){var slideMain=$this.find('.slider-main');var sliderNav=$this.find('.slider-nav');var galleryThumbs=new Swiper(sliderNav,{watchSlidesProgress:!0,watchSlidesVisibility:!0,slidesPerView:5});var galleryTop=new Swiper(slideMain,{effect:'coverflow',speed:700,coverflowEffect:{slideShadows:!1,},navigation:{nextEl:'.swiper-button-next',prevEl:'.swiper-button-prev',},thumbs:{swiper:galleryThumbs}})};function stickySideBar(element,options={}){var _this=this;_this.debouncer;_this.element=element;if($(_this.element).length===0){return}
_this.parentElementClass=options.parentElementClass;_this.wrapClass=options.wrapClass;_this.activeStickyClass=options.activeStickyClass;_this.top=options.top;_this.width=options.width;_this.activeBottomClass=options.activeBottomClass;_this.disableOnMobile=options.disableOnMobile?options.disableOnMobile:!0;_this.breakpoint=992;_this.init=function(){if(_this.disableOnMobile===!0){_this.breakpoint=_this.breakpoint}else if(typeof _this.disableOnMobile=="number"){_this.breakpoint=_this.disableOnMobile}else if(_this.disableOnMobile===!1){_this.breakpoint=!1}
if(_this.disableOnMobile&&Boolean($(window).width()<_this.breakpoint)){$(window).unbind("scroll");$(_this.element).removeClass(_this.activeStickyClass?_this.activeStickyClass:"is-sticked",_this.activeBottomClass?_this.activeBottomClass:"is-bottom").removeAttr("style");return}else{$(_this.element).removeClass(_this.activeStickyClass?_this.activeStickyClass:"is-sticked",_this.activeBottomClass?_this.activeBottomClass:"is-bottom").removeAttr("style")}
var stickyBarTop=$(_this.element).offset().top;var stickyBarHeight=$(_this.element).height();var stickyBarWidth=_this.width?_this.width:$(_this.element).width();$(_this.element).addClass(_this.wrapClass?_this.wrapClass:"sticked");var stickyBarOffsetTop=$(_this.element).data("offset-top")?$(_this.element).data("offset-top"):_this.top?_this.top:0;var parentElement=_this.parentElementClass;var selectedParentElement;var selectedParentElementBottomPosition;if(parentElement){selectedParentElement=$(parentElement)}else{selectedParentElement=$(_this.element).parent()}
selectedParentElementBottomPosition=selectedParentElement.height()+(window.pageYOffset+selectedParentElement[0].getBoundingClientRect().top)-stickyBarHeight-stickyBarOffsetTop;var selectedParentsElementChildrenHeight=stickyBarOffsetTop;selectedParentElement.children().each(function(index,item){selectedParentsElementChildrenHeight+=$(item).height()});if(selectedParentsElementChildrenHeight+50>=selectedParentElement.height()){return}
$(window).scroll(function(){var windowScrollTop=$(this).scrollTop();if(windowScrollTop>=stickyBarTop){if(windowScrollTop>=selectedParentElementBottomPosition){$(_this.element).removeClass(_this.activeStickyClass?_this.activeStickyClass:"is-sticked").addClass(_this.activeBottomClass?_this.activeBottomClass:"is-bottom").css({position:"absolute",top:"unset",bottom:"0px",width:stickyBarWidth+"px",height:stickyBarHeight+"px"})}else{$(_this.element).addClass(_this.activeStickyClass?_this.activeStickyClass:"is-sticked").removeClass(_this.activeBottomClass?_this.activeBottomClass:"is-bottom").css({position:"fixed",top:stickyBarOffsetTop+"px",width:stickyBarWidth+"px",height:stickyBarHeight+"px"})}}else{$(_this.element).removeClass(_this.activeStickyClass?_this.activeStickyClass:"is-sticked").css({position:"static",top:"0px",width:stickyBarWidth+"px",height:stickyBarHeight+"px"})}});$(document).ready(function(){var windowScrollTop=$(this).scrollTop();if(windowScrollTop>=stickyBarTop){$(element).addClass(_this.activeStickyClass?_this.activeStickyClass:"is-sticked").removeClass(_this.activeBottomClass?_this.activeBottomClass:"is-bottom").css({position:"fixed",top:stickyBarOffsetTop+"px",width:stickyBarWidth+"px",height:stickyBarHeight+"px"});return}
if(windowScrollTop>=selectedParentElementBottomPosition){$(element).removeClass(_this.activeStickyClass?_this.activeStickyClass:"is-sticked").addClass(_this.activeBottomClass?_this.activeBottomClass:"is-bottom").css({position:"absolute",top:"unset",bottom:"0px",width:stickyBarWidth+"px",height:stickyBarHeight+"px"});return}})};_this.updateSticky=function(timeout){var timeoutVal=timeout?timeout:100;clearTimeout(_this.debouncer);_this.debouncer=setTimeout(function(){_this.init()},timeoutVal)};_this.destroy=function(){$(window).unbind("scroll");$(_this.element).removeClass(_this.activeStickyClass?_this.activeStickyClass:"is-sticked",_this.activeBottomClass?_this.activeBottomClass:"is-bottom").removeAttr("style");return};return _this.init()}
DOM.Methods.showImage=function($this){const el=$this[0];const top=el.querySelector(".top-part");const image=el.querySelector(".image-wrap");top.addEventListener('click',function(){if(image.style.maxHeight==='0px'){image.style.maxHeight=image.scrollHeight+'px'}else{image.style.maxHeight='0'}})};DOM.Methods.swiper=function($this){var pagination=$this.find('.swiper-pagination')[0];var galleryTop=new Swiper($this[0],{loop:!1,speed:1200,slidesPerView:1,watchOverflow:!0,pagination:{el:pagination,type:"bullets",clickable:!0,},autoplay:{disableOnInteraction:!0,},})};DOM.Methods.swiperBlog=function($this){var slideMain="#"+$this.attr("id");var galleryTop=new Swiper(slideMain,{spaceBetween:20,speed:800,slidesPerView:1,pagination:{el:".swiper-pagination.blog-pag"},breakpoints:{576:{slidesPerView:2},}})}