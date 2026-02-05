<?php

// Ici vous pouvez sécuriser l'accès à cette page que pour les administrateurs, à adapter avec votre système de vérification des utilisateurs


if(!isset($_POST['type'], $_POST['annee'], $_POST['mois']))
	exit("Parametres requis");

if(!preg_match("#^[0-9]{4}$#", $_POST['annee'])
|| !preg_match("#^[0-9]{2}$#",$_POST['mois']))
	exit("Parametres incorrects.");

	//pour compter les itérations, mettre ceci en début de fichier
	// $time_start = microtime(true);
	//puis cela en fin de fichier
	// $time_end = microtime(true);
	// $time = round($time_end - $time_start, 4);
	// <p>Résultats générés en $time secondes.<br>$iterations itérations</p>

//inclusions des fichiers nécessaires
define("C2STATS", true);
include dirname(__DIR__) . '/includes/config.php';
include dirname(__DIR__) . '/includes/fonctions.php';


$annee = $_POST['annee'];
$mois = $_POST['mois'];

//vérifie si ce mois existe dans les archives
if($_POST['type'] == 'deployer_mois'){
	
	$date = $annee . '/' . $mois;
	
	if(!file_exists(dirname(__DIR__) . '/txt/archives/' . $date . '/'))
		exit(json_encode(['ok' => "Il n'existe pas de stats pour cette date : $date"]));
	
	echo json_encode(['ok' => 'ok']);

}

//vérifie si ce jour existe dans les archives
if($_POST['type'] == 'deployer_jour'){
	
	if(!preg_match("#^[0-9]{2}$#", $_POST['jour'] ?? ''))
		exit(json_encode(['ok' => "Parametre jour requis ou incorrect."]));
	
	$jour = $_POST['jour'];
	
	$voir_aujourdhui = $annee == date('Y') && $mois == date('m') && $jour == date('d');
	
	$scanned_day = scanner_jour($annee, $mois, $voir_aujourdhui ? 'aujourdhui' : $jour);
	
	//si il existe un jour suivant, on l'envoi pour l'ajouter au stats
	$jour_suivant = false;
	if(!$voir_aujourdhui){
		
		$jour_suivant = file_exists(dirname(__DIR__) . '/txt/archives/' . $annee . '/' . $mois . '/' . rajouterZero($jour + 1) . '/')
			? rajouterZero($jour + 1)
			: false;
		
		$date = $annee . '/' . $mois . '/' . $jour;
	
		if(!file_exists(dirname(__DIR__) . '/txt/archives/' . $date . '/'))
			exit(json_encode(['ok' => "Il n'existe pas de stats pour cette date : $date"]));
		
	}
	
	echo json_encode([
		'ok' => 'ok',
		'jour_suivant' => $jour_suivant,
		'array' => $scanned_day['array'],
		'int' => $scanned_day['int'],
	]);
	
}