<?php
	if ($_POST['obj']) {
		$handle = fopen('./config.json', 'w');

		print_r($_POST['obj']);

		fwrite($handle, stripslashes($_POST['obj']));
	}
?>