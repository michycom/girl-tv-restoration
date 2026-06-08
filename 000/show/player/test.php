<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
	<head>
    <title>lets play - hopefully</title>
		
    <!-- player stuff -->
    <!-- <link rel='stylesheet' type='text/css' media='all' href='css/screen.css' /> -->
	<link rel='stylesheet' type='text/css' media='all' href='css/jquery.qtc.css' />
	<link rel='stylesheet' type='text/css' media='all' href='css/tims.css' />

	<!-- js -->
	<script type="text/javascript" src="http://prague.drivenbycreatives.com/player/javascripts/AC_QuickTime.js"> </script>
	<script type="text/javascript" src="http://prague.drivenbycreatives.com/code/js/jquery-1.4.2.min.js"></script>
	<script type="text/javascript" src="http://prague.drivenbycreatives.com/player/javascripts/jquery.qtc.js"></script>
        
    <script type="text/javascript">
        
        $(document).ready(function() {

            $('div').click(function(event) {
            
                //stopMovie(); 

            
                var ineedIDs = $(this).attr('class'); // getting id of focussed element
                
                alert('you clicked the element: '+ineedIDs);
                
                //$('.qtc_movie_container').hide();
            
                $('#'+ineedIDs+'_clip').qtc(); // aufruf des players -> 
                
                //$('.'+ineedIDs).hover(function(){$('.qtc_movie_container').unwrap();});            
                $('.close').fadeIn(700);
                $('.qtc_movie_container').fadeIn(900);


                
            });
            
            $('.close').click(function() {
                
                //$('embed').html(' ');$('object').html(' ');  
                $('div').removeClass('qtc_movie');
                $('.qtc_movie_container').fadeOut(900);
          
            
                
            });
            
        });
  
  
  
               
    </script>
        
        


	</head>

	<body>
	

	
	
	<!-- click divs-->
	
	<div class="movie1"><img src="" />this is a div with class=movie1 containing an a id=movie1 <br></div>
	
	<div class="movie2"><img src="" />this is a div with class=movie2 containing an a id=movie2 <br></div>	


       <span class="play"><p class="close">X</p>
            <a id="movie1_clip" href="http://prague.drivenbycreatives.com/content/4movies/graf/dop/lutz%20hattenhauer/siemens%20healthcare.mp4"></a>
        </span>	
	
       <span class="play"><p class="close">X</p>
            <a id="movie2_clip" href="http://girl.tv/000/show/filme/aleksander%20bach/1_Marlboro%20by%20Aleksander%20Bach.m4v"></a>
 	  </span>
	

    
<!--     <div id="show">must go on</div> -->



	
    <? //include ('recursive-player.php'); ?>
    


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	</body>
	
	
	
	
	
	
	
	
	
	
	
	
	
	
</html>
