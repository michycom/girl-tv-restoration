
<?php 
$𓅇	= 'https://'.$_SERVER['HTTP_HOST'].'/tarot/';
 ?>
<link  			href="./css/style.css" 	rel="stylesheet" 	type="text/css">		

 
			<script src="<?=$𓅇?>js/jquery-3.4.1.js">			</script>										

	
			<script src="<?=$𓅇?>js/jquery-ui.js">				</script>	 



			
<table>
<tr>	
							<td>	&nbsp;					 			</td>
		
							<td>	<?php include '477.php';?>			</td>	
		
							<td>	&nbsp;								</td>
</tr>
 <tr>	
 							<td>	<?php include '477.php';?>			</td>
		
							<td 	id =	"play"			>	

<a href="4stop.php">stop</a>
							<script>
								$(document).ready(function () {
        $('#play').click(function(){
            $('#play').load( '477.php' );
        });});

							</script>


							</td>					
		
							<td>	<?php include '477.php';?>			</td>
</tr>
 <tr>	
 							<td>	&nbsp;					 			</td>
		
							<td>	<?php include '477.php';?>			</td>
		
							<td>	&nbsp;								</td>
</tr>

</table>

					