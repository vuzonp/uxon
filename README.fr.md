#![Logotype (paper hen)](https://i.imgur.com/cAeI3W3.png) Librairie Uxôn

**Uxôn** est une librairie JavaScript destinée à faciliter l'intégration d'icônes SVG au sein des pages web.

**[&#x21FE; Voir la démo en ligne](http://jsbin.com/depefi/edit?html,css,js,output)**

## Caractéristiques

- Chargement asynchrone des thèmes d'icônes ;
- Intégration simplifiée des icônes ;
- Possibilité de charger plusieurs thèmes par pages ;
- Possibilité de limiter un thème d'icônes à une zone spécifique ;
- Léger 21,8 kio (7,56 kio minifié / 2,8 kio avec gzip) ;
- Respect des standards *HTML5*, *CSS3* et *EcmaScript5* (ES5).

### À Venir...

- Transformations (rotations et symétries) ;
- Nuancier de couleurs personnalisable ;
- Accessibilté avancée (texte alternatif).

## Compatibilité

Uxôn est développé pour fonctionner avec l'ensemble des navigateurs compatibles avec le format SVG.

- Chrome / Chromium
- Edge
- Firefox
- Internet Explorer 9+
- Safari 3.2+

*Testé sous Chromium, Firefox, Internet Explorer 9 et Opera.*

## Installation

Uxôn est accessible par Bower :
```sh
$~ bower install uxon
```
Vous pouvez aussi télécharger la librairie avec GIT :
```sh
$~ git clone https://github.com/vuzonp/uxon.git
```

... Ou encore télécharger une archive zippée de la dernière [version stable](https://github.com/vuzonp/uxon/archive/master.zip).

### Dépendances

Si vous désirez participer à l'évolution du projet ou adapter la librairie à vos besoins, vous pouvez ensuite installer les dépendances :

```sh
$~ npm install
```

## Utilisation

Une fois la librairie installée, il vous suffit de la charger dans les pages html concernées :

```html
<!DOCTYPE html>
<html>
<head>
  <!-- ... -->
	<link rel="stylesheet" href="src/uxon.min.css" media="screen" charset="utf-8">
</head>
<body>
	<!-- ... -->
	<script src="uxon.js" charset="utf-8"></script>
	<script type="text/javascript">
	uxon.load("bower_components/gonfanon-icons/gonfanon.min.svg");
 	</script>
</body>
</html>
```

### Les thèmes d'icônes

Uxôn est accompagné par défaut d'un thème d'icônes gratuit : [Gonfanôn](https://github.com/vuzonp/gonfanon-icons).

**Ce thème est installé automatiquement si vous utilisez Bower.**

*Gonfânon continuera de s'enrichir de nouvelles icônes, pensez à mettre régulièrement votre installation à jour avec `bower update`.*

### Insérer des icônes

Une fois la feuilles de styles et la librairie javascript chargées dans votre page html, vous pouvez intégrer vos icônes :

```html
<i data-icon="foo"></i>
```

Où **foo** est le nom de l'icône que vous souhaitez afficher.

## Tester la librairie en local

Pour les utilisateurs de Firefox, rien de plus simple, il vous suffit d'ouvrir vos fichiers avec votre navigateur.

Pour les utilisateurs de Webkit il est nécessaire de tester votre code en utilisant un serveur local, les requêtes ajax étant bloquées par défaut.

Pour contourner ce problème sans passer par un serveur local, vous pouvez suivre les instructions de [ce site](http://www.chrome-allow-file-access-from-file.com/) (en anglais).

### Fichiers d'exemples

Un fichier d'exemple [examples/hello-world.html](https://github.com/vuzonp/uxon/blob/master/examples/hello-world.html) est fourni avec la librairie pour tester son bon fonctionnement.

### Pour les contributeurs au projet
Uxôn installe un serveur NodeJs ([http-server](https://www.npmjs.com/package/http-server)) en même temps que les dépendances du projet. Il est accessible en console :

```sh
$~ grunt local
```

Ce serveur est accessible à partir des machines virtuelles pour effectuer des tests sur Internet Explorer. Le port par défaut est `:8080`, si vous devez le modifier, n'oubliez pas de signaler *Gruntfile.js* dans votre fichier *.gitignore*.
