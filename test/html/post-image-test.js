var test = require('tape')
var arc = require('@architect/workflows')
var request = require('request')
var aws = require('aws-sdk-mock')
var sinon = require('sinon')
var proxyquire = require('proxyquire')
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
  var requestStub = sinon.stub(request, 'get').yields(null, { statusCode: 200 }, 'foo')

  proxyquire('../../src/html/post-image/index.js', {
    'request': requestStub
  })

  var url = 'http://localhost:3333/image'
  var formData = { fileUri: 'http://www.doggos.com/image.jpg' }

  req.post({ url: url, form: formData }, (err, res, body) => {
    if(err) t.fail(err)
    if(res.body.match(/Redirecting to \/*/)) {
      t.ok(true, 'redirects to index when the image is not found')
    }
  })

  var formData = { fileUri: 'image.jpg' }

  req.post({ url: url, form: formData }, (err, res, body) => {
    if(err) t.fail(err)
    if(res.statusCode == 302 && res.body.match(/Redirecting to \//)) {
      t.ok(true, 'redirects to index on invalid url' )
    }
  })

  var formData = { fileUri: 'http://www.doggos.com/image.docx' }

  req.post({ url: url, form: formData }, (err, res, body) => {
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
