// Browser test
var agt = navigator.userAgent.toLowerCase();
var appVer = navigator.appVersion.toLowerCase();
var is_minor = parseFloat(appVer);
var is_opera = (agt.indexOf("opera")!=-1);
var is_safari = ((agt.indexOf('safari')!=-1)&&(agt.indexOf('mac')!=-1));
var is_konq = (agt.indexOf('konqueror')!=-1);
var is_khtml = (is_safari||is_konq);
var is_gecko = ((!is_khtml)&&(navigator.product)&&(navigator.product.toLowerCase()=="gecko"));
var is_moz = ((agt.indexOf('mozilla/5')!=-1)&&(agt.indexOf('spoofer')==-1)
			&&(agt.indexOf('compatible')==-1)&& (agt.indexOf('opera')==-1)
			&&(agt.indexOf('webtv')==-1)&&(agt.indexOf('hotjava')==-1)
			&&is_gecko&&((navigator.vendor=="")||(navigator.vendor=="Mozilla")||(navigator.vendor=="Debian")));
var is_fb = ((agt.indexOf('mozilla/5')!=-1)&&(agt.indexOf('spoofer')==-1)
			&&(agt.indexOf('compatible')==-1)&&(agt.indexOf('opera')==-1)
			&&(agt.indexOf('webtv')==-1)&&(agt.indexOf('hotjava')==-1)
			&&is_gecko&&(navigator.vendor=="Firebird"));
var is_fx = ((agt.indexOf('mozilla/5')!=-1)&&(agt.indexOf('spoofer')==-1)
			&&(agt.indexOf('compatible')==-1)&&(agt.indexOf('opera')==-1)
			&&(agt.indexOf('webtv')==-1)&&(agt.indexOf('hotjava')==-1)
			&&is_gecko&&(navigator.vendor=="Firefox"));
var is_nav = ((agt.indexOf('mozilla')!=-1)&&(agt.indexOf('spoofer')==-1)
			&&(agt.indexOf('compatible')==-1)&&(agt.indexOf('opera')==-1)
			&&(agt.indexOf('webtv')==-1)&&(agt.indexOf('hotjava')==-1)
			&&(!is_khtml)&&(!is_moz)&&(!is_fb)&&(!is_fx));
var is_win = ((agt.indexOf("win")!=-1)||(agt.indexOf("16bit")!=-1));
var is_mac = (agt.indexOf("mac")!=-1);
var iePos = appVer.indexOf('msie');
if (iePos!=-1) {
	if (is_mac) {
		var iePos = agt.indexOf('msie');
		is_minor = parseFloat(agt.substring(iePos+5,agt.indexOf(';',iePos)));
	} else is_minor = parseFloat(appVer.substring(iePos+5,appVer.indexOf(';',iePos)));
}
var is_ie = ((iePos!=-1)&&(!is_opera)&&(!is_khtml));
var is_ie4up = (is_ie&&(is_minor>=4));
var is_ie5up = (is_ie&&(is_minor>=5));

// Flash Test
var is_Flash = false;
var is_FlashVersion = 0;
if ((is_nav||is_opera||is_moz||is_fb||is_fx||is_khtml)||(is_mac&&is_ie5up)) {// Non-WinIE Test
	var plugin = (navigator.mimeTypes && 
				navigator.mimeTypes["application/x-shockwave-flash"] &&
				navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) ?
				navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;
	if (plugin&&plugin.description) {
		is_Flash = true;
		is_FlashVersion = parseInt(plugin.description.substring(plugin.description.indexOf(".")-1));
	}
}
if (is_win&&is_ie4up) {// WinIE Test
	document.write(
		'<scr'+'ipt language=VBScript>'+'\n'+
		'Dim hasPlayer, playerversion'+'\n'+
		'hasPlayer = false'+'\n'+
		'playerversion = 10'+'\n'+
		'Do While playerversion > 0'+'\n'+
		'On Error Resume Next'+'\n'+
		'hasPlayer = (IsObject(CreateObject("ShockwaveFlash.ShockwaveFlash." & playerversion)))'+'\n'+
		'If hasPlayer = true Then Exit Do'+'\n'+
		'playerversion = playerversion - 1'+'\n'+
		'Loop'+'\n'+
		'is_FlashVersion = playerversion'+'\n'+
		'is_Flash = hasPlayer'+'\n'+
		'<\/sc'+'ript>'
	);
}