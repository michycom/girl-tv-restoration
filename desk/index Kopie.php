
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        
           
        
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="EN">
    <head>
  <script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/reflection.js"></script>

<meta http-equiv="refresh" content="400000;URL=http://girl.tv/">
<SCRIPT language=JavaScript1.2>
setTimeout("location.href=\'./'",400000);
</script>
        <title>test</title>
            
        <!-- Scripte -->
        <script src="http://code.jquery.com/jquery-latest.js"></script>
 
        <!-- CSS -->
<style type="text/css">
<!--
body,td,th {
text-transform: uppercase;
font-family: Arial;
word-break: normal;
font-size: 11px;
margin: 0px;
background:#000;
color:#fff;
}
a:link {text-decoration: none; color: #ff00ff;font-size: 11px;}
a:visited {text-decoration: none;color: #ff00ff;font-size: 11px;}
a:hover {text-decoration: none;font-size: 11px;}
a:active {text-decoration: none;font-size: 11px;}

#folder{
    position: absolute;
    top: 100px;
    left: 210px;
    width: 200px;
    height: 220px;

}

#folder img{
    width: 100%;
   float: bottom;
}

#folder1{
    position: absolute;
    top: 100px;
    left: 410px;
    width: 200px;
    height: 220px;

}

#folder1 img{
    width: 100%;
   float: bottom;
}
-->

</style>    
    </head>   
    
    <body>
    
    
       <!-- 
       div id="action"><input type="text" style="-webkit-appearance:searchfield;width:155px;position:relative;top:5px;left:20px;font-size:20px;" value=" >
<font color="white" face="arial">.</input></div 
		-->

        <script type="text/javascript">
            $(document).ready(function() {
                    
                $("#folder").mouseover(function(){
   
                 $("#folder img").animate({ 
                        // original size
                        width: "20%",
                        marginLeft: "10px",
                        marginTop: "10px",
                        opacity: 0,
                        fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 250 );

               $("#folder1 img").animate({ 
                        // original size
                        width: "20%",
                        marginLeft: "170px",
                        marginTop: "110px",
                        opacity: 1,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 250 );
                   
                });
                
                                    
                $("#folder1").mouseover(function(){
   
                 $("#folder img").animate({ 
                        // original size
                        width: "100%",
                        marginLeft: "-10px",
                        marginTop: "-10px",
                        opacity: 1,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 250 );

               $("#folder1 img").animate({ 
                        // original size
                        width: "100%",
                        marginLeft: "-10px",
                        marginTop: "-10px",
                        opacity: 0,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 250 );
                   
                });
                
       

            });
        </script>  
    
<div id="folder">
<img src="folder.png"><br><center>directors
</div>		
<div id="folder1">
<img src="folder.png" class=" reflect"><br></center><!-- class=" reflect" -->
</div>	




<p style="background-color:#fff; margin-Top:300px;height:600px;">


</p>
</body>
</html>