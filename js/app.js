let DATA_STATS = {};

function formatHour(heure) {
	//créer une nouvelle date avec l'heure donnée et minutes, secondes à 0
	const date = new Date();
	date.setHours(heure);
	date.setMinutes(0);
	date.setSeconds(0);
	
	//formater l'heure en 12h avec AM/PM
	const options = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	};
	
	// Formater l'heure
	return date.toLocaleString('en-US', options);
}
function getNom(annee, mois, jour = 0, afficher_aujourdhui = false){
	return annee + '-' + mois + '-' + jour + (afficher_aujourdhui ? '-aujourdhui' : '');
}
function setSelectorName(s, nom){
	return 'jq_' + s + '_' + nom;
}
function getSelectorName(s, nom, type){
	return `${type !== false ? (type == 'class' ? '.' : '#') : ''}jq_${s}_${nom}`;
}
function afficherSqueletteStats(annee, mois, jour = 0, afficher_aujourdhui = false, afficher_jour = false){
	
	nom = getNom(annee, mois, jour, afficher_aujourdhui);
	
	let squelette = ''
	
	if(!afficher_aujourdhui){
		
		if(jour == 0){
			
			//infos sur l'analyse en cours des pages
			squelette += '<div id="' + setSelectorName('rescanner', nom) + '" class="lien" onclick="if(confirm(\'Sûr ?\')){deployerMois(\''+annee+'\', \''+mois+'\', true);removeOnclick(this)}">Rescanner</div>'
			
			+ '<div id="' + setSelectorName('C2stats_infos_analyse_en_cours', nom) + '" class="italic chargement"></div>'
			
			//graphique SVG
			+ '<div>'
				+ '<svg class="chart" id="' + setSelectorName('svg_graphic', nom) + '"></svg>'
			+ '</div>'
		
			//affichage des jours
			+ '<div id="' + setSelectorName('liste_des_jours', nom) + '"></div>';
		
		}
		
	}else{
		
		squelette += '<div id="' + setSelectorName('rescanner', nom) + '" class="lien" onclick="if(confirm(\'Sûr ?\')){getStatsJour(\''+annee+'\', \''+mois+'\', \''+jour+'\', true);removeOnclick(this)}">Rescanner</div>';
		
	}
	
	squelette += '<li class="nolist" id="' + setSelectorName('global', nom) + '">'
		+ "<h3>Statistiques " + (afficher_aujourdhui ? "d'aujourd'hui" : (jour ? 'du jour ' + jour : 'globales du mois')) + "</h3>"
			+ "<ul>"
				
				+ "<li class='nolist'><span class='titre'>Pages vues par heure :</span>"
					+ '<div class="C2stats_chart ' + setSelectorName('C2stats_chart', nom) + '">';
					
						for(heure = 0; heure < 24; heure ++){
							
							squelette += '<div class="C2stats_bar_container">'
								+ '<div class="C2stats_hour_label"><span>' + formatHour(heure) + '</span></div>'
							
								+ '<div class="C2stats_bar ' + setSelectorName('bar', nom) + '-' + heure + ' chargement" style="width: 0%;">0</div>'
							
							+ '</div>';
							
						}
						
					squelette += '</div>'
				+ "</li>"
			+ "</ul>"
			
			
			+ "<ul>"
			
				+ "<li class='nolist'><span class='titre'>Visiteurs au total :</span>"
					+ "<ul>"
						+ "<li><b style='color:blue' class='" + setSelectorName('visiteurs_uniques_t', nom) + " chargement'>0</b> <i>(Moyenne de <b style='color:blue' class='" + setSelectorName('visiteurs_uniques_t_moyenne_par_jour', nom) + " chargement'>0</b> visiteurs, par " + (afficher_jour ? "heure" : "jour") + ")</i></li>"
					+ "</ul>"
				+ "</li>"
				
				+ "<li class='nolist'><span class='titre'>Pages vues :</span>"
					+ "<ul>"
					
						+ "<li>Par les visiteurs: <b style='color:red' class='" + setSelectorName('pagesvues_visiteurs_t', nom) + " chargement'>0</b> <i>(Moyenne de <b style='color:red' class='" + setSelectorName('pagesvues_visiteurs_t_moyenne_par_jour', nom) + " chargement'>0</b> pages vues, par " + (afficher_jour ? "heure" : "jour") + ")</i></li>"
						
						+ "<li>Par les robots : <b class='" + setSelectorName('pagesvues_robots_t', nom) + " chargement'>0</b> <i>(Moyenne de <b class='" + setSelectorName('pagesvues_robots_t_moyenne_par_jour', nom) + " chargement'>0</b> pages vues, par " + (afficher_jour ? "heure" : "jour") + ")</i></li>"
						
						+ "<li>Par les réseaux sociaux : <b class='" + setSelectorName('pagesvues_rs_t', nom) + " chargement'>0</b> <i>(Moyenne de <b class='" + setSelectorName('pagesvues_rs_t_moyenne_par_jour', nom) + " chargement'>0</b> pages vues, par " + (afficher_jour ? "heure" : "jour") + ")</i></li>"
						
					+ "</ul>"
				+ "</li>"
				+ "<li class='nolist'><span class='titre'>Moyenne de pages vues par visite :</span>"
					+ "<ul>"
						+ "<li>Visiteurs : <b class='" + setSelectorName('moyenne_pages_vues_par_visite_visiteurs', nom) + " chargement'>0</b></li>"
						+ "<li>Robots : <b class='" + setSelectorName('moyenne_pages_vues_par_visite_robots', nom) + " chargement'>0</b></li>"
					+ "</ul>"
				+ "</li>"
				+ "<li class='nolist'><span class='titre'>Visiteurs sur mobile :</span>"
					+ "<ul>"
						+ "<li><b class='" + setSelectorName('visiteurs_sur_mobile_t', nom) + " chargement'>0</b> (<span class='chargement'><span class='" + setSelectorName('visiteurs_sur_mobile_t_pourcentage', nom) + "'>0</span>%</span>)</li>"
					+ "</ul>"
				+ "</li>"
				
				+ "<li class='nolist'><span class='titre'>Robots qui ont crawlés le site :</span>"
					+ "<ul>"
						+ "<li><b class='" + setSelectorName('robots_t', nom) + " chargement'>0</b>"
						+ "<div style='font-size:75%'>"
							+ "<span class='chargement'>Crawlé par :</span>"
							+ "<ul class='" + setSelectorName('bots_liste', nom) + "'></ul>"
						+ "</div>"
					+ "</li>"
				+ "</ul>"
			+ "</li>"
		+ "</ul>"
	+ "</li>"

	//affichage des pages visitées
	+ "<li class='nolist slideToggle'>"
		+ "<h3 class='cursor_help chargement'>Les pages vues par les visiteurs</h3>"
	+ "</li>"

	+ "<ul style='display:none' class='monospace " + setSelectorName('pages_visiteurs_liste', nom) + "'></ul>"

	//affichage des robots
	+ "<li class='nolist slideToggle'>"
		+ "<h3 class='cursor_help chargement'>Les pages vues par les robots</h3>"
	+ "</li>"

	+ "<ul style='display:none' class='monospace " + setSelectorName('pages_robots_liste', nom) + "'></ul>"

	//affichage des pages partagées sur les réseaux sociaux
	+ "<li class='nolist slideToggle'>"
		+ "<h3 class='cursor_help chargement'>Les pages partagées sur les réseaux sociaux</h3>"
	+ "</li>"

	+ "<ul style='display:none' class='monospace " + setSelectorName('pages_rs_liste', nom) + "'></ul>"

	//affichage des sites référants (venus depuis un site)
	+ "<li class='nolist slideToggle'>"
		+ "<h3 class='cursor_help chargement'>Les sites référants</h3>"
	+ "</li>"

	+ "<ul style='display:none' class='monospace " + setSelectorName('sites_liste', nom) + "'></ul>"
	
	/*+ "<ul style='display:none'>"

		arsort($array['sites']);
		$resultats = 0;
		
		foreach($array['sites'] as $site => $arrays){
			
			$lien = $site;
			if($site != '[not set HTTP_REFERER]'){
				
				$href = $site;
				if(substr($site, 0, 4) != 'http')
					$href = 'https://' . $site;
				
				$lien = "<a href='$href' rel='noreferrer' target='_blank' class='external'>$site</a> <i>(noreferrer)</i>"
			
			}
			+ "<li>$lien<span style='float:right'>{$arrays['vues']} fois</span></li>"
			$resultats=1;
		}
		if($resultats == 0)
			+ '<li>Aucun résultat.</li>'
	+ "</ul>"*/


	//affichage des navigateurs utilisés
	+ "<li class='nolist slideToggle'>"
		+ "<h3 class='cursor_help chargement'>Les navigateurs</h3>"
	+ "</li>"

	+ "<ul style='display:none' class='monospace " + setSelectorName('navigateurs_liste', nom) + "'></ul>"


	//affichage des systèmes d'exploitation utilisés
	+ "<li class='nolist slideToggle'>"
		+ "<h3 class='cursor_help chargement'>Les systèmes d'exploitation</h3>"
	+ "</li>"

	+ "<ul style='display:none' class='monospace " + setSelectorName('os_liste', nom) + "'></ul>"
	
	+ "<hr>"

	//si de nouveaux robots sont trouvés ou des user_agent non analysables, on les affichent et on les enregistres si ils le sont pas
	+ '<h2 class="cursor_help italic chargement slideToggle"><span style="color:red">Nouveaux</span> robots détectés :</h2>'
	+ '<ul style="display:none" class="monospace ' + setSelectorName('news_bots_liste', nom) + '"></ul>'
	
	+ '<h2 class="cursor_help italic chargement slideToggle"><span style="color:red">Nouveaux</span> USER_AGENT détectés :</h2>'
	+ '<ul style="display:none" class="monospace ' + setSelectorName('news_user_agent_liste', nom) + '"></ul>'
	
	return squelette;
}
function deployerMois(annee, mois, rescan = false){

	let nom = getNom(annee, mois);
	
	if(rescan)
		delete DATA_STATS[annee][mois];
	
	poste({type:'deployer_mois',annee:annee,mois:mois},function(data){
		
		if(data.ok != 'ok'){
			alert(data.ok);
			return;
		}
		$(getSelectorName('statistiques_mois', nom, 'id')).html(afficherSqueletteStats(annee, mois));
		// if(_this.hasClass("jq_deployed")){
		getStatsJour(annee,mois,'01');
		
	});
}
function deployerJour(annee, mois, jour, afficher_aujourdhui, afficher_jour = false){
	
	let nom = getNom(annee, mois, jour, afficher_aujourdhui);
	
	//ajouter les stats aux élements
	let elmStats = $(getSelectorName('li_jour', nom, 'id'));
	if(!elmStats.hasClass("jq_deployed")){
		
		setStatsJour(annee, mois, jour, nom, false, afficher_aujourdhui, afficher_jour);
		elmStats.addClass("jq_deployed");
		
	}
}
function setStatsJour(annee, mois, jour, nom, _data = false, afficher_aujourdhui =false, afficher_jour = false){
	
	let nom_sans_jour = nom;
	
	let data = {};
	
	if(!_data){
		
		// data.heures = DATA_STATS[annee][mois][jour].heures;
		data.int = DATA_STATS[annee][mois][jour].int;
		data.array = DATA_STATS[annee][mois][jour].array;
		
	}else{
		
		data = _data;
		
	}

	//agrège les stats de chaque heure
	for(let heure in data.array.heures){
		
		let barElm = getSelectorName('bar', nom_sans_jour + '-' + heure, 'class');
		
		addIntToDiv(barElm, data.array.heures[heure]);
		
		// if(DATA_STATS.arr_heures[nom_sans_jour] === undefined)
			// DATA_STATS.arr_heures[nom_sans_jour] = {};
		
		// DATA_STATS.arr_heures[nom_sans_jour][heure] = data.heures[heure];
		
		
		
		// Calcul du max_value et des pourcentages dans une deuxième boucle
		let values = Object.values(data.array.heures);
		let max_value = Math.max(...values);  // Utilisation de la déstructuration
		// Vérifier si max_value n'est pas NaN
		if (max_value !== 0) {
			// Boucle pour mettre à jour les barres avec les pourcentages calculés
			// for (let heure in DATA_STATS.arr_heures[nom_sans_jour]) {
				let barElm = getSelectorName('bar', nom_sans_jour + '-' + heure, 'class');
				let heureValue = data.array.heures[heure];
				
				// Calcul du pourcentage
				let percentage = (heureValue / max_value) * 100;

				// Appliquer le style à la barre correspondante
				$(barElm).attr('style', `width: ${percentage}%`);
			// }
		}
		
	}
	
	
	//agrège le nb de visiteur unique pour ce jour
	addIntToDiv(getSelectorName('visiteurs_uniques_t', nom_sans_jour, 'class'), data.int.visiteurs_uniques_t);
	
	//fait une moyenne par jour du nb de visiteur unique
	const visiteurs_uniques_t_total = getIntDiv(getSelectorName('visiteurs_uniques_t', nom_sans_jour, 'class'));
	
	let nb_de_jour_actuellement_agrege = Object.keys(DATA_STATS[annee][mois]).length;
	if(afficher_jour)
		nb_de_jour_actuellement_agrege = 24;//au lieu de faire une moyenne du nb de jours, on fait une moyenne par heure
	
	$(getSelectorName('visiteurs_uniques_t_moyenne_par_jour', nom_sans_jour, 'class')).text(roundToHalf(visiteurs_uniques_t_total / nb_de_jour_actuellement_agrege));
	
	
	//agrège le nb de pages vues pour ce jour
	addIntToDiv(getSelectorName('pagesvues_visiteurs_t', nom_sans_jour, 'class'), data.int.pagesvues_visiteurs_t);
	addIntToDiv(getSelectorName('pagesvues_robots_t', nom_sans_jour, 'class'), data.int.pagesvues_robots_t);
	addIntToDiv(getSelectorName('pagesvues_rs_t', nom_sans_jour, 'class'), data.int.pagesvues_rs_t);
	
	//fait une moyenne par jour du nb de visiteur unique
	const pagesvues_visiteurs_t_total = getIntDiv(getSelectorName('pagesvues_visiteurs_t', nom_sans_jour, 'class'));
	$(getSelectorName('pagesvues_visiteurs_t_moyenne_par_jour', nom_sans_jour, 'class')).text(roundToHalf(pagesvues_visiteurs_t_total / nb_de_jour_actuellement_agrege));
	
	//de robots
	const pagesvues_robots_t_total = getIntDiv(getSelectorName('pagesvues_robots_t', nom_sans_jour, 'class'));
	$(getSelectorName('pagesvues_robots_t_moyenne_par_jour', nom_sans_jour, 'class')).text(roundToHalf(pagesvues_robots_t_total / nb_de_jour_actuellement_agrege));
	
	//de réseaux sociaux
	const pagesvues_rs_t_total = getIntDiv(getSelectorName('pagesvues_rs_t', nom_sans_jour, 'class'));
	$(getSelectorName('pagesvues_rs_t_moyenne_par_jour', nom_sans_jour, 'class')).text(roundToHalf(pagesvues_rs_t_total / nb_de_jour_actuellement_agrege));
	
	//agrège la moyenne de pages vues par type de visiteur
	if(visiteurs_uniques_t_total > 0){
		
		//par visiteur
		$(getSelectorName('moyenne_pages_vues_par_visite_visiteurs', nom_sans_jour, 'class')).text((pagesvues_visiteurs_t_total / visiteurs_uniques_t_total).toFixed(2));
	
		//par robot
		if(data.int.robots_t > 0){
			
			const robots_t = getIntDiv(getSelectorName('robots_t', nom_sans_jour, 'class'));
			
			$(getSelectorName('moyenne_pages_vues_par_visite_robots', nom_sans_jour, 'class')).text((pagesvues_robots_t_total / (data.int.robots_t + robots_t)).toFixed(2));
			
			// addIntToDiv(getSelectorName('robots_t', nom_sans_jour, 'class'), data.int.robots_t);
	
		}
	}
	
	
	
	//nb de visiteur sur mobile
	if(data.int.visiteurs_sur_mobile_t > 0){
		
		addIntToDiv(getSelectorName('visiteurs_sur_mobile_t', nom_sans_jour, 'class'), data.int.visiteurs_sur_mobile_t);
		
		if(visiteurs_uniques_t_total > 0){
			
			const visiteurs_sur_mobile_t_total = getIntDiv(getSelectorName('visiteurs_sur_mobile_t', nom_sans_jour, 'class'));
			
			$(getSelectorName('visiteurs_sur_mobile_t_pourcentage', nom_sans_jour, 'class')).text((visiteurs_sur_mobile_t_total / pagesvues_visiteurs_t_total * 100).toFixed(2));
			
		}
	}
	
	// !_data == on affiche un jour en particulier
	if(!_data){
		
		removeChargement(nom_sans_jour);
		
		afficherListes(nom_sans_jour, data.array);
		
	}
}
function getStatsJour(annee, mois, jour, afficher_aujourdhui = false){
	
	nom = getNom(annee, mois, jour, afficher_aujourdhui);
	nom_sans_jour = getNom(annee, mois, 0, afficher_aujourdhui);
	
	if(!afficher_aujourdhui){
		
		$(getSelectorName('C2stats_infos_analyse_en_cours', nom_sans_jour, 'id')).text("Agrégation du jour " + jour);
	
	}else{
		
		$('#jq_stats_aujourdhui').html(afficherSqueletteStats(annee, mois, jour, afficher_aujourdhui, true));
		
	}
	
	const _this = $(this);
	
	poste({type:'deployer_jour',annee:annee,mois:mois,jour:jour},function(data){
		
		if(data.ok != 'ok'){
			alert(data.ok);
			return;
		}
		
		
		//ajoute des données à l'objet global
		if(DATA_STATS[annee] === undefined)
			DATA_STATS[annee] = {annee:{}};
		
		if(DATA_STATS[annee][mois] === undefined)
			DATA_STATS[annee][mois] = {mois:{}};
		
		if(DATA_STATS[annee][mois][jour] === undefined)
			DATA_STATS[annee][mois][jour] = {jour:{}};
		
		// if(DATA_STATS[annee][mois][jour].heures === undefined)
			// DATA_STATS[annee][mois][jour].heures = data.heures;
		
		if(DATA_STATS[annee][mois][jour].array === undefined)
			DATA_STATS[annee][mois][jour].array = data.array;
		
		if(DATA_STATS[annee][mois][jour].int === undefined)
			DATA_STATS[annee][mois][jour].int = data.int;
		
		setStatsJour(
			annee,
			mois,
			jour,
			afficher_aujourdhui ? nom : nom_sans_jour,
			data,
			afficher_aujourdhui
		);
		
		//on ajoute les listes du jour (structures HTML)
		let vues_jour_precedent = 0,
		    visiteurs_uniques_jour_precedent = 0;
		
		if(parseInt(jour) > 1 && !afficher_aujourdhui){
			
			let jour_precedent = rajouterZero(parseInt(jour) - 1);
			vues_jour_precedent = DATA_STATS[annee][mois][jour_precedent].int.pagesvues_visiteurs_t || 0;
			visiteurs_uniques_jour_precedent = DATA_STATS[annee][mois][jour_precedent].int.visiteurs_uniques_t || 0;
			
		}
		
		if(!afficher_aujourdhui){
			
			//ajoute jour par jour à la suite
			let squelette_jour = '<li class="slideToggle cursor_help" id="' + setSelectorName('li_jour', nom) + '" onclick="deployerJour(\''+annee+'\',\''+mois+'\',\''+jour+'\', false, true);removeOnclick(this)">'
			
				+ jour
				
				+ "<span style='color:blue' class='fleche_" + (parseInt(jour) > 1 ? c2fleches(data.int.visiteurs_uniques_t, visiteurs_uniques_jour_precedent) : '') + "'>" + data.int.visiteurs_uniques_t + "</span>"
				
				+ "<span style='color:red' class='fleche_" + (parseInt(jour) > 1 ? c2fleches(data.int.pagesvues_visiteurs_t, vues_jour_precedent) : '') + "'>" + data.int.pagesvues_visiteurs_t + "</span>"
				
			+ "</li>"
			
			+ '<li class="nolist" style="display:none" id="' + setSelectorName('global', nom) + '">'
				+ "<ul>" + afficherSqueletteStats(annee, mois, jour, afficher_aujourdhui, true) + "</ul>"
			+ "</li>";
			
			$(getSelectorName('liste_des_jours', nom_sans_jour, 'id')).append(squelette_jour);
		
		}
		
		if(data.jour_suivant){
			
			if(!afficher_aujourdhui){
				
				//pour faire des tests sans tout scanner
				// if(data.jour_suivant < 3)
					getStatsJour(annee, mois, data.jour_suivant);
				
			}
			
		}else{
			
			//enlève le texte "Chargement..." aux éléments
			removeChargement(nom_sans_jour, afficher_aujourdhui);
			
			if(!afficher_aujourdhui)
				$(getSelectorName('C2stats_infos_analyse_en_cours', nom_sans_jour, 'id')).remove();
			
		}
		
		if(!afficher_aujourdhui)
			updateGraph(annee, mois);
		
		//affiche les listes de liens vues et leur nombre de vues, les listes de navigateurs utilisés, des OS, etc
		afficherListes(afficher_aujourdhui ? nom : nom_sans_jour, aggregateData(annee,mois));
		
	});
}
function afficherListes(nom, donnees){
	
	[
		'bots',
		'news_bots',
		'news_user_agent',
		'sites',
		'navigateurs',
		'os',
		'robots_t',
		'pages_visiteurs',
		'pages_robots',
		'pages_rs'
	]
	.forEach((intitule) => {
		$(getSelectorName(intitule + '_liste', nom, 'class')).html(afficherListe(intitule, donnees));
		
		if(intitule == 'robots_t')
			setIntToDiv(getSelectorName('robots_t', nom, 'class'), donnees.bots.length);
		
	});
	
}
function setIntToDiv(elm, nb){
	let div = $(elm);
	div.text(nb);
}
function addIntToDiv(elm, nb){
	let div = $(elm);
	div.text(parseInt(div.text()) + nb);
}
function getIntDiv(elm, nb){
	let div = $(elm);
	return parseInt(div.text());
}
function roundToHalf(value){
	return Math.round(value * 2) / 2;
}
function rajouterZero(i){
	return i < 10 ? '0' + i : i;
}
function c2fleches(value, a_value){
	if(value > a_value) return 'plus';
	else if(value == a_value) return 'egal';
	else if(value < a_value) return 'moins';
}
function removeOnclick(_this){
	_this.removeAttribute('onclick');
}
function removeChargement(nom, du_jour = false){
	$(`${du_jour ? '#jq_stats_aujourdhui' : getSelectorName('statistiques_mois', nom, 'id')} .chargement`).removeClass('chargement')
}
function poste(options,callback,json=true){
	let retour={ok:""};
	$.post("js/xhr.php",options,function(data){

		retour = Object.assign(retour,data);
		retour.ok = data.ok;
		callback(retour);
		
		submit_tentatives = 0;
		
	},(json?"json":"")).fail(function(data,etat){
		
		if(data.status == 0 || data.status == 503){
			
			if(submit_tentatives < 10){
				
				//La spécification actuelle du W3C définit les conditions pour lesquelles 0 est renvoyé ici : https://fetch.spec.whatwg.org/#concept-network-error
				
				setTimeout(function(){
					poste(options,callback,json);
				},1000);
				
				submit_tentatives ++;
				console.info(`Relance.. POST. Status ${data.status}`);
				
			}else{
				
				alert(`Erreur :\n${etat}\n${data.status}\n${data.statusText}`);
				
				submit_tentatives = 0;
				return false;
				
			}
			
		}else{
			
			alert(`Erreur :\n${etat}\n${data.status}\n${data.statusText}`);
			return false;
			
		}
		return false;
		
	})/*.always(function(data){})*/;
}
// Fonction pour rassembler tous les arrays des jours d'un mois
function aggregateData(annee, mois) {
	let aggregatedData = {
		bots: [],
		news_user_agent: [],
		news_bots: [],
		navigateurs: {},
		os: {},
		pages_robots: {},
		pages_visiteurs: {},
		pages_rs: {},
		sites: {}
	};

	// Vérifier si les données existent pour l'année et le mois
	if (DATA_STATS[annee] && DATA_STATS[annee][mois]) {
		// Vérifier s'il y a des jours dans ce mois
		let monthData = DATA_STATS[annee][mois];

		// Parcours des jours dans ce mois
		for (let jour in monthData) {
			// Vérifie si c'est bien un jour et non le mois lui-même
			if (jour !== "mois") {
				let dayData = monthData[jour].array;  // Accéder aux données du jour

				// Vérifier si 'dayData' existe avant de procéder
				if (dayData) {
					// --- Agréger les robots (bots) ---
					if (dayData.bots) {
						
						dayData.bots.forEach(bot => {
							if (!aggregatedData.bots.includes(bot)) {
								aggregatedData.bots.push(bot); // Ajouter le bot si il est unique
							}
						});
					}

					// --- Agréger les news user agent ---
					if (dayData.news_user_agent) {
						dayData.news_user_agent.forEach(agent => {
							if (!aggregatedData.news_user_agent.includes(agent)) {
								aggregatedData.news_user_agent.push(agent); // Ajouter l'agent si il est unique
							}
						});
					}
					
					if (dayData.news_bots) {
						dayData.news_bots.forEach(agent => {
							if (!aggregatedData.news_bots.includes(agent)) {
								aggregatedData.news_bots.push(agent); // Ajouter l'agent si il est unique
							}
						});
					}

					// --- Agréger les navigateurs ---
					if (dayData.navigateurs) {
						for (let browser in dayData.navigateurs) {
							if (!aggregatedData.navigateurs[browser]) {
								aggregatedData.navigateurs[browser] = 0; // Initialiser si inexistant
							}
							aggregatedData.navigateurs[browser] += dayData.navigateurs[browser].vues; // Additionner les vues
						}
					}

					// --- Agréger les systèmes d'exploitation ---
					if (dayData.os) {
						for (let system in dayData.os) {
							if (!aggregatedData.os[system]) {
								aggregatedData.os[system] = 0; // Initialiser si inexistant
							}
							aggregatedData.os[system] += dayData.os[system].vues; // Additionner les vues
						}
					}

					// --- Agréger les pages visiteurs ---
					if (dayData.pages_visiteurs) {
						for (let page in dayData.pages_visiteurs) {
							if (!aggregatedData.pages_visiteurs[page]) {
								aggregatedData.pages_visiteurs[page] = 0; // Initialiser si inexistant
							}
							aggregatedData.pages_visiteurs[page] += dayData.pages_visiteurs[page];// Additionner les vues
						}
					}

					// --- Agréger les pages robots ---
					if (dayData.pages_robots) {
						for (let page in dayData.pages_robots) {
							if (!aggregatedData.pages_robots[page]) {
								aggregatedData.pages_robots[page] = { vues: 0, robots: [] }; // Initialiser si inexistant
							}
							let pageData = dayData.pages_robots[page];
							aggregatedData.pages_robots[page].vues += pageData.vues;

							// Ajouter les robots uniques pour cette page
							pageData.robots.forEach(robot => {
								if (!aggregatedData.pages_robots[page].robots.includes(robot)) {
									aggregatedData.pages_robots[page].robots.push(robot);
								}
							});
						}
					}

					// --- Agréger les pages réseaux sociaux ---
					if (dayData.pages_rs) {
						for (let socialNetwork in dayData.pages_rs) {
							if (!aggregatedData.pages_rs[socialNetwork]) {
								aggregatedData.pages_rs[socialNetwork] = { vues: 0, pages: {} }; // Initialiser si inexistant
							}
							let socialData = dayData.pages_rs[socialNetwork];
							aggregatedData.pages_rs[socialNetwork].vues += socialData.vues;

							for (let page in socialData.pages) {
								if (aggregatedData.pages_rs[socialNetwork].pages[page]) {
									aggregatedData.pages_rs[socialNetwork].pages[page] += socialData.pages[page];
								} else {
									aggregatedData.pages_rs[socialNetwork].pages[page] = socialData.pages[page];
								}
							}
						}
					}

					// --- Agréger les sites ---
					if (dayData.sites) {
						for (let site in dayData.sites) {
							if (!aggregatedData.sites[site]) {
								aggregatedData.sites[site] = 0; // Initialiser si inexistant
							}
							aggregatedData.sites[site] += dayData.sites[site].vues; // Additionner les vues
						}
					}
				}
			}
		}
	}
	return aggregatedData;
}
function afficherListe(type, array){
	let resultats = '';

	// Vérifier si le type existe dans l'objet array
	if (array && array[type] && Object.keys(array[type]).length > 0) {
		if (type === 'pages_visiteurs' || type === 'pages_robots' || type === 'pages_rs') {

			// Trier les pages par nombre de vues (décroissant)
			const sortedData = Object.entries(array[type])
				.sort((a, b) => (b[1].vues || b[1]) - (a[1].vues || a[1]));  // Tri décroissant par vue

			sortedData.forEach(([page, arrays]) => {
				
				resultats += `<li>${page}<span style='float:right'>${arrays.vues || arrays} fois</span>`;

				// Si type est pages_robots, afficher les robots qui ont crawlé la page
				if (type === 'pages_robots') {
					resultats += "<br><span style='font-size:75%'>Crawlé par : <i>";
					resultats += "<br>- " + arrays.robots.join("<br>- ");
					resultats += "</i></span>";
				}

				// Si type est pages_rs, afficher les pages de chaque réseau social
				if (type === 'pages_rs') {
					resultats += '<ul>';
					const sortedPages = Object.entries(arrays.pages)
						.sort((a, b) => (b[1].vues || b[1]) - (a[1].vues || a[1]));  // Tri décroissant par vue
					
					sortedPages.forEach(([page, vues]) => {
						resultats += `<li>${page}<span style='float:right'>${vues.vues || vues} fois</span></li>`;
					});
					resultats += '</ul>';
				}
			});
		}

		// Si le type est un tableau simple, comme bots, news_bots, news_user_agent
		else if (Array.isArray(array[type])) {
			array[type].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
			array[type].forEach(item => {
				resultats += `<li>${item}</li>`;
			});
		}

		// Si le type est un objet avec des vues (comme navigateurs, os, etc.)
		else if (typeof array[type] === 'object' && !Array.isArray(array[type])) {
			
			const sortedData = Object.entries(array[type])
				.sort((a, b) => (b[1].vues || b[1]) - (a[1].vues || a[1]));  // Tri décroissant par vue
				
			sortedData.forEach(([key, value]) => {
				resultats += `<li>${key}<span style='float:right'>${value.vues || value} fois</span></li>`;
			});
		}
	}
	
	return resultats == '' ? "<li>Aucun résultat.</li>" : resultats;
}


//SVG GRAPHIC
let svg_height = 450;

// Ajouter un événement de mouvement de la souris pour afficher le tooltip à la position de la souris
const eventTooltipListener = function (event) {
	const tooltip = document.getElementById('tooltip');
	
	// Récupérer la position de la souris avec les décalages de défilement
	let mouseX = event.clientX + 10 + window.scrollX; // Décalage horizontal avec scroll
	let mouseY = event.clientY + 10 + window.scrollY; // Décalage vertical avec scroll
	
	// Si la souris est au bord de l'écran, on décale le tooltip
	const dimensions_tooltip = document.getElementById("tooltip").getBoundingClientRect();
	
	mouseY -= dimensions_tooltip.height / 1.3;
	
	// Si le tooltip dépasse du bord droit, on le repositionne
	if (window.innerWidth + window.scrollX < mouseX + dimensions_tooltip.width) {
		mouseX = window.innerWidth + window.scrollX - dimensions_tooltip.width - 30;
	}
	
	// Si le tooltip dépasse du bord haut de la page, on le repositionne
	if (mouseY < dimensions_tooltip.height) {
		mouseY = 0;
	}
	
	// Positionner le tooltip en fonction de la position de la souris
	tooltip.style.left = `${mouseX}px`;
	tooltip.style.top = `${mouseY}px`;
};

// Lorsque l'utilisateur survole un cercle, afficher le tooltip avec les informations correspondantes
function handleCircleHover(i, point, texte) {
	document.addEventListener('mousemove', eventTooltipListener);
	const tooltip = document.getElementById('tooltip');
	tooltip.innerHTML = texte;
	tooltip.style.opacity = 1;  // Afficher le tooltip
}

// Lorsque la souris quitte un cercle, masquer le tooltip
function handleCircleLeave() {
	document.removeEventListener('mousemove', eventTooltipListener);
	const tooltip = document.getElementById('tooltip');
	tooltip.style.opacity = 0;  // Masquer le tooltip
}
// Fonction pour recalculer et afficher le graphique
function updateGraph(annee, mois){
	
	let nom = getNom(annee, mois);
	let vuesParJour = {};
	
	// Vérifier si l'année et le mois existent dans DATA_STATS
	if (DATA_STATS[annee] && DATA_STATS[annee][mois]) {
		const moisData = DATA_STATS[annee][mois];
		
		// Parcourir les jours du mois et récupérer les vues associées
		const jours = Object.keys(moisData);  // Obtenir les clés des jours (en tant que tableau de string)
		
		const pagesvues = jours
			.filter(jour => jour !== "mois")  // Filtrer les jours qui ne sont pas "mois"
			.map(jour => moisData[jour].int.pagesvues_visiteurs_t);  // Mapper les vues pour les autres jours
		const visiteurs_uniques = jours
			.filter(jour => jour !== "mois")
			.map(jour => moisData[jour].int.visiteurs_uniques_t);
		
		// Retourner les jours et les vues sous forme d'un tableau d'objets { jour, vues }
		
		vuesParJour = jours
			.filter(jour => jour !== "mois")
			.map((jour, index) => ({
				jour: parseInt(jour),
				pagesvues: pagesvues[index],
				visiteurs_uniques: visiteurs_uniques[index]
			}));
		
		// Convertir en objet avec la date comme clé et les vues comme valeur
		vuesParJour = vuesParJour.reduce((acc, item) => {
			acc[item.jour] = item;
			return acc;
		}, {});
		
	}else{
		return;
	}
	
	
	const maxPoints = Object.keys(vuesParJour).length;
	
	if(maxPoints == 0)
		return;
	// Calculer la valeur maximale des vues pour ajuster l'échelle verticale
	// const maxViews = Math.max(...Object.values(vuesParJour));
	
	// Trouver l'objet avec le maximum de pages vues
	const maxViews = Math.max(...Object.values(vuesParJour).map(obj => obj.visiteurs_uniques));
	
	
	
	// Calculer la largeur du SVG en fonction du nombre de jours
	
	const chartID = getSelectorName('svg_graphic', nom, false)
	
	const svgWidth = document.getElementById(chartID).getBoundingClientRect().width;  // Calculer la largeur en fonction du nombre de jours

	const svg = document.getElementById(chartID);
	svg.innerHTML = '';  // Effacer le contenu précédent du graphique

	// Calculer les points de la courbe
	const points = Object.keys(vuesParJour).map((date, index) => {
		
		// Calculer l'espace horizontal disponible en fonction du nombre de dates
		return {
			x: index * (maxPoints == 1 ? svgWidth - 50 : ((svgWidth - 50) / (maxPoints - 1))) + 50,  // Espace horizontal (100px entre chaque jour)
			y: svg_height - (vuesParJour[date].visiteurs_uniques / maxViews) * svg_height + 30,  // Hauteur, ajustée à l'échelle
			date: date,
			pagesvues: vuesParJour[date].pagesvues,
			visiteurs_uniques: vuesParJour[date].visiteurs_uniques
		};
		
	});


	// Ajuster la largeur du SVG
	svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svg_height + 60}`);


	// Calculer l'échelle des graduations de l'axe Y
	let graduationInterval;
	if (maxViews <= 100) {
		graduationInterval = 10;
	} else if (maxViews <= 1000) {
		graduationInterval = 100;
	} else if (maxViews <= 10000) {
		graduationInterval = 1000;
	} else {
		graduationInterval = 10000;
	}

	// Ajouter les lignes de la grille (lignes légères grises) et les graduations de l'axe Y
	for (let i = 0; i <= Math.floor(maxViews / graduationInterval); i++) {
		const yPos = svg_height + 60 - i * (svg_height / (maxViews / graduationInterval)) - 30;  // Calcul dynamique de la position verticale
		const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
		gridLine.setAttribute('x1', 50);  // Position de la ligne à gauche
		gridLine.setAttribute('y1', yPos);
		gridLine.setAttribute('x2', svgWidth);  // Position de la ligne à droite
		gridLine.setAttribute('y2', yPos);
		gridLine.setAttribute('class', 'grid-line');
		svg.appendChild(gridLine);

		// Ajouter les labels pour les graduations sur l'axe Y
		const vueText = document.createElementNS("http://www.w3.org/2000/svg", "text");
		vueText.setAttribute('x', 30);
		vueText.setAttribute('y', yPos + 4);  // Décalage des valeurs de graduation à gauche
		vueText.setAttribute('class', 'axis');
		vueText.setAttribute('text-anchor', 'end');
		vueText.textContent = i * graduationInterval;  // Afficher les vues arrondies
		svg.appendChild(vueText);
	}

	// Créer le chemin pour les lignes droites
	let pathData = `M ${points[0].x} ${points[0].y}`;  // Commencer à la première position

	// Ajouter des lignes droites entre chaque point
	for (let i = 1; i < points.length; i++) {
		pathData += ` L ${points[i].x} ${points[i].y}`;  // Ajouter un segment de ligne droite
	}

	// Ajouter le graphique des lignes droites dans le SVG
	const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
	pathElement.setAttribute('d', pathData);  // Définir le chemin
	pathElement.setAttribute('class', 'grid-path');
	svg.appendChild(pathElement);
	
	// Ajouter des cercles aux points d'intersection des lignes droites
	points.forEach((point, i) => {
		const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute('cx', point.x);
		circle.setAttribute('cy', point.y);
		circle.setAttribute('r', 10);
		circle.setAttribute('class', 'grid-circle');

		// Ajouter des événements pour gérer le tooltip
		circle.addEventListener('mouseenter', function () {
				handleCircleHover(i, point, `Jour ${point.date}<br>Visiteurs uniques : ${point.visiteurs_uniques}<br>Pages vues : ${point.pagesvues}`);  // Afficher le tooltip avec les informations
		});

		circle.addEventListener('mouseleave', handleCircleLeave);  // Masquer le tooltip lorsque la souris quitte le cercle

		// Ajouter le cercle au SVG
		svg.appendChild(circle);
	});

	// Ajouter les axes X (jours) avec ajustement dynamique
	points.forEach((point) => {
		const dayText = document.createElementNS("http://www.w3.org/2000/svg", "text");
		dayText.setAttribute('x', point.x);
		dayText.setAttribute('y', svg_height + 60);  // Position sous la ligne
		dayText.setAttribute('class', 'axis');
		dayText.setAttribute('text-anchor', 'middle');
		dayText.textContent = point.date;
		svg.appendChild(dayText);
	});
}

$(()=>{
	$(document).on("click",".slideToggle",function(){
		$(this).next().slideToggle();
	});
	$('body').append('<div id="tooltip" class="tooltip"></div>');
});