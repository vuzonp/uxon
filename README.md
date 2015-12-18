#![Logotype (paper hen)](https://i.imgur.com/cAeI3W3.png) Uxôn Library
Uxôn is a JavaScript library for an easier SVG icons management in web applications.

*This file is also available [in french](https://github.com/vuzonp/uxon/blob/master/README.fr.md).*

## Specifications

- Asynchronous loading of the icons themes;
- Easy integration of the icons;
- Possibility of loading several themes by pages;
- Possibility to limit an icon theme to a specific area;
- Light 21.7 kio (7.6 kio minified / 2.8 kio with gzip);
- Standards compliance: *HTML5*, *CSS3* and *EcmaScript5* (ES5).

## Roadmap

- Transformations (rotations and symmetries);
- Customizable colorschemes;
- Advanced Accessibility (alternative text).

## Compatibility

Uxôn has developed to work with all browsers that support SVG.

- Chrome / Chromium
- Edge
- Firefox
- Internet Explorer 9+
- Safari 3.2+

*Tested on Chromium, Firefox, Internet Explorer 9 and Opera.*

## Install

If you use **Bower** :
```sh
$~ bower install uxon
```

Or if you prefer to use **GIT** :
```sh
$~ git clone https://github.com/vuzonp/uxon.git
```

If none of the previous methods suits you, a *nightly build* of the project is [available here](https://github.com/vuzonp/uxon/archive/master.zip).

### Dependencies

If you are interested to participate in the development of this project or if you desire to adapt the library to your needs, you can install the dev-dependencies:

```sh
$~ npm install
```

## Getting Started

After installation, just append the library into your html pages:

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

### Themes

Uxôn has a theme of free icons available by default: [Gonfanôn](https://github.com/vuzonp/gonfanon-icons).

**This theme is automatically installed if you use Bower.**

*Gonfanôn is a rolling release project, Think to update your theme with `bower update`.*

### Append the icons

Once the stylesheets and javascript added in your html page, you can include your icons:

```html
<i data-icon="foo"></i>
```
Where **foo** is the name of the icon to display.

## Local Tests

For Firefox users, nothing more simple: just open your files in your browser.

For users of Webkit, it is necessary to run your code through a local server because ajax requests are blocked by default.

To work around this problem, you can follow the instructions from [this website](http://www.chrome-allow-file-access-from-file.com/).

### Example(s)

An example file [examples/hello-world.html](https://github.com/vuzonp/uxon/blob/master/examples/hello-world.html) is provided with the library to test its operation.

### Contributors
A NodeJs server ([http-server](https://www.npmjs.com/package/http-server)) is installed within the dependencies. You can start it in console:

```sh
$~ grunt local
```

This server is configured to make easier tests on VMs. The tcp port is `8080`. If you must edit it, do not forget to set *Gruntfile.js* in your *.gitignore* file.
