<?php
	var putObj = function($obj) {
		$handle = fopen('./config.json', 'w');

		fwrite($handle, stripslashes($obj));
	}

	if($_POST['obj']) {
		putObj($_POST['obj']);
	}
?>