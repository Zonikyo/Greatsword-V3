/*
Copyright © Fog Network
Made by Nebelung
MIT license: https://opensource.org/licenses/MIT
*/

const express = require("express")
const app = express()
const fetch = require("node-fetch")
const config = require("./config.json")
const port = process.env.PORT || config.port
const Corrosion = require("./lib/server")

const proxy = new Corrosion({
    prefix: config.prefix,
    codec: config.codec,
    title: "Greatsword",
    forceHttps: true,
    requestMiddleware: [
        Corrosion.middleware.blacklist([
            "accounts.google.com, pornhub.com, xvideos.com, xnxx.com, xhamster.com, chaturbate.com, pornhubpremium.com",
        ], "Page is blocked by NeonWave. NeonWave does not allow you to access innapropriate content, please go back and find something else to unblock. Sorry."),
    ]
});

proxy.bundleScripts();

app.use(express.static("./public", {
    extensions: ["html"]
}));

app.get("/", function(req, res){
    res.sendFile("index.html", {root: "./public"});
});

app.get("/suggestions", function(req, res){
async function getsuggestions() {
var term = req.query.q || "";
var response = await fetch("https://duckduckgo.com/ac/?q=" + term + "&type=list");
var result = await response.json();
var suggestions = result[1]
res.send(suggestions)
}
getsuggestions()
});

app.use(function (req, res) {
    if (req.url.startsWith(proxy.prefix)) {
      proxy.request(req,res);
    } else {
      res.status(404).sendFile("404.html", {root: "./public"});
    }
})

app.listen(port, () => {
    console.log(`Greatsword V3 is running at localhost:${port}`)
})
