
// Link Tracker, version 1.0
// (c)Glenn Jones - Dec 2005
// For details: http://www.glennjones.net/


var labelsCreated = false;
var labelsDisplayed = false;

function addLinkTracker()
{
	if (!document.getElementsByTagName) return false;
	
	linksElements = document.getElementsByTagName('a')
	for (var i = 0; i < linksElements.length; i++) 
	{
		addEvent(linksElements[i], 'mousedown', recordClick, false);
		// If a link does not have any id it is given one
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
		
	// Changed to work with hyperlinks 
	// around images. See Peter Bowyer comment
	//---------------------------------
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
	//---------------------------------
	
	var pars = '';	
	apiurl = "http://www.glennjones.net/api/addClick.aspx?id=" + id + "&label=" + label + "&target=" + target + "&url=" + url + "&rand="+Math.random();
	ajaxRequest = new Ajax.Request(apiurl, {method: 'get', parameters: pars, onComplete: passThrough});
	
	return false;	
}

function passThrough( originalRequest )
{
	// Helps debug api errors
	// alert( originalRequest.responseText );
}

//------------------------------------------------------------------

function keyCheck(e)
{
	var keyID = (window.event) ? event.keyCode : e.keyCode;
	var ctrlKey = (window.event) ? event.ctrlKey : e.ctrlKey;
	
	if((keyID == 88)&&(ctrlKey == true))  // Ctrl L
	{ 
		if( labelsCreated == false )
		{
			getClickThroughInfo();
		}
		else
		{
			if(labelsDisplayed == true)
			{
				displayStatus = "none"
				labelsDisplayed = false
			}
			else
			{
				displayStatus = "block"
				labelsDisplayed = true
			}
			
			eltLabels = document.getElementsByClassName('linklabel');	
			for (var i = 0; i < eltLabels.length; i++)
			{
				eltLabels[i].style.display = displayStatus;
			}
		}
	}
}

function getClickThroughInfo()
{
	var pars = '';	
	url = document.location.href;
	apiurl = "http://www.glennjones.net/api/getClicks.aspx?url=" + url + "&rand="+Math.random();
	ajaxRequest = new Ajax.Request(apiurl, {method: 'get', parameters: pars, onComplete: displayClickThroughs});
}	

function displayClickThroughs( originalRequest )
{
	if (!document.getElementsByTagName) return false;
	
	if( originalRequest.responseXml )
		node = originalRequest.responseXml;
	else
		node = originalRequest.responseXML;
		
	//Helps debug api errors
	//alert( originalRequest.responseText );
	
	if(node.childNodes[0].nodeType == 7)
		rootNode = node.childNodes[1]
	else
		rootNode = node.childNodes[0]

	for (var i = 0; i < rootNode.childNodes.length; i++)
	{
		linknode = rootNode.childNodes[i];
		count = linknode.getAttribute('count');
		percent = linknode.getAttribute('percent');
		label = linknode.getAttribute('label');
		id = linknode.childNodes[0].nodeValue;
		
		if ( document.getElementById(id) )
		{
			eltLink =  document.getElementById(id);
			
			eltDiv = document.createElement( 'div' );
			eltDiv.className = "linklabel";
			eltText = document.createTextNode( percent + "% " + label );
			eltDiv.appendChild( eltText );
			document.body.appendChild( eltDiv );
			
			ileft = parseInt(getPageOffsetLeft( eltLink )) + 10;
			itop = parseInt(getPageOffsetTop( eltLink )) + 10;
			eltDiv.style.left = ileft + "px";
			eltDiv.style.top = itop + "px";
			
		}
	} 
	labelsCreated = true;
	labelsDisplayed = true;

}


//------------------------------------------------------------------

document.getElementsByClassName = function(className) 
{
  var children = document.getElementsByTagName('*') || document.all;
  var elements = new Array();
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var classNames = child.className.split(' ');
    for (var j = 0; j < classNames.length; j++) {
      if (classNames[j] == className) {
        elements.push(child);
        break;
      }
    }
  }
  return elements;
}

function addEvent(elm, evType, fn, useCapture) 
{
  // cross-browser event handling for IE5+, NS6 and Mozilla By Scott Andrew 
  if (elm.addEventListener) { 
    elm.addEventListener(evType, fn, useCapture); 
    return true; 
  } else if (elm.attachEvent) { 
    var r = elm.attachEvent('on' + evType, fn); 
    return r; 
  } else {
    elm['on' + evType] = fn;
  }
}


function getPageOffsetLeft(elt) 
{
  var x;
  x = elt.offsetLeft;
  if (elt.offsetParent != null)
    x += getPageOffsetLeft(elt.offsetParent);
  return x;
}


function getPageOffsetTop(elt) 
{
  var y;
  y = elt.offsetTop;
  if (elt.offsetParent != null)
    y += getPageOffsetTop(elt.offsetParent);
  return y;
}


addEvent(window, 'load', addLinkTracker, false);
addEvent(document, 'keydown', keyCheck, false);