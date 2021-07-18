let http = require("http");
let https = require("https");
let unzipper = require("unzipper");
let querystring = require("querystring");

// 2.auth路由: 接受code, 用code+client_id+client_secret换取token
function auth(req, res) {
  let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  getToken(query.code, function (info) {
    console.log(info);
    // res.write(JSON.stringify(info));
    res.write(
      `<a href='http://localhost:8083/?token=${info.access_token}'>publish</a>`
    );
    res.end();
  });
}

function getToken(code, callback) {
  let request = https.request(
    {
      hostname: "github.com",
      path: `/login/oauth/access_token?code=${code}&client_id=Iv1.1fa959a4e538c3ff&client_secret=ba49218a0286bab3374f5d3bc4ecf7d2aa52e17b`,
      port: 443,
      method: "POST",
    },
    function (res) {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk.toString();
      });
      res.on("end", (chunk) => {
        let o = querystring.parse(body);
        callback(o);
      });
    }
  );
  request.end();
}

// 4.publish路由:用token获取用户信息，检查权限,接受发布
function publish(req, res) {
  let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  getUser(query.token, (info) => {
    if (info.login === "liuwenjie123007") {
      //req.pipe(outFile);
      req.pipe(unzipper.Extract({ path: "../server/public/" }));
      req.on("end", function () {
        res.end("success!");
      });
    }
  });
}

function getUser(token, callback) {
  let request = https.request(
    {
      hostname: "api.github.com",
      path: `/user`,
      port: 443,
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "toy-publis-wenjie",
      },
    },
    function (res) {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk.toString();
      });
      res.on("end", (chunk) => {
        callback(JSON.parse(body));
      });
    }
  );
  request.end();
}

http
  .createServer(function (req, res) {
    if (req.url.match(/^\/auth\?/)) return auth(req, res);
    if (req.url.match(/^\/publish\?/)) return publish(req, res);
  })
  .listen(8082);