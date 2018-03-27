var test = require('tape')
var layout = require('../../src/shared/layout.js')

test('returns layout including the specified body', t=> {
  t.plan(1)
  layout = layout(null, `test-body`);
  if(layout.match(/test-body/i)) t.ok(true, 'provided html rendered')
  else t.fail('provided html not rendered')
})

