		
		<?php 
		
		// ACHTUNG zu testzwecken hab ich filter2 von MP4 in M4V geändert (replaced all mp4 in here!) tk
		
        echo 'recursiv.php<br>';          // delete me tk
		
		$directory = '../filme';      //added this tk
        
	  	$filter 	= ".mov" ;					// supporte file types:        
		$filter2 	= ".m4v" ;   

       	$it = new RecursiveDirectoryIterator("$directory");		// search for stuff @ content
  
		                   	
		foreach(new RecursiveIteratorIterator($it) as $file)  		// start the loop for supported file types:                
		{
		if (!((strpos(strtolower($file), $filter)) === false))
			{
		$items[] = preg_replace("#\\\#", "/", $file);
		$cannes = $filter;
			}
		if (!((strpos(strtolower($file), $filter2)) === false))
			{
		$items[] = preg_replace("#\\\#", "/", $file);
		$cannes = $filter2;
			}
		}
		rsort($items);
		foreach($items as $item)
	{

		$title = explode('/', $item);   				// cut the path at "/"

 						
		$m4v_to_jpg = preg_replace("/\.m4v/",".jpg", $item);
		$mov_to_jpg = preg_replace("/\.mov/",".jpg", $m4v_to_jpg); 
 		$jpg = $mov_to_jpg;

		$spaces 	= preg_replace("/\//"," / ", $jpg); 		// path with spaces
		$what 		= preg_replace("/\.jpg/","", $spaces); 		// path with spaces and without ".jpg"

		$content 	= $title[1];							
		$base 		= $title[2];  
		$home 		= $title[3];  
		$names 		= $title[4]; 
		$movies 	= $title[5];  
		$more	 	= $title[6]; 


		$movie_numbers 	= explode('_', $movies);
		$movienumbers 	= $movie_numbers[1];							// without numbers
		$movienumbers 	= preg_replace("/\.mov/","", $movienumbers); 	// without .mov
		$movienumbers 	= preg_replace("/\.m4v/","", $movienumbers); 	// without .m4v 
		$movienames  	= $movienumbers;								// clean movie names

  
	echo 
	"
	$item |||||||| only for testing 
	
	<!-- MOVIE ITEM -->	<div class=\"movitem\">
	<!-- HV LOG -->		<div class=\"hvlog\">

	<!-- AGENT --> 		<div style=\"display:none;\">$base</div>
	<!-- MOV -->            <a  id=\"thumpy_".rand(10, 20)."\" href=\"". $item ."\" rel=\"enclosure\"  class=\"{width: '900', height: '350', kioskmode: 'false', showlogo: 'false'}\">
	<!-- IMG --> 		<img class=\"picts\" src=\"$jpg\" title=\"$base / $home / $names\">
	
	<!-- DOP/DIRECTOR -->	<div class=\"kind_name\">$names</div>
	<!-- MOVIE NAME -->	<div class=\"movie_name\">$movienames</div></a>	" . /* $base $home $names $movienames  <!-- $jpg $item --> ✈ */ "
				<br>	

				</div>
				</div>";
	
	}
		

	?>
	
   
	
			
<?php 
/*												// 	from the to directory:	
 		echo  "0: " .$title[0] ."/<br>"; 						// 	CONTENT/
		echo  "1: " .$title[1] ."/<br>"; 						// 	THE AGENT
		echo  "2: " .$title[2] ."/<br>"; 						// 	DOP, DIRECTOR or CONTACT
		echo  "3: " .$title[3] ."/<br>"; 						// 	SURNAMES LASTNAMES
		echo  "4: " .$title[4] ."<br>"; 						// 	MOVIE TITLES
    		echo  "5: " .$title[5] ."/<br>"; 						// 	WWW ? OTHER STUFF
     		echo  "JPG: " .$jpg. "<br>"; 							// 	the JPG´s
		echo "MOVIE: " .$item. "<br><br>";                    	//	the movies
		$new = htmlspecialchars("$seven", ENT_QUOTES);

*/		
?>
