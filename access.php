<?php
	$file = 'config.json';

	if ($_POST['obj']) {
		$data = $_POST['obj'];

		file_put_contents($file, $data);

		print_r(file_get_contents($file));
	}
?>