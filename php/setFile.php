<?php
    $newHTML = $_POST["htmlData"];
	$title = $_POST["title"];
    if (empty($newHTML)) {
        echo "No html data";
    }   else    {
    	$oldFile = file_get_contents("../file.html");
    	$saveFileNum = file_get_contents("../oldFiles/saveNum.txt");
    	$saveFileNum++;
    	file_put_contents("../oldFiles/saveNum.txt",$saveFileNum);
    	file_put_contents("../oldFiles/file-" . $saveFileNum . ".html",$oldFile);
    	file_put_contents("../file.html",$newHTML);
		$wrappedHTML = 
"<html>
	<head>
		<link rel='stylesheet' href='css/fileDisplay.css'></link>
		<script src='js/fileDisplay.js'></script>
	</head>
	<body>
		<h1 id='title'>$title</h1>
		<div id='centerBlock'>
			<div id='centerContent'>
				<div id='bookmarkWrapper'>
					<!--
					<div id='bookmarkCont'>
						<h4>Jump to</h4>
						<ul>
							<a href=''><li>...</li></a>
						</ul>
					</div>
					-->
				</div>
				<div id='wrapper'>
					<div id='container'>


". $newHTML . "


</div>
				</div>
			</div>
		</div>
	</body>
</html>";
		file_put_contents("../index.html",$wrappedHTML);
    	echo "Project file saved";
    }
?>