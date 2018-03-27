var test = require('tape')
var arc = require('@architect/workflows')
var request = require('request')
var req = request.defaults({ jar: true })
var aws = require('aws-sdk-mock')
var end

var detectedLabels = { Labels: [
  { Name: 'Dog', Confidence: '100' },
  { Name: 'Golden Retriever', Confidence: '89.12123453' },
  { Name: 'Pug', Confidence: '73.92348263489' }
]}

var rekognitionMock = aws.mock('Rekognition', 'detectLabels', (params, callback) => {
  callback(null, detectedLabels)
})

test('start', t=> {
  t.plan(1)

  arc.sandbox.start(done => {
    t.ok(true, 'started')
    end = done
  })
})

test('get /image/:id', t=> {
  t.plan(1)

  req.get('http://localhost:3333/image/uuid', (err, res, body) => {
    if(err) t.fail(err)
    if(res.body.match(/That's a Golden Retriever/)) t.ok(true, 'reports the breed with the highest confidence')
  })
})

test('close', t=> {
  t.plan(1)
  t.ok(true, 'closed')
  end()
})

