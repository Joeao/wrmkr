<?php
	var putObj = function($obj) {
		$handle = fopen('./config.json', 'w');

		fwrite($handle, stripslashes($obj));
	}

	if($_GET['request'] == 'putObj' && isset($_POST['obj'])) {
		putObj($_POST['obj']);
	}
?>