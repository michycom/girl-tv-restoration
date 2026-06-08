 
<style>
.drop{
    font-family: Georgia;
    background-color: GHOSTWHITE;
    border: 1px;
    font-size: 10px;
    letter-spacing: 1px;}
</style>
<?
       
        $mydate=date(d);
        // echo $mydate[1];
   
    echo" <select name='select' onChange='parent.oben.location.href=this.options[this.selectedIndex].value' class='drop'>";
    echo" <option value='#' selected>Das Prinzip der virtuellen Verr&uuml;ckung im Girl.tv/land 1-21 September Graz/ AUSTRIA </option>";
               
     for($i=1; $i<22; $i++)
        {
            $verz=opendir ('./');             
                while ($file = readdir ($verz)) {
                if( $file != "refresh.php" && $file != "." && $file != ".."){
                 #if( $file = 'index.htm'){ 
                     $a=$file;
                     $ordner= "day".$i;
                     
                     }
	            
	            }																	
	            closedir($verz);
        
            echo " <option value='#'>&nbsp; &nbsp; &nbsp; &nbsp</option>";
            echo" <option value='#'>&rarr;Girl.Tv/land $ordner: </option>";
                // Ordner auslesen 
                @$verz=opendir ($ordner);             
                while ($file = @readdir ($verz)) {
                if( $file != 'art' && $file != '.' && $file != '..'){
                    echo " <option value='$ordner/$file'>&nbsp; &nbsp; &nbsp; &nbsp;$file</option>";
                     }
	            
	            }																	
	            @closedir($verz);
            
            
           }
            
           echo '</select>'; 

           #echo "<br> <br> read_MONTH_Dirs_read_file Version 1.0"
?>
