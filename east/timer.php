 <HTML PUBLIC "-//W3C//DTD HTML 4.01 
Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>hello...</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

<script language="javascript" type="text/javascript">
function changecolor(code)
{
	H=new Date(); H.getHours(); S=H.getHours(); var a="";
	
	if(S>=04)  {document.bgColor="#000000"};
		if(S>=05 && S<=8) {document.bgColor="#000033"};
			if(S>=08 && S<=09) {document.bgColor="#333333"};

	if(S>=09 && S<=10) {document.bgColor="#CCCCFF"};
	if(S>=10 && S<=11) {document.bgColor="#FFFFCC"};
	if(S>=11 && S<=13) {document.bgColor="#66FFFF"};
	if(S>=13 && S<=15) {document.bgColor="#CCCCFF"};
	if(S>=15 && S<=17) {document.bgColor="#078DCC"};
	if(S>=17 && S<=19) {document.bgColor="#003366"};
	if(S>=19)  {document.bgColor="#000000"};
		if(S>=0 && S<=01) {document.bgColor="#000000"};
                if(S>=02 && S<=03) {document.bgColor="#000000"};
                
                
}

function east(id)
{
if(document.getElementsByTagName){  
   var table = document.getElementById(id);   
   var rows = table.getElementsByTagName("td");   
   for(i = 0; i < rows.length; i++){           
 //manipulate rows 
     if(i % 2 == 0){ 
       rows[i].className = "even"; 
     }else{ 
       rows[i].className = "odd"; 
     }       
   } 
 } 
}
</script>

<style type="text/css">
<!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
.odd{background-color: yellow;} 
.one{background-color: #000000"};
.two{background-color: #000033"};
.three{background-color: #333333"};
.four{background-color: #CCCCFF"};
.five{background-color: #FFFFCC"};
.six{background-color: #66FFFF"};
.seven{background-color: #CCCCFF"};
.eight{background-color: #078DCC"};
.nine{background-color: #003366"};
.ten{background-color: #000000"};
.eleven{background-color: #000000"};



-->
</style></head>
<body onload="changecolor('red')"->
<!--a href="javascript:east('sky')">sky</a--> 
<div id="east" style="position:absolute; width:100px; height:30px; z-index:1; left: 600px; top: 40px; visibility: visible;">
<a href="http://my.girl.tv"><img src="http://girl.tv/mail+/ico/newmail.gif" border="0"> </a>
<a href="http://www.girl.tv/THIS-IS-MUSIC"><img src="http://girl.tv/mail+/ico/inbox.gif" border="0"></a> 
<a href="http://ck.girl.tv"><img src="http://girl.tv/mail+/ico/adressbook.gif" border="0"></a>
</div>			   
<br><br><br>
<table id="sky" width="100%"  border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td id="sky "width="782" valign="bottom"><img src="girl-tv-east-building.gif" width="587" height="251"></td>
  </tr>
  <tr>
    <td width="782" height="372" valign="top" bgcolor="yellow"><img src="girl-tv-east-street.gif" width="587" height="279">
<div id=frame style="position:absolute; width:300px; height:50px; z-index:0; left: 550px; top: 350px; visibility: visible;">
<IFRAME src="http://girl.tv/small/index.php" width="100%" FrameBorder="0" scrolling="no" marginheight="0" allowtransparency="true" border="0" height="260">
</div></td>
  </tr>
</table>
</body>
</html>

