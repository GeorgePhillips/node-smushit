This is a fork of the node-smushit to allow the use of file buffers as well as local file paths.
=====

node-smushit
=====
using smush.it service to optimize image(s) in node

How to use?
------------

install by NPM

```shell
npm install node-smushit -g
```

use smushit in shell

```shell
//view help
smushit -h

//smash files or directory
smushit file1 file2 file3

//with recursive
smushit file1 file2 file3 -R


//smash file and save by new name
smushit image-file-name -o new-file-name


/**
 * change the default service.
 * by default, `node-smushit` use the !Yahoo smushi.it service, you can create your owne smush service.
 * If you are in China, you will know how important to create your own smush.it service. 
 */

// view all config
smushit -c

//view service endpoint config, indicate the smush.it HTTP service
smushit -c service

//change the config
smushit -c service=http://your-own-service-endpoint/
```

use it in node

```javascript
var smushit = require('node-smushit');
//smash a single file
smushit.smushit('images/need-to-smash.png');

//smash files
smushit.smushit(['file1', 'fiel2', ..]);

//smash images in directory
smushit.smushit('images-folder-path');

//smash images in directory or the child-directories with recursive
smushit.smushit('images-folder-path', {recursive: true});

//smash images and register callbacks
smushit.smushit('images-folder-path', {
    onItemStart: function(item){
	
    },
    onItemComplete: function(e, item, response){
	
    },
    onComplete: function(reports){
	
    },
    service: 'http://my-custom-domain-service/'
});
```

Changelog
------------
> v0.5.1
* modify the lib/smushit.js, change the regexp `/.+\//` -> `/.+[\/\\]/` bugfix: wrong filename writed to the request body under Windows. 

> v0.5.0
* modify the cli.js file to unix format for resolving issue #4

> v0.4.0
* change path.existsSync to fs.existsSync

> v0.3.0
* add custom smushit serivce feature
* add global service config for CLI
* can save the smashed file by new name

> v0.2.0
* add callback while the image(s) smashed completed

> v0.1.0
* smash by file, filelist, directory



