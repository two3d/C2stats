<?php
/*
*  CONFIGURATION
*/

//Sécurisez l'accès aux statistiques, définissez un mot de passe pour y accéder
$C2STATS['mot_de_passe'] = '';

// Envoyer un mail chaque fin de mois pour analyser les nouveaux user_agent trouvés
// Renseignez votre email pour recevoir les nouveaux UA chaque début de mois
// Laissez vide pour ne pas envoyer de mail chaque début de moi
$C2STATS['mail'] = '';

// Permet d'identifier votre site dans le mail mensuel, si vous avez plusieurs c2stats installés sur plusieurs sites
$C2STATS['nom_site'] = "Nom du site";