<!-- GIRL.TV WINDOW SETUP --! js/window.js & /window>
<SCRIPT LANGUAGE="JavaScript">

	function CenterWindowBROWSKY(mintpage, mintname, w, h, scroll) {
	var winl = (screen.width - w) / 2;
	var wint = (screen.height - h) / 2;
	winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars='+scroll+',resizable'
	win = window.open(mintpage, mintname, winprops)
	if (parseInt(navigator.appVersion) >= 4) { win.window.focus(); }
	}
</script>