#!/usr/bin/env node
var framer = require('./framer');
var glob = require("glob");
var Rx = require('rxjs/Rx');
var argv = require('yargs').argv;

glob(argv.path + "/**/*.png", {}, function (err, files) {
    if (err) throw err;
    Rx.Observable.from(files)
        .subscribe(
            file => {
                var targetPath = file;
                if (argv.postfix) targetPath = targetPath.replace('.png', argv.postfix + '.png');

                var device = 'nexus_5';
                if (argv.device) device = argv.device;

                console.log(file + ' --> ' + targetPath + ' (' + device + ')');

                if (!argv.dryrun) framer(file, device, targetPath);
            },
            err => console.log('Error: ' + err),
            () => console.log('All submitted (dryrun: ' + argv.dryrun + ')')
        );
});