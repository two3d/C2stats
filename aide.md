# Installation du script

Pour faire fonctionner le script vous devez : (3 étapes)

## 1. Envoyer le dossier C2stats sur votre site

À la racine ou là où vous voulez, prenez soin de modifier le chemin vers C2stats au code suivant.

## 2. Mettre en place le code suivant

Sur toutes les fins de vos pages, après `</html>` ou juste avant :

```php
<?php
//DEBUT CODE C2STATS

//"define C2STATS" est une sécurité pour pouvoir inclure le fichier footer-script.php
define('C2STATS', true);

//inclusion script comptage visite
include __DIR__ . '/C2stats/includes/footer-script.php';

//FIN CODE C2STATS
?>
```

## 3. Programmer la tâche CRON

```bash
C2stats/cron/jour.php
```

- À lancer chaque jour, à minuit ou maximum dans la première heure de la journée

## 4. Accéder aux statistiques

Via l'adresse : `votresite/C2stats`

---

## À propos

Script réalisé par Steve TENZA (c2script.com), mis à disposition gratuitement.

Permet d'avoir des statistiques journalières, mensuelles et annuelles du site où il est utilisé.

### Fonctionnalités

- Total des visiteurs uniques
- Nombre de pages vues
- Moyenne de pages visitées par visite
- Sites référants (d'où viennent vos visiteurs)
- Pages partagées sur les réseaux sociaux
- Navigateur et système d'exploitation utilisé
- Robots qui ont crawlé le site et pages crawlées
- Nombre d'utilisateurs sur mobiles
- Pages visitées par le visiteur

### Versions

- v1.1 - 27/03/2020
- v2.0 - 08/12/2023
- v3.0 - 01/12/2024

---

## Structure des fichiers

### Fichiers racine

| Fichier                      | Description                                 |
|                              |                                             |
| `includes/config.php`        | Configuration du script                     |
| `includes/fonctions.php`     | Fonctions pour l'affichage des statistiques |
| `includes/footer-script.php` | Enregistre les statistiques sur votre site  |
| `index.php`                  | Affiche les statistiques                    |
| `js/xhr.php`                 | Appel des stats en JS (AJAX/XHR)            |
| `cron/jour.php`              | Vide les stats d'hier et envoie un mail le 1er du mois |

### Dossier `/txt/listes/`

Les fichiers TXT contiennent des informations détaillées sur le user_agent et sont analysés ligne par ligne, de haut en bas.

| Fichier | Description |
|---------|-------------|
| `bots.txt` | Bots détectés (1 bot/ligne) |
| `ignores.txt` | User agents ignorés (regex) |
| `reseaux-sociaux.txt` | Réseaux sociaux reconnus |
| `nouveaux-ua.txt` | Nouveaux UA non reconnus |
| `nouveaux-deja-envoyes.txt` | UA déjà envoyés par mail |
| `bots-website-links.txt` | Liens vers les sites des bots |

#### Conseils pour bots.txt

- Mettre les robots les plus connus en haut pour optimiser le temps de recherche
- Si un bot ressemble à un autre (ex: MyBot ressemble à ThisMyBot), mettre MyBot APRÈS ThisMyBot

#### Format pour ignores.txt

Expression régulière, ex: `^ma chaîne$` sans délimiteur, les `\` doivent être échappés avec deux `\\`.

### Dossier `/txt/archives/`

Contient toutes les archives de statistiques :
- Classées par année et par mois
- Format: `txt/archives/[année]/[mois]/[jour]/[heure].txt`

### Dossier `/txt/ips/`

Chaque heure de la journée (00.txt, 01.txt...) fichiers mis à jour automatiquement et vidés via la CRON chaque début de journée.

---

## Réinitialiser le script

1. Vider les logs IPs :
```php
$f = glob("txt/ips/*.txt");
foreach($f as $s)
    file_put_contents($s, '');
```

2. Supprimer les dossiers dans `txt/archives/`
