
<?php 
$𓅇	= 'https://'.$_SERVER['HTTP_HOST'].'/tarot/';
 ?>
<link  			href="./css/style.css" 	rel="stylesheet" 	type="text/css">		

 
			<script src="<?=$𓅇?>js/jquery-3.4.1.js">			</script>										

	
			<script src="<?=$𓅇?>js/jquery-ui.js">				</script>	 



			
<table>
	<?php 
$i = 1;

	 ?>
<tr>	
							<td>	&nbsp;					 			</td>
		
							<td 	class="size" <?=$i++?> id =	"play<?=$i?>"			>	

<a href="4stop.php">stop1</a>
							<script>
								$(document).ready(function () {
        $('#play<?=$i?>').click(function(){
            $('#play<?=$i?>').load( '477.php' );
        });});

							</script>


							</td>					
		
							<td>	&nbsp;								</td>
</tr>
 <tr>	
							<td 	class="size" <?=$i++?> id =	"play<?=$i?>"			>	

<a href="4stop.php">stop</a>
							<script>
								$(document).ready(function () {
        $('#play<?=$i?>').click(function(){
            $('#play<?=$i?>').load( '477.php' );
        });});

							</script>


							</td>					
		
							<td 	class="size" <?=$i++?> id =	"play<?=$i?>"			>	

<a href="4stop.php">stop</a>
							<script>
								$(document).ready(function () {
        $('#play<?=$i?>').click(function(){
            $('#play<?=$i?>').load( '477.php' );
        });});

							</script>


							</td>					
		
							<td 	class="size" <?=$i++?> id =	"play<?=$i?>"			>	

<a href="4stop.php">stop</a>
							<script>
								$(document).ready(function () {
        $('#play<?=$i?>').click(function(){
            $('#play<?=$i?>').load( '477.php' );
        });});

							</script>


							</td>					
</tr>
 <tr>	
 							<td>	&nbsp;					 			</td>
		
							<td 	class="size" <?=$i++?> id =	"play<?=$i?>"			>	

<a href="4stop.php">stop</a>
							<script>
								$(document).ready(function () {
        $('#play<?=$i?>').click(function(){
            $('#play<?=$i?>').load( '477.php' );
        });});

							</script>


							</td>					
		
							<td>	&nbsp;								</td>
</tr>

</table>

					