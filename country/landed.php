<html><head>
<meta name="author" content="me" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<!--style type="text/css">
body {allowtranyparency: true; filter:alpha(opacity=20);-moz-opacity:.20;opacity:.20;"}
</style--> 
<script language="JavaScript" type="text/JavaScript">
<!--
function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);
//-->
function addEvent(elm, evType, fn, useCapture) 
{
	if (elm.addEventListener) { 
		elm.addEventListener(evType, fn, useCapture); 
		return true; 
	} else if (elm.attachEvent) { 
		var r = elm.attachEvent('on' + evType, fn); 
		return r; 
	} else {<
		elm['on' + evType] = fn;
	}
}

addEvent(window, 'load', addLinkTracker, false);

function addLinkTracker()
{
    if (!document.getElementsByTagName) return false;
    
    linksElements = document.getElementsByTagName('a')
    for (var i = 0; i < linksElements.length; i++) 
    {
        addEvent(linksElements[i], 'mousedown', recordClick, true);
        if (! linksElements[i].getAttribute('id') )
            linksElements[i].setAttribute('id',"link_" + i)
    }
}
function recordClick(e)
{
	if (typeof e == 'undefined')
		var e = window.event;

	var source;
	if (typeof e.target != 'undefined') 
	{
		source = e.target;
	} else if (typeof e.srcElement != 'undefined') {
		source = e.srcElement;
	} else {
		return true;
	}

	if (source.nodeType == 3)
		source = source.parentNode;
		
    	var id, target, url, label
    
    	if( source.tagName == "IMG" )
    	{
 	       if( source.parentNode.tagName == "A" )
 	       {
 	           id = source.parentNode.getAttribute('id');
	            target = source.parentNode.getAttribute('href');
  	      }
  	      label = source.getAttribute("alt");
  	}else{
  	      id = source.getAttribute('id');
  	      target = source.getAttribute('href');
  	      label = source.childNodes[0].nodeValue;
  	}
 	url = document.location.href;
	
	var pars = '';	
	apiurl = "http://localhost/blog/api/addClick.aspx?id=" + id + "&label=" + label + "&target=" + target + "&url=" + url + "&rand="+Math.random();
	ajaxRequest = new Ajax.Request(apiurl, {method: 'get', parameters: pars, onComplete: passThrough});
}

function passThrough( originalRequest )
{
	//Helps debug api errors
	//alert( originalRequest.responseText );
}
addEvent(document, 'keydown', keyCheck, false);
<!-- http://www.glennjones.net/Post/805/AjaxLinkTracker.htm was weiss ich, wofür das gut ist. --></script>

</head><body> 
<a href="http://girl.tv/banner/frames.html" target="freemix">
<img style="position:absolute;z-index:11; top:0px; left:0px;" onmouseover="javascript:top.document.title = 'wow, wow, wow...';" src="run-run-run.gif" border="0" >
</a>
<a href="http://girl.tv/landed" target="freemix"><img style="position:absolute;z-index:12; top:0px; left:150px;" src="girl.tv.gif" border="0" onmouseover="javascript:top.document.title = 'i want  home';" ></a>
<!--a style="position:absolute;z-index:12; top:0px; left:250px;" href="http://art.teleportacia.org" onmouseover="javascript:document.window.title = 'i was ready for some teleportica and a visit to the';" onclick="javascript:document.title = 'PAGES IN THE MIDDLE OF NOWHERE (art.teleportacia.org)';" target="freemix">.</a-- goto http://girl.tv/landed >


<p style="position:absolute;z-index:12; top:0px; left:30px; color:red; text-decoration:none; font-family:arial; font-size:10px;"> </p>


 <!--  i know you are there...  -->
</body></html>