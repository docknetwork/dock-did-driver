require("dotenv").config();

//import DockSDK, {DIDModule} from 'client-sdk';
//import {ApiPromise, WsProvider} from "@polkadot/api";
const polkadot = require('@polkadot/api');
const sdkMod = require('client-sdk');

var HTTP_PORT = process.env.HTTP_PORT;
var http = require('http');

const dock = new sdkMod.DockSDK('ws://127.0.0.1:9944');

function fetchDID(http_response, did) {
   console.log('Calling get');
   // const doc = await dock.did.get(did);
   // console.log('DID doc:', doc);
   // http_response.write(doc);
   // http_response.end();
   dock.did.get(did).then(function(http_response, did) {
      console.log('DID doc:', doc);
      http_response.write(doc);
      http_response.end();
   });
 }

//create a server object:
http.createServer(function (req, res) {
var url = req.url;
var parsedURL = new URL(url, `http://${req.headers.host}`);
// Match the pattern /1.0/identifiers/<DID>
let regex = new RegExp('\/1\.0\/identifiers\/([a-zA-Z0-9]+)');
var matches = regex.exec(parsedURL);

if(matches && matches.length > 1) {
    let did = matches[1];
    res.writeHead(200, { 'Content-Type': 'application/json+ld' });
    // TODO: Fetch the DID from the full node
    //res.write('<h1>DID is '+did+'<h1>');
    dock.init().then(function() {
      fetchDID(res, did);
    });
 } else {
    // Only a single URL querying the DID is supported.
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>Bad URL</h1> <br/> The URL path should be in this format: <i>/1.0/identifiers/&lt;DID&gt;</i>');
    res.end();
 }
}).listen(HTTP_PORT, '0.0.0.0', function(){
 console.log("Server running at port", HTTP_PORT);
});