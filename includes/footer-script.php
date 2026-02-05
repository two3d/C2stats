<?php
//on sécurise l'accès direct à cette page
if(!defined("C2STATS"))
	exit;

/*
* ce fichier doit être inclus dans le footer de votre site (toutes les pages)
* il enregistre le passage des visiteurs, des robots et des partages sur les réseaux sociaux
*/

if(!function_exists('htmlent')){
	function htmlent($texte){
		return htmlentities($texte, ENT_QUOTES, "UTF-8");
	}
}

$vd = "[not set HTTP_REFERER]";
if(preg_match("#^https?:\/\/(?:(?:www\.)?[-\w]+(?:\.[-\w]+){0,}\.[a-z]{1,})(?:(?:\/[\#%\-\?&=\w\.@\+]+){0,}){0,}\/?#i", $_SERVER['HTTP_REFERER'] ?? '', $match))
	$vd = htmlent($match[0]);

$ip = $_SERVER['REMOTE_ADDR'] ?? "[not set REMOTE_ADDR]";
$ua = $_SERVER['HTTP_USER_AGENT'] ?? "[not set HTTP_USER_AGENT]";
$su = $_SERVER['REQUEST_URI'] ?? "[not set REQUEST_URI]";

$contenu_ligne = implode("@;@", [
	htmlent($ip),
	htmlent($ua),
	htmlent($su),
	$vd
]);

$fichier = dirname(__DIR__) . '/txt/ips/' . date("H") . '.txt';
file_put_contents($fichier, $contenu_ligne . "\n", FILE_APPEND | LOCK_EX);