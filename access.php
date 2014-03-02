<?php
	if($_POST['obj']) {
		$handle = fopen('./config.json', 'w');

		fwrite($handle, stripslashes($_POST['obj']));
	}
?>