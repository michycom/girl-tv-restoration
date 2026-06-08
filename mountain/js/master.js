





//miniBook pop up//

function bookpop()
		{
		win_bookpop = window.open("minibook/start.html","info2","width=220,height=220,resizable=yes,scrollbars=1,border=0 hspace=0,vspace=0,top=350,left=760");
		win_bookpop.focus();
		}

// Toggle Layer //

function toggle(object) {
  	if (document.getElementById) {
    if (document.getElementById(object).style.visibility == 'visible')
      	document.getElementById(object).style.visibility = 'hidden';
    else
      	document.getElementById(object).style.visibility = 'visible';
  	}

  	else if (document.layers && document.layers[object] != null) {
    if (document.layers[object].visibility == 'visible' ||
        document.layers[object].visibility == 'show' )
      	document.layers[object].visibility = 'hidden';
    else
      	document.layers[object].visibility = 'visible';
  	}

  	else if (document.all) {
    if (document.all[object].style.visibility == 'visible')
      	document.all[object].style.visibility = 'hidden';
    else
      	document.all[object].style.visibility = 'visible';
  	}
	return false;
	}
