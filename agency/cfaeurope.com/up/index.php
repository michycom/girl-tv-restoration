
 <html>
<head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>UPLOAD</title>
</head>
<script type="text/javascript" src="script.js"></script>

        <body>
     
<?      
    $useApplet=0;
    $user_agent =$_SERVER['HTTP_USER_AGENT'];
    
    if(stristr($user_agent,"konqueror") || stristr($user_agent,"macintosh") || stristr($user_agent,"opera"))
    {
        $useApplet=1;
        echo '<applet name="Rad Upload Plus"
                        archive="dndplus.jar"
                        code="com.radinks.dnd.DNDAppletPlus"
                        width="290" MAYSCRIPT="yes" id="rup"
                        height="290">';
    }
    else
	{
        if(strstr($user_agent,"MSIE")) {
                echo '<script language="javascript" src="embed.js" type="text/javascript"></script>';
                echo '<script>IELoader()</script>';
        } else {
            echo '<object type="application/x-java-applet;version=1.4.1"
                    width= "290" height= "290"  id="rup" name="rup">';
            echo '  <param name="archive" value="dndplus.jar">
                    <param name="code" value="com.radinks.dnd.DNDAppletPlus">
                    <param name="name" value="Rad Upload Plus">';
        }
	}
?>
    <!-- BEGIN APPLET CONFIGURATION PARAMETERS -->
    <param name="max_upload" value="20000">
    <!-- size in kilobytes (takes effect only in Rad Upload Plus) -->

     <param name = "message" value="<font face=arial size=-2     >&nbsp; &nbsp; &nbsp; &nbsp; _drop stuff. <br> <img src=http://girl.tv/3boys.gif> ">
    
    <!-- edit the above line to customize the welcome message displayed. example
    value='http://www.radinks.com/upload/init.html' -->
    <param name='url' value='upload.php'>
    <!-- you can pass additional parameters by adding them to the url-->

    <!-- to upload to an ftp server instead of a web server, please specify a url
         in the following format:
         
            ftp://username:password@ftp.myserver.com
            
         while replacing username, password and ftp.myserver.com with corresponding entries for your site -->
    <!-- END APPLET CONFIGURATION PARAMETERS -->
    
<?
		if(isset($_SERVER['PHP_AUTH_USER']))
		{
			printf('<param name="chap" value="%s">',
				base64_encode($_SERVER['PHP_AUTH_USER'].":".$_SERVER['PHP_AUTH_PW']));
		}
		if($useApplet == 1)
		{
			echo '</applet>';
		}
		else
		{
            echo '</object>';
		}
?>
jpg,jpeg,JPEG,jpe,pdf,mov
 </body>
</html>

