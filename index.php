<?php
define("C2STATS", true);
include 'includes/config.php';

//accès via mot de passe (définition du mdp dans config.php)
if(isset($_POST['password'])){

	if($_POST['password'] !== $C2STATS['mot_de_passe'])
		echo '<p style="color:red">Mot de passe incorrect</p>';
	else
		$acces = true;
}
if(!isset($acces)){
	echo '<form method="post">';
		echo '<input type="password" name="password">';
		echo '<input type="submit" name="C\'est parti !">';
	echo '</form>';
	exit("Connexion requise");
}
// /accès via mot de passe


include 'includes/fonctions.php';
?><!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8">
	<title>C2stats - <?= $_SERVER['HTTP_HOST'] ?></title>
	<link rel="stylesheet" href="css/style.css">
	<script src="js/jquery.js"></script>
	<script src="js/app.js"></script>
</head>
<body>

<h1>Statistiques du site <?= $_SERVER['HTTP_HOST'] ?></h1>
<p>Cliquez les textes avec 🖱 pour les déployer.</p>

<div id="c2stats">

	<!-- statistiques d'aujourd'hui -->
	<h2 class="slideToggle cursor_help" onclick="getStatsJour('<?= date('Y') ?>', '<?= date('m') ?>', '<?= date('d') ?>', true);removeOnclick(this)">Aujourd'hui</h2>
	<ul style="display:none" id="jq_stats_aujourdhui"></ul>
	
	<!-- affichages des archives -->
	<h2>Archives</h2>
	<?php
	$nb = 0;
	$annees = scandir('txt/archives/');
	foreach($annees as $annee){
		
		if(!ctype_digit($annee))
			continue;
			
		$moiss = scandir('txt/archives/' . $annee . '/');
		
		echo "<h2 class='slideToggle cursor_help'>$annee</h2>";
		
		echo "<ul style='display:none'>";
		foreach($moiss as $mois){
			
			if(!ctype_digit($mois))
				continue;
			
			echo '<h3 class="slideToggle cursor_help" onclick="deployerMois(\'' . $annee . '\',\'' . $mois . '\');removeOnclick(this)">' . date_mois_fr($mois) . '</h3>';
			$nb ++;
			
			echo "<li class='nolist' style='display:none'>";
			
				echo '<ul id="jq_statistiques_mois_' . $annee . '-' . $mois . '-0"></ul>';
				
			echo "</li>";
		}
		echo "</ul>";
	}
	if($nb == 0)
		echo '<p>Aucune</p>';
	?>
</div>
</body>
</html>