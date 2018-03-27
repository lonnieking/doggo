var arc = require('@architect/functions')
var layout = require('@architect/shared/layout.js')
var breeds = require('./breeds.js')
var aws = require('aws-sdk')
var rekognition = new aws.Rekognition({region: 'ap-southeast-2'});

function route(req, res) {
  console.log(JSON.stringify(req, null, 2))

  var imageId = req.params.id
  var imageHost = "https://doggo-app-images.s3.amazonaws.com/"
  var bucketName = "doggo-app-images"
  var params = {
    Image: {
      S3Object: {
        Bucket: bucketName,
        Name: imageId
      }
    },
    MaxLabels: 10,
    MinConfidence: 70
  }
  var body = ''

  rekognition.detectLabels(params, (err, data) => {
    if(err) res(err)

    else if(data.Labels.length > 0) {
      var selectedBreed = data.Labels.filter(label => breeds.includes(label.Name))[0]
      var message = `The robots couldn't work it out this time.`
      var image = ``

      if(selectedBreed) {
        image = `<img src="${imageHost}${imageId}" alt="${selectedBreed.Name}"/>`
        message = `That's a ${selectedBreed.Name}`
      }
      else {
        message = "Sorry, that doesn't look like a dog to me."
      }
    }

    res({ html: layout(req, `<div id=selected-breed>${message}</div>${image}`) })
  })
}

exports.handler = arc.html.get(route)


