var arc = require('@architect/functions')
var uuid = require('uuid')
const rp = require('request-promise')
var aws = require('aws-sdk')
var s3 = new aws.S3();

function route(req, res) {
  console.log(JSON.stringify(req, null, 2));

  var bucketName = "doggo-app-images"
  var fileLocation = req.body.fileUri
  var fileMatchPattern = /\.(jpe?g|png|gif)$/i
  var urlMatchPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
  var fileExt = fileLocation.match(fileMatchPattern)

  if(fileExt && urlMatchPattern.test(fileLocation)) {
    var imageKey = uuid.v4() + fileExt[0]
    var options = { uri: fileLocation, encoding: null }

    rp.get(options, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log(`failed to get image: ${error}`)
        if(error) res(error)
      }
      else {
        var params = { Bucket: bucketName, Key: imageKey, Body: body }

        s3.putObject(params, (error, _data) => {
          if(error) res(error)
          else res({ location: req._url('/image/' + imageKey) })
        })
      }
    })
  }
  else res({ location: req._url('/') })
}

exports.handler = arc.html.post(route)
