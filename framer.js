// Device manifest.
var DEVICES = [
    {
        id: 'nexus_5',
        title: 'Nexus 5',
        url: 'https://www.google.com/nexus/5/',
        physicalSize: 5,
        physicalHeight: 5.43,
        density: 'XXHDPI',
        landRes: ['shadow', 'back', 'fore'],
        landOffset: [436, 306],
        portRes: ['shadow', 'back', 'fore'],
        portOffset: [145, 202],
        portSize: [1080, 1920]
    }, {
        id: 'nexus_5x',
        title: 'Nexus 5X',
        url: 'https://www.google.com/nexus/5x/',
        physicalSize: 5.2,
        physicalHeight: 5.625,
        density: '420DPI',
        landRes: ['shadow', 'back', 'fore'],
        landOffset: [485, 313],
        portRes: ['shadow', 'back', 'fore'],
        portOffset: [305, 485],
        portSize: [1080, 1920],
    }, {
        id: 'nexus_6',
        title: 'Nexus 6',
        url: 'https://www.google.com/nexus/6/',
        physicalSize: 6,
        physicalHeight: 6.27,
        density: '560DPI',
        landRes: ['shadow', 'back', 'fore'],
        landOffset: [489, 327],
        portRes: ['shadow', 'back', 'fore'],
        portOffset: [327, 489],
        portSize: [1440, 2560]
    }, {
        id: 'nexus_6p',
        title: 'Nexus 6P',
        url: 'https://www.google.com/nexus/6p/',
        physicalSize: 5.7,
        physicalHeight: 6.125,
        density: '560DPI',
        landRes: ['shadow', 'back', 'fore'],
        landOffset: [579, 321],
        portRes: ['shadow', 'back', 'fore'],
        portOffset: [312, 579],
        portSize: [1440, 2560]
    }, {
        id: 'nexus_7',
        title: 'Nexus 7',
        url: 'http://www.google.com/nexus/7/',
        physicalSize: 7,
        physicalHeight: 8,
        actualResolution: [1200, 1920],
        density: 'XHDPI',
        landRes: ['shadow', 'back', 'fore'],
        landOffset: [260, 200],
        portRes: ['shadow', 'back', 'fore'],
        portOffset: [244, 326],
        portSize: [800, 1280],
    }, {
        id: 'nexus_9',
        title: 'Nexus 9',
        url: 'https://www.google.com/nexus/9/',
        physicalSize: 9,
        physicalHeight: 8.98,
        actualResolution: [1536, 2048],
        density: 'XHDPI',
        landRes: ['shadow', 'back', 'fore'],
        landOffset: [404, 100],
        portRes: ['shadow', 'back', 'fore'],
        portOffset: [348, 514],
        portSize: [1536, 2048]
    }, {
        id: 'nexus_10',
        title: 'Nexus 10',
        url: 'https://www.google.com/nexus/10/',
        physicalSize: 10,
        physicalHeight: 7,
        actualResolution: [1600, 2560],
        density: 'XHDPI',
        landRes: ['shadow', 'back', 'fore'],
        landOffset: [227, 217],
        portRes: ['shadow', 'back', 'fore'],
        portOffset: [217, 223],
        portSize: [800, 1280]
    }, {
        id: 'nexus_4',
        title: 'Nexus 4',
        url: 'https://www.google.com/nexus/4/',
        physicalSize: 4.7,
        physicalHeight: 5.27,
        density: 'XHDPI',
        landRes: ['shadow', 'back', 'fore'],
        landOffset: [349, 214],
        portRes: ['shadow', 'back', 'fore'],
        portOffset: [213, 350],
        portSize: [768, 1280]
    }
];

DEVICES = DEVICES.sort(function (x, y) {
    return x.physicalSize - y.physicalSize;
});

var fs = require("fs");
var Canvas = require('canvas');
var Image = Canvas.Image;

/**
 * Returns the device from DEVICES with the given id.
 */
function getDeviceById(id) {
    for (var i = 0; i < DEVICES.length; i++) {
        if (DEVICES[i].id == id) return DEVICES[i];
    }
}

/**
 * Generates the frame from the current selections (currentImage and currentDevice).
 */
function createFrame(currentDevice, destinationFile, currentImage) {
    var port;

    var aspect1 = currentImage.width / currentImage.height;
    var aspect2 = currentDevice.portSize[0] / currentDevice.portSize[1];

    if (aspect1 == aspect2) {
        port = true;
    } else if (aspect1 == 1 / aspect2) {
        port = false;
    } else {
        console.log('Error: ' + destinationFile + ': The screenshot must have an aspect ratio of ' +
            aspect2.toFixed(3) + ' or ' + (1 / aspect2).toFixed(3) +
            ' (ideally ' + currentDevice.portSize[0] + 'x' + currentDevice.portSize[1] +
            ' or ' + currentDevice.portSize[1] + 'x' + currentDevice.portSize[0] + ').');
        return;
    }

    // Load image resources
    var res = port ? currentDevice.portRes : currentDevice.landRes;
    var resList = {};
    for (var i = 0; i < res.length; i++) {
        resList[res[i]] = 'device-art-resources/' + currentDevice.id + '/' +
            (port ? 'port_' : 'land_') + res[i] + '.png'
    }

    var resourceImages = {};
    loadImageResources(resList, function (r) {
        resourceImages = r;
        continueWithResources_();
    });

    function continueWithResources_() {
        var width = resourceImages['back'].width;
        var height = resourceImages['back'].height;
        var offset = port ? currentDevice.portOffset : currentDevice.landOffset;
        var size = port ? currentDevice.portSize : [currentDevice.portSize[1], currentDevice.portSize[0]];

        var canvas = new Canvas();
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        if (resourceImages['shadow']) {
            ctx.drawImage(resourceImages['shadow'], 0, 0);
        }
        ctx.drawImage(resourceImages['back'], 0, 0);

        ctx.fillStyle = '#000';
        ctx.fillRect(offset[0], offset[1], size[0], size[1]);
        ctx.drawImage(currentImage, offset[0], offset[1], size[0], size[1]);

        if (resourceImages['fore']) {
            ctx.drawImage(resourceImages['fore'], 0, 0);
        }

        var out = fs.createWriteStream(destinationFile);
        var stream = canvas.pngStream();

        stream.on('data', function (chunk) {
            out.write(chunk);
        });

        stream.on('end', function () {
            console.log('Saved: ' + destinationFile);
        });
    }
}

/**
 * Loads an image from a data URI. The callback will be called with the <img> once
 * it loads.
 */
function loadImageFromUri(file, callback) {
    fs.readFile(file, function (err, squid) {
        if (err) throw err;
        img = new Image;
        img.src = squid;
        callback(img)
    });
}

/**
 * Loads a set of images (organized by ID). Once all images are loaded, the callback
 * is triggered with a dictionary of <img>'s, organized by ID.
 */
function loadImageResources(images, callback) {
    var imageResources = {};

    var checkForCompletion_ = function () {
        for (var id in images) {
            if (!(id in imageResources)) return;
        }
        (callback || function () {
        })(imageResources);
        callback = null;
    };

    for (var id in images) {
        var img = new Image;
        img.src = images[id];
        (function (img, id) {
            fs.readFile(images[id], function (err, squid) {
                if (err) {
                    imageResources[id] = null;
                    checkForCompletion_();
                } else {
                    img = new Image;
                    img.src = squid;
                    imageResources[id] = img;
                    checkForCompletion_();
                }
            });
        })(img, id);
    }
}

module.exports = function frameImg(sourceFile, deviceId, destinationFile) {
    var currentDevice = getDeviceById(deviceId);
    loadImageFromUri(sourceFile, function (img) {
        createFrame(currentDevice, destinationFile, img);
    });
};