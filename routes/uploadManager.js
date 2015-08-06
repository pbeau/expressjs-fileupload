var Imager = require('imager');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var async = require('async');
// config the uploader
var options = {
  variants: {
    article: {
      resize: {
        detail: 'x440'
      },
      crop: {

      },
      resizeAndCrop: {
        mini: { resize: '63504@', crop: '252x210' }
      }
    },

    gallery: {
      crop: {
        thumb: '100x100'
      }
    }
  },

  storage: {
    S3: {
      key: 'AKIAJTUSJMPN6VCYMNHA',
      secret: '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',
      bucket: 'bluimptest'
    }
  },

  debug: true
};

//var uploader = require('blueimp-file-upload-expressjs')(options);


module.exports = function (router) {
    router.get('/upload', function(req, res) {
        res.send();
    });

    router.post('/upload', multipartMiddleware, function(req, res) {
        var images = req.files.files
        ? [req.files.files]
        : undefined;
        if (!images || !images.length) {
            console.log('no images');
            return res.send(500, 'no images')
        }
        var imager = new Imager(options, 'S3');
        console.log(images, imager)
        var images2upload = []
        async.forEach(images, function(image,cb){
            images2upload.push(image[0]);
            cb();
        }, function(){
            imager.upload(images2upload, function (err, cdnUri, files) {
                console.log(cdnUri,files, err);            
                if (err) return res.send(500, err);
                res.send(files)
            }, 'article');


        })
        
    });

    router.delete('/uploaded/files/:name', function(req, res) {
      
      
    });
    return router;
}
