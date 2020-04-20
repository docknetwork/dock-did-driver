import http from 'http';
import dock from '@dock/sdk';

// Match the pattern /1.0/identifiers/<DID>
const identifierRegex = new RegExp('\/1\.0\/identifiers\/did:dock:([a-zA-Z0-9]+)');

// Load environment variables from .env config
require("dotenv").config();

// Define HTTP request handler
function onRequest(req, res) {
  // Always send JSON
  res.setHeader('Content-Type', 'application/json');

  // TODO: check if SDK is still connected, if not, reconnect?
  // SDK doesnt currently support checking connection status easily

  // Check if URL is valid to get a DID
  const matches = identifierRegex.exec(req.url);
  if (matches && matches.length > 1) {
    // Fetch DID document
    dock.did.getDocument(matches[1])
      .then(document => {
        res.end(JSON.stringify(document, null, 2));
      })
      .catch(error => {
        res.statusCode = 400;
        res.end(JSON.stringify({
          error: error.toString()
        }));
      });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({
      error: 'Invalid URL, should be in this format: /1.0/identifiers/<DID>'
    }));
  }
}

// Listen for connections
const server = http.createServer(onRequest);
server.listen(process.env.HTTP_PORT, process.env.HTTP_ADDRESS, () => {
  console.log('Dock DID driver running on port', process.env.HTTP_PORT, ', connecting to node now...');

  dock.init({
    address: process.env.NODE_ADDRESS
  })
    .then(() => {
      console.log('Connected to node, ready to serve DIDs!');
    })
    .catch(error => {
      console.log('Can\'t connect to node, error:', error);
      process.exit(0);
    });
});
