var arc = require('@architect/functions')
var layout = require('@architect/shared/layout.js')

function route(req, res) {
  console.log(JSON.stringify(req, null, 2))
  res({ html: layout(req, ``) })
}

exports.handler = arc.html.get(route)

