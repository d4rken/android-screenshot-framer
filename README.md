# android-screenshot-framer
A really dirty port of https://developer.android.com/distribute/tools/promote/device-art.html into a node.js script.


Usage:

```
node frame.js --path=/search/for/**/*.png
```

* `--path=/some/path/**/*.png"` a path where to recursively search for .png files.
* `--dryrun` to just show pathes.
* `--postfix=framed` to create `pic_framed.png from `pic.png`, if you don't specify a postfix the original will be overwritten
* `--device=nexus_5`, only nexus_5 works atm, which is also the default, other layouts have the wrong offsets.

Example:

```
node frame.js --path=test/*.png --device=nexus_5 --postfix=_framed --dryrun
test/2016-09-28 12.05.22.png --> test/2016-09-28 12.05.22_framed.png (nexus_5)
test/2016-09-28 12.05.37.png --> test/2016-09-28 12.05.37_framed.png (nexus_5)
test/2016-09-28 13.15.31.png --> test/2016-09-28 13.15.31_framed.png (nexus_5)
test/2016-09-28 13.15.42.png --> test/2016-09-28 13.15.42_framed.png (nexus_5)
test/2016-09-28 13.15.46.png --> test/2016-09-28 13.15.46_framed.png (nexus_5)
test/2016-09-28 13.25.53.png --> test/2016-09-28 13.25.53_framed.png (nexus_5)
All submitted (dryrun: true)
``