import http from 'http';
import dock from '@docknetwork/sdk';

// Match the pattern /1.0/identifiers/<DID>
const identifierRegex = new RegExp('\/1\.0\/identifiers\/(did:dock:[a-zA-Z0-9]+)');

// Load environment variables from .env config
require("dotenv").config();

function wrapDocument(document, contentType) {
  return {
    didResolutionMetadata: {
      contentType,
    },
    didDocument: document,
    didDocumentMetadata: {}
  };
}

// Define HTTP request handler
async function onRequest(req, res) {
  // Connect to node if not connected
  if (!dock.isConnected) {
    try {
      console.log('Connecting to node...');
      await dock.init({
        address: process.env.NODE_ADDRESS
      });
      console.log('Connected to node, ready to serve DIDs!');
    } catch (error) {
      console.log('Can\'t connect to node, error:', error);
      return;
    }
  }

  // TODO: detect requested content type!

  const contentType = 'application/did+ld+json';

  // Always send JSON
  res.setHeader('Content-Type', contentType);

  // Check if URL is valid to get a DID
  const matches = identifierRegex.exec(req.url);
  if (matches && matches.length > 1) {
    // Fetch DID document
    dock.did.getDocument(matches[1])
      .then(document => {
        res.end(JSON.stringify(wrapDocument(document, contentType), null, 2));
      })
      .catch(error => {
        res.statusCode = 404;
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
  console.log('Dock DID driver running on port', process.env.HTTP_PORT);
});
