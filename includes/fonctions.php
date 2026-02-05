<?php if(!defined("C2STATS")) exit;//on sécurise l'accès à cette page
function infos_ua($user_agent){
	global $iteration;
	
	$iteration = 0;
	$chemin = dirname(__DIR__);
	
	/**Notes et références utilisées:
	Pour les robots j'ai utilisé la database sur ce site: https://user-agents.net/bots
	Pour les navigateurs et la détection du mobile, j'ai lu la doc de Mozilla: https://developer.mozilla.org/fr/docs/Web/HTTP/Detection_du_navigateur_en_utilisant_le_user_agent
	*/
	
	$strtolower_user_agent = strtolower($user_agent);
	
	
	//ROBOTS
	$robot = '';
	$file = file($chemin . "/txt/listes/bots.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	foreach($file as $ligne){
		
		$ligne = trim($ligne);
		$strtolower_ligne = strtolower($ligne);
		$iteration ++;
		
		if(stristr($strtolower_user_agent, $strtolower_ligne)
		|| stristr($strtolower_user_agent, str_replace(' ','-', $strtolower_ligne))){
			
			$robot = $ligne;
			break;
			
		}
	}
	
	//NAVIGATEURS
	$navigateur='';
	$types = [
		
		//nom dans l'USER_AGENT VS nom mieux compréhensible
		
		'Mobile DuckDuckGo' => 'DuckDuckGo Mobile',
		
		'DoCoMo' => 'DoCoMo',
		
		'SEMC' => 'SEMC (SonyEricsson)',
		
		'UC Browser' => 'UC Browser (Navigateur mobile)',
		
		'NetFront' => 'NetFront',
		
		'Samsung Internet' => 'Samsung Internet (Chromium)',
		
		'SamsungBrowser' => 'Samsung Browser',
		
		'YaBrowser' => 'Yandex Browser',
		
		'HeadlessChrome' => 'Samsung Internet (Chromium)',
		
		'ZuneWP7' => 'Zune (Windows Phone 7)',
		
		'NetSurf' => 'NetSurf',
		
		'PlayStation' => 'PlayStation',
		
		'Arora' => 'Arora',
		
		'MessengerDesktop' => 'Facebook (Messenger Desktop)',
		
		'[FB' => 'Facebook',
		
		'AppleWebKit' => 'Safari (AppleWebKit)',
		
		
		
		'Edg' => 'Microsoft Edge (Chromium)',
		
		'Chrome' => 'Chrome',
		
		'Firefox' => 'Firefox',
		
		'MSIE' => 'MSIE',
		
		'Trident' => 'MSIE',
		
		'SeaMonkey' => 'SeaMonkey',
		
		'Chromium' => 'Chromium',
		
		'Safari' => 'Safari',
		
		'Presto' => 'Opera Presto',
		
		'Opera Mini' => 'Opera Mini',
		
		'Opera' => 'Opera',
		
		'OPR' => 'Opera',
		
		'Mozilla' => 'Firefox',
		
	];
	//L'ordre de recherche des navigateurs (array('Chrome'=>'Chrome','Firefox'=>...) est défini pour trouvé le bon nom du navigateur car plusieurs nom peuvent être indiqués dans l'ua, ex: Chrome/ver Safari/ver Edge/ver, la doc mozilla précise que si certains nom sont avant certains autres, ça définit le vrai nom du navigateur. à ne pas toucher, sauf cas contraire ;)
	
	foreach($types as $type => $nom){
		
		$iteration ++;
		//preg_match("#(?:FB(?:[A-Z]{2}|_))#",
		
		if(stristr(strtolower($user_agent), strtolower($type))){
			
			$navigateur = $nom;
			break;
			
		}
	}
	
	//OS
	$os = '';
	$types = [
		'Windows',
		'Linux',
		'Mac',
		'Android',
		'X11',// serveur d'affichage X11, couramment utilisé sur les systèmes Linux
		'SymbianOS',
		'MeeGo',
	];
	
	foreach($types as $type){
		
		$iteration ++;
		
		if(stristr($user_agent, $type)){
			
			$os = $type;
			break;
			
		}
	}
	
	//SI MOBILE
	$mobile = false;
	$types = [
		'Mobi',
		'Android',
		'Nokia'
	];
	
	foreach($types as $type){
		
		$iteration ++;
		
		if(stristr($user_agent, $type)){
			
			$mobile = true;
			break;
			
		}
	}
	
	//RESEAUX SOCIAUX
	$rs = '';
	$file = file($chemin . "/txt/listes/reseaux-sociaux.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	
	foreach($file as $ligne){
		
		$iteration ++;
		
		$ligne = trim($ligne);
		
		if(stristr($user_agent, $ligne)){
			
			$rs = $ligne;
			break;
			
		}
	}
	
	if($robot == '' && $rs == ''){
		
		//si il trouve "bot" dans user_agent mais qu'il correspond à aucun précédent, on le nomme [nouveau bot] pour ensuite le récupérer facilement dans le script
		if(stristr($user_agent, 'bot')
		|| stristr($user_agent, 'spider')
		|| stristr($user_agent, 'crawl'))
			$robot = '[nouveau bot]';
		
	}
	return [
		'robot' => $robot,
		'navigateur' => $navigateur,
		'os' => $os,
		'mobile' => $mobile,
		'rs' => $rs,
		'iteration' => $iteration,
	];
	
}
function insererNouveauxUA($uas){
	
	$chemin = dirname(__DIR__);
	$insert_uas = [];
	
	//on vérifie si cet UA n'est pas déjà inséré
	foreach($uas as $ua){
		
		$trouve = false;
		$file = file($chemin . "/txt/listes/nouveaux-ua.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		
		foreach($file as $ligne){
			
			$ligne = trim($ligne);
			
			if(stristr($ua, $ligne)){
				
				$trouve = true;
				break;
				
			}
		}
		if(!$trouve)
			$insert_uas[] = $ua;
		
	}
	if(count($insert_uas) > 0)
		file_put_contents($chemin . "/txt/listes/nouveaux-ua.txt", implode("\n", $insert_uas) . "\n", FILE_APPEND | LOCK_EX);
}

function c2fleches($value, $a_value){
	
	if($value > $a_value) return 'plus';
	elseif($value == $a_value) return 'egal';
	elseif($value < $a_value) return 'moins';
	
}

function scanner_jour($annee, $mois, $jour): array{
	global $C2STATS;
	
	//sont toutes valeurs integer
	//les variables avec (nom)_t indiquent "total"
	$int = [
		'pagesvues_visiteurs_t' => 0,
		'pagesvues_robots_t' => 0,
		'pagesvues_rs_t' => 0,
		'visiteurs_uniques_t' => 0,
		'visiteurs_sur_mobile_t' => 0,
		'robots_t' => 0,
	];
	
	//plusieurs variables tableaux rassemblées dans un seul, pour faire moins fouillis
	$array = [
		'bots' => [],
		'news_bots' => [],
		'news_user_agent' => [],
		'sites' => [],
		'navigateurs' => [],
		'os' => [],
		'robots_t' => [],
		'pages_visiteurs' => [],
		'pages_robots' => [],
		'pages_rs' => [],
		'heures' => [],
	];
	
	//sert à compter les visiteurs unique
	$ips = [];
	
	
	//on récupère les infos de chaque heure d'aujourd'hui
	if($jour == 'aujourdhui'){
		
		$fichiers_txt = glob(dirname(__DIR__) . '/txt/ips/*.txt');
	
	//on récupère les infos de chaque heure de la journée demandée
	}else{
		
		$fichiers_txt = glob(dirname(__DIR__) . '/txt/archives/' . $annee . '/' . $mois . '/' . $jour . '/*.txt');
		
	}
	
	$lignes = [];
	foreach($fichiers_txt as $fichier_txt){
		
		$lignes_fichier = file($fichier_txt, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		
		$heure = (int) basename($fichier_txt, '.txt');
		
		foreach($lignes_fichier as $ligne_fichier)
			$lignes[$heure][] = $ligne_fichier;
		
	}
	
	foreach($lignes as $heure => $lignes_heure){
		
		$nbr_cette_heure = count($lignes_heure);
		
		//si on boucle les jours de ce mois, on fait un total de cette heure
		// if(!isset($array['heures'][$heure])){
			
			$array['heures'][$heure] = $nbr_cette_heure;
			
		// }else{
			
			// $array['heures'][$heure] += $nbr_cette_heure;
			
		// }
		
		foreach($lignes_heure as $ligne_heure){
			
			$bloc1 = explode("@;@", $ligne_heure);
			$bloc = [
				'ip' => $bloc1[0],//IP
				'ua' => $bloc1[1],//User agent
				'page' => $bloc1[2],//page visitée
				'referer' => trim($bloc1[3], '/'),//referer (enlève la fin de l'url "/" pour l'esthétique)
			];
			
			$infos_ua = infos_ua($bloc['ua']);

			if($infos_ua['mobile'] && $infos_ua['robot'] == '')
				$int['visiteurs_sur_mobile_t'] ++;
			
			//si aucun robot, aucun reseau social et aucun system d'exploitation est détecté, on enregistre ce nouveau user_agent pour l'afficher dans les "nouveaux" et ensuite l'analyser manuellement
			if($infos_ua['robot'] . $infos_ua['rs'] . $infos_ua['os'] == ''){
				
				if(!in_array($bloc['ua'], $array['news_user_agent'])){
					
					//on vérifie que ce bot ne soit pas ignoré, si non, on l'affiche dans la liste "nouveaux"
					$ignore = '';
					
					$filei = file(dirname(__DIR__) . "/txt/listes/ignores.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
					
					foreach($filei as $lignei){
						
						$lignei = trim($lignei);
						$infos_ua['iteration'] ++;
						
						if(preg_match("#$lignei#", $bloc['ua'])){
							
							$ignore = $lignei;
							break;
							
						}
					}
					if($ignore == '')
						$array['news_user_agent'][] = $bloc['ua'];
					
				}
			}
			//LES ROBOTS
			if($infos_ua['robot'] != ''){
				
				//ajoute les news bots
				if($infos_ua['robot'] == '[nouveau bot]'
				&& !in_array($bloc['ua'], $array['news_bots']))
					$array['news_bots'][] = $bloc['ua'];
				
				$int['pagesvues_robots_t'] ++;
				
				$insert_bot = '<b>' . $infos_ua['robot'] . '</b> - ' . $bloc['ua'];
				
				//ajoute les bots
				if(!in_array($insert_bot, $array['bots']))
					$array['bots'][] = $insert_bot;
				
				if(!in_array($bloc['ua'], $array['robots_t'])){
					
					$array['robots_t'][] = $bloc['ua'];
					$int['robots_t'] ++;
					
				}
				if(!array_key_exists($bloc['page'], $array['pages_robots'])){
					
					//on enregistre le fait que cette page à été vue
					$array['pages_robots'][$bloc['page']] = [
						'vues' => 1,
						'robots' => [
							$infos_ua['robot']
						]
					];
					
				}else{
					
					//on compte le nombre de fois que cette à été vue
					$array['pages_robots'][$bloc['page']]['vues'] ++;
					
					if(!in_array($infos_ua['robot'], $array['pages_robots'][$bloc['page']]['robots']))
						$array['pages_robots'][$bloc['page']]['robots'][] = $infos_ua['robot'];
					
				}
				
			//LES PAGES PARTAGEES SUR LES RESEAUX SOCIAUX
			}elseif($infos_ua['rs'] != ''){
				
				$int['pagesvues_rs_t'] ++;
				
				//on ajoute le nom du reseau
				if(!array_key_exists($infos_ua['rs'],$array['pages_rs'])){
					
					//on ajoute la page visité par ce reseau
					$array['pages_rs'][$infos_ua['rs']] = [
						'vues' => 1,
						'pages' => [
							$bloc['page'] => 1
						]
					];
				
				}else{
					
					//total de fois que ce réseau à vue le site
					$array['pages_rs'][$infos_ua['rs']]['vues'] ++;
					
					//si cette page n'est pas enregistrée, on l'ajoute
					if(!array_key_exists($bloc['page'], $array['pages_rs'][$infos_ua['rs']]['pages'])){
						
						//ajout de la page
						$array['pages_rs'][$infos_ua['rs']]['pages'][$bloc['page']] = 1;
						
					}else{
						
						//on compte le total de fois vue de cette page
						$array['pages_rs'][$infos_ua['rs']]['pages'][$bloc['page']] ++;
						
					}
				}
			
			}else{
				
				//LES VISITEURS
				$int['pagesvues_visiteurs_t'] ++;
				
				if(!in_array($bloc['ip'], $ips)){
					
					$ips[] = $bloc['ip'];
					$int['visiteurs_uniques_t'] ++;
				
				}
				
				if(!array_key_exists($bloc['page'], $array['pages_visiteurs']))
					$array['pages_visiteurs'][$bloc['page']] = 1;
				
				else
					$array['pages_visiteurs'][$bloc['page']] ++;
				
				
				//NAVIGATEURS
				if($infos_ua['navigateur'] != ''){
					
					if(!array_key_exists($infos_ua['navigateur'], $array['navigateurs'])){
						
						$array['navigateurs'][$infos_ua['navigateur']] = [
							'vues' => 1
						];
						
					}else{
						
						$array['navigateurs'][$infos_ua['navigateur']]['vues'] ++;
						
					}
				}
				
				//OS
				if($infos_ua['os'] != ''){
					
					if(!array_key_exists($infos_ua['os'], $array['os'])){
						
						$array['os'][$infos_ua['os']] = [
							'vues' => 1
						];
						
					}else{
						
						$array['os'][$infos_ua['os']]['vues'] ++;
						
					}
				}
			}
			
			//SITES REFERANTS (seulement si c'est un vrai visiteur et pas un robot)
			if($infos_ua['robot'] == ''){
				
				if(!array_key_exists($bloc['referer'], $array['sites'])){
					
					$array['sites'][$bloc['referer']] = [
						'vues' => 1
					];
					
				}else{
					
					$array['sites'][$bloc['referer']]['vues'] ++;
					
				}
			}
		}
	}
	return [
		'int' => $int,
		'array' => $array,
	];
}
function date_mois_fr($mois){
	
	if($mois == "January" || $mois==1) return "Janvier";
	elseif($mois == "February" || $mois==2) return "Février";
	elseif($mois == "March" || $mois==3) return "Mars";
	elseif($mois == "April" || $mois==4) return "Avril";
	elseif($mois == "May" || $mois==5) return "Mai";
	elseif($mois == "June" || $mois==6) return "Juin";
	elseif($mois == "July" || $mois==7) return "Juillet";
	elseif($mois == "August" || $mois==8) return "Août";
	elseif($mois == "September" || $mois==9) return "Septembre";
	elseif($mois == "October" || $mois==10) return "Octobre";
	elseif($mois == "November" || $mois==11) return "Novembre";
	elseif($mois == "December" || $mois==12) return "Décembre";
	return $mois;
}
function rajouterZero($i){
	return $i < 10 ? '0' . $i : $i;
}