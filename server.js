// server.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createServer } = require("http");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const next = require("next");

const dev = false; // always false in production
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    return handle(req, res);
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(
      "▶ Next.js SSR server running on port " + (process.env.PORT || 3000)
    );
  });
});
