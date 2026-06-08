<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        
<? require ('function/function.inc.php') ?>           
        
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="EN">
    <head>
            
        <title>the screen</title>
            
        <!-- Scripte -->
        <script src="http://code.jquery.com/jquery-latest.js"></script>
 
        <!-- CSS -->
        <link href="css/basics.css" rel="stylesheet" type="text/css" media="all" />
    
<meta http-equiv="refresh" content="20000;URL=http://girl.tv/SCREEN">
<SCRIPT language=JavaScript1.2>
setTimeout("location.href=\'http://girl.tv/SCREEN\'",20000);
</script>

    </head>   
    
    <body>
    
        <script type="text/javascript">
            $(document).ready(function() {
                    
                $("#pxlboy").click(function(){
                    $("#boy img").animate({ 
                        width: "1791px",
                        marginLeft: "2159px",
                        marginTop: "905px",
                        //opacity: 0.4,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 2500 );
                    
                    $("#pxlboy img").animate({ 
                        width: "18px",
                        marginLeft: "-50px",
                        marginTop: "40px",
                        //opacity: 0.4,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 2500 );

/*                  alert('whooooha');  */
                    $("#pxl2boy img").animate({
                        width: "16px",
                        marginLeft: "480px",
                        marginTop: "400px",
                        //opacity: 0.4,
                        //fontSize: "3em",
                        //borderWidth: "10px"
                    }, 2500 );
                    


  

                });
				
$("#pxl2boy").click(function(){
                    $("#boy img").animate({ 
                        width: "450px",
                        marginLeft: "2768px",
                        marginTop: "950px",
                        //opacity: 0.4,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 2500 );
                    
                    $("#pxl2boy img").animate({ 
                        width: "12px",
                        marginLeft: "-130px",
                        marginTop: "390px",
                        //opacity: 0.4,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 2500 );
                  /*alert('yiiipppppiiiii'); */
                    


  

                });
				
			
                $("#action").click(function(){
                    $("#boy img action").animate({ 
                        width: "91px",
			height: "1005px",
                        marginLeft: "2168px",
                        marginTop: "-750px",
                        //opacity: 0.4,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 2500 );
                });
            });
        </script>  
    
    
    
        <div id="boy"><img src="http://girl.tv/SCREEN/art/girltvbig.png" /></div>
        
        <div id="pxlboy"><img src="art/pxlboy.gif" width="10" /></div>
    
        <div id="pxl2boy"><img src="art/pxl2boy.gif" width="16" /></div>
    
<div class="box3" style="font-family:times;font-size:12px;">
<input type="text" style="-webkit-appearance:searchfield;width:160px;height:50px;font-size:24px;" value="somewhat later..."></input>
    
    
    
    
    
    
    
    
    
    </body>
</html>
<!--end:html-->
