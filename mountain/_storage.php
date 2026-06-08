
<? 
$domain = GetHostByName($REMOTE_ADDR); 
$now = time();
echo "<form action='test2.php' method=post'>
<input type=text name='now' value='".$now."'><input type=text name='domain' value='".$domain."'>
<input type=image name=point src='art/add-yourself-freemee.png'>
</form>";
?>



<script type="text/javascript">
 // wie lange lebt der keks in tagen
num_days = 1;
function ged(noDays){
    var today = new Date();
    var expr = new Date(today.getTime() + noDays*24*60*60*1000);
    return  expr.toGMTString();
}

function readCookie(cookieName){
    var start = document.cookie.indexOf(cookieName);
    if (start == -1){ 
        document.cookie = "120wildschweiner=yes; expires=" + ged(num_days);
    } else {

	document.getElementById("addyou").style.visibility = "hidden";

    }
}
readCookie("120wildschweiner");
</script>



<!--
<div class="sendmsg"><br /><br /><br /><br />
<p><iframe src="minibook/start.html" frameborder="0" width="190" height="200"></iframe></p>
</div>
-->



<script type="text/javascript">
<!--
SET_DHTML("wolko", "wolk", "sucker");
//-->
</script>


.sendmsg{
		filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src='art/board.png');
		background-repeat:no-repeat;
		text-align: center;
		position: absolute;
		top: 50px;
		left: 200px;
		width: 286px;
		height: 320px;
		border: none 1px red;
		z-index: 3;
		visibility:hidden;

		}

		.sendmsg[class]{
				border: solid 1px red;

		text-align: center;
		position: absolute;
		top: 50px;
		left: 200px;
		background-image:url('../art/board.png');
		background-repeat:no-repeat;
		width: 240px;
		height: 320px;
		z-index: 3;
		visibility:hidden;

		}