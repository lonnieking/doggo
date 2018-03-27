var test = require('tape')
var arc = require('@architect/workflows')
var request = require('request')

var req = request.defaults({ jar: true })
var end

test('start', t=> {
  t.plan(1)

  arc.sandbox.start(done=> {
    t.ok(true, 'started')
    end = done
  })
})

test('get /', t=> {
  t.plan(1)

  req('http://localhost:3333', function _get(err, res, body) {
    if (err) {
      console.log('ERROR: ' + err)
      t.fail(err)
    }
    else if(res.statusCode != 200) {
      console.log(body)
      t.fail(body)
    }
    else {
      t.ok(true, 'body')
    }
  })
})

test('response body uses shared page layout', t=> {
  t.plan(1)

  req('http://localhost:3333', function _get(err, res, body) {
    if (err) {
      console.log('ERROR: ' + err)
      t.fail(err)
    }
    else if(body.match(/<title>doggo<\/title>/i)) {
      t.ok(true, 'body')
    }
    else {
      console.log(body)
      t.fail(body)
    }
  })
})

test('response contains image upload form', t=> {
  t.plan(1)

  req('http://localhost:3333', function _get(err, res, body) {
    if (err) {
      console.log('ERROR: ' + err)
      t.fail(err)
    }
    else if(body.match(/<form action="\/image" method="post">/i)) {
      t.ok(true, 'body')
    }
    else {
      console.log(body)
      t.fail(body)
    }
  })
})

test('close', t=> {
  t.plan(1)
  t.ok(true, 'closed')
  end()
})
