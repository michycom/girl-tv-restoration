<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        
<? require ('function/function.inc.php') ?>           
        
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="EN">
    <head>
<meta http-equiv="Refresh" content="60; URL="http://www.girl.tv/join/">            
        <title>testn</title>
            
        <!-- Scripte -->
        <script src="http://code.jquery.com/jquery-latest.js"></script>
 
        <!-- CSS -->
        <link href="css/basics.css" rel="stylesheet" type="text/css" media="all" />
<script language="javascript">
        setTimeout("window.location.href='http://girl.tv/you';",15000);
</script>

    </head>   
    
    <body>
        <div id="action">click</div>
    
        <script type="text/javascript">
            $(document).ready(function() {
                    
                $("#pxlboy").click(function(){
                    $("#boy img").animate({ 
                        width: "1450px",
                        marginLeft: "2168px",
                        marginTop: "750px",
                        //opacity: 0.4,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 2500 );
                    
                    $("#pxlboy img").animate({ 
                        width: "4px",
                        marginLeft: "180px",
                        marginTop: "40px",
                        //opacity: 0.4,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 2500 );
/*                  alert('whooooha'); */
                    


                });
                
                $("#action").click(function(){
                    $("#boy img").animate({ 
                        width: "4800px",
                        marginLeft: "-2168px",
                        marginTop: "-750px",
                        //opacity: 0.4,
                        //fontSize: "3em", 
                        //borderWidth: "10px"
                    }, 2500 );
                });
            });
        </script>  
    
    
    
        <div id="boy"><img src="art/ohboy.jpg" /></div>
        
        <div id="pxlboy"><img src="art/pxlboy.gif" width="10" /></div>
    
    
    </body>
</html>
<!--end:html-->
