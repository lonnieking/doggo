var test = require('tape')
var arc = require('@architect/workflows')
var request = require('request')
var requestPromise = require('request-promise')
var aws = require('aws-sdk-mock')
var sinon = require('sinon')
var req = request.defaults({ jar: true })
var end

test('start', t=> {
  t.plan(1)

  arc.sandbox.start(done => {
    t.ok(true, 'started')
    end = done
  })
})

test('post /image', t=> {
  t.plan(3)

  var s3Mock = aws.mock('S3', 'putObject', {});
  sinon.stub(requestPromise, 'get').yields(null, { statusCode: 200 }, 'foo')

  var url = 'http://localhost:3333/image'
  var request = { fileUri: 'http://www.doggos.com/image.jpg' }

  req.post({ url: url, form: request }, (err, res, body) => {
    if(err) t.fail(err)
    if(res.statusCode == 302 && res.body.match(/Redirecting to \/image\/*/)) {
      t.ok(true, 'redirects to results page on success')
    }
  })

  var request = { fileUri: 'image.jpg' }

  req.post({ url: url, form: request }, (err, res, body) => {
    if(err) t.fail(err)
    if(res.statusCode == 302 && res.body.match(/Redirecting to \//)) {
      t.ok(true, 'redirects to index on invalid url' )
    }
  })

  var request = { fileUri: 'http://www.doggos.com/image.tiff' }

  req.post({ url: url, form: request }, (err, res, body) => {
    if(err) t.fail(err)
    if(res.statusCode == 302 && res.body.match(/Redirecting to \//)) {
      t.ok(true, 'redirects to index on invalid image format' )
    }
  })
})

test('close', t=> {
  t.plan(1)
  t.ok(true, 'closed')
  end()
})
