

// extra//
setTimeout("window.location.href='http://www.girl.tv/pool';", 1000);

	function fuckpopupblock()
	{
	win_fuckpopupblock = window.open("http://www.extra-extra.de/start.html","window","width=454,height=454,resizable=no,scrollbars=no,menubar=no");
	win_fuckpopupblock.moveTo(400,200); 
	win_fuckpopupblock.focus();
	}

	function win_extra(extra) {
	OpenWin = this.open(extra, "CtrlWindow1", "toolbar=no,menubar=no,location=no,status=no,scrollbars=no,width=454,height=454 border=0");
	OpenWin.moveTo(400,200);
	OpenWin.focus();
	}
	
//window-resize//	
	window.moveTo(0,0);
	if (document.all) {
	top.window.resizeTo(screen.availWidth,screen.availHeight);
	}
	else if (document.layers||document.getElementById) {
	if (top.window.outerHeight<screen.availHeight||top.window.outerWidth<screen.availWidth){
	top.window.outerHeight = screen.availHeight;
	top.window.outerWidth = screen.availWidth;
	}
	}
	
	
