<?php
/*
* sauvegarde les stats d'aujourd'hui et les met dans le dossier txt/archives/aaaa/mm/jj.txt
* si c'est le 1er du mois, on envoi les nouveaux USER_AGENT trouvés par mail afin de mettre à jour le script
*/
define("C2STATS", true);
include dirname(__DIR__) . '/includes/config.php';

//récupére la date d'hier pour créer le dossier si ya un nouveau mois ou année
$hier   = mktime(0, 0, 0, date("m"), date("d") - 1, date("Y"));
$annee  = date("Y", $hier);
$mois   = date("m", $hier);
$jour   = date("d", $hier);
$chemin_mois = dirname(__DIR__) . '/txt/archives/' . $annee . '/' . $mois . '/';
$chemin_jour = $chemin_mois . '/' . $jour . '/';




//on rassemble les statistiques de chaque heure de la journée
$lignes = [];
$fichiers_txt = glob(dirname(__DIR__) . '/txt/ips/*.txt');

foreach($fichiers_txt as $fichier_txt){
	
	$lignes_fichier = file($fichier_txt, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	
	foreach($lignes_fichier as $ligne_fichier){
		
		$heure = (int) basename($fichier_txt, '.txt');
		
		$lignes[$heure][] = $ligne_fichier;
		
	}
	
	//vide le fichier de cette heure
	file_put_contents($fichier_txt, '', LOCK_EX);
	
}

//creation du dossier /année/mois/jour/
// if(count($lignes) > 0 && !file_exists($chemin_jour))
if(!file_exists($chemin_jour))
	mkdir($chemin_jour, 0755, true);

//creation des txt de statistiques de chaque heure d'hier
foreach($lignes as $heure => $lignes_heure)
	file_put_contents($chemin_jour . '/' . $heure . '.txt', implode("\n", $lignes_heure));


//chaque 1er du mois, on boucle tous les jours enregistrés
//on met dans le fichier les nouveaux trouvés
if(date('j') == 1){
	
	include dirname(__DIR__) . '/includes/fonctions.php';
	
	//init
	$_array = [
		'news_bots' => [],
		'news_user_agent' => [],
	];
	
	$dossiers_jours = glob($chemin_mois . '/*', GLOB_ONLYDIR);
	
	foreach($dossiers_jours as $dossier_jour){
		
		$jour = basename($dossier_jour);
		
		if(!ctype_digit($jour))
			continue;
		
		$array = scanner_jour($annee, $mois, $jour);
		
		$_array['news_user_agent'] = array_merge($_array['news_user_agent'], $array['array']['news_user_agent']);
		$_array['news_bots'] = array_merge($_array['news_bots'], $array['array']['news_bots']);
		
	}
	
	//Supprime les doublons
	$_array['news_user_agent'] = array_unique($_array['news_user_agent']);
	$_array['news_bots'] = array_unique($_array['news_bots']);
	
	//insère les nouveaux
	if(count($_array['news_user_agent']) > 0)
		insererNouveauxUA($_array['news_user_agent']);
	
	if(count($_array['news_bots']) > 0)
		insererNouveauxUA($_array['news_bots']);
	
	
	//on vérifie que les nouveaux n'ont pas déjà été envoyé en vérifiant dans nouveaux-deja-envoyes.txt
	$arr_nouveaux_ua = file(dirname(__DIR__) . '/txt/listes/nouveaux-ua.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	
	$nouv_arr_ua = [];
	foreach($arr_nouveaux_ua as $ua)
		$nouv_arr_ua[trim($ua)] = 1;
	
	
	//while des déjà envoyés pour pas les renvoyer
	foreach($nouv_arr_ua as $ua => $num){
		
		$file = file(dirname(__DIR__) . '/txt/listes/nouveaux-deja-envoyes.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		
		foreach($file as $ua1){
			
			if(stristr($ua, trim($ua1)))
				unset($nouv_arr_ua[$ua]);
			
		}
	}
	
	$liste_nouveaux_ua = [];
	foreach($nouv_arr_ua as $ua => $num)
		$liste_nouveaux_ua[] = $ua;
		

	//Envoi du mail si il y en a des nouveaux
	if(count($liste_nouveaux_ua) > 0){
		
		//stock les UA envoyé pour pas renvoyer les même le mois prochain
		file_put_contents(
			dirname(__DIR__) . '/txt/listes/nouveaux-deja-envoyes.txt',
			implode("\n", $liste_nouveaux_ua) . "\n",
			FILE_APPEND|LOCK_EX
		);
		
		//on envoi les deux mails
		if(trim($C2STATS['mail']) != ''){
			
			$messageMSG = "<h1>Nouveaux USER_AGENT détectés depuis <b>{$C2STATS['nom_site']}</b> :</h1>";
			$messageMSG .= implode("<br>", $liste_nouveaux_ua);
			
			$enteteMSG = "MIME-Version: 1.0\r\n";
			$enteteMSG .= "Content-type: text/html; charset=UTF-8\r\n";
			$enteteMSG .= "From: C2stats <{$C2STATS['mail']}>\r\n";
			mail($C2STATS['mail'],'Nouveaux Bots et UA', $messageMSG, $enteteMSG);
		
		}
		
		//on vide le fichier
		file_put_contents(dirname(__DIR__) . '/txt/listes/nouveaux-ua.txt', '');
	}
}