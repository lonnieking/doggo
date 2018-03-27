module.exports = function layout(req, body) {

  const inlineStyles = `
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }
    .content {
      width: 90%;
      text-align: center;
      margin: 0 auto;
      margin-top: 50px;
      padding: 0 auto;
      font-family: sans-serif;
    }
    #selected-breed {
      font-size: 2.5em;
      font-weight: 600;
      margin: 30px;
    }
    #doggo {
      font-size: 5em;
    }
    input[type=text] {
      margin: 10px;
      width: 70%;
      font-size: .75em;
      padding: 3px;
      border: 1px solid black;
    }
    button {
      padding: 5px;
      font-size: 1em;
      font-weight: 600;
      border: 1px solid black;
      background-color: black;
      color: white;
    }
    button:hover {
      background-color: white;
      color: black;
    }
  `

  return `
    <!doctype html>
    <html>
      <head>
        <title>doggo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${inlineStyles}</style>
      </head>
      <body>
        <div class="content">
          <div id="doggo">🐶</div>
          <form action="/image" method="post">
            <div>
              <input name="fileUri" type="text" placeholder="url to an image of a doggo..." required />
            </div>
            <button id="file-submit">fetch</button>
          </form>
          ${body}
        </div>
      </body>
    </html>
  `
}
