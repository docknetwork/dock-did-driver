import http from 'http';
import cbor from 'cbor';
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

function jsonToStr(doc) {
  return JSON.stringify(doc, null, 2);
}

function jsonToCborStr(doc) {
  const cborBuff = cbor.encode(doc);
  return cborBuff.toString('utf8');
}

const docWrappers = {
  'application/did+ld+json': jsonToStr,
  'application/did+json': jsonToStr,
  'application/did+cbor': jsonToCborStr,
  'none': (doc, contentType) => jsonToStr(wrapDocument(doc, contentType)),
};

const defaultContentType = 'application/did+ld+json';

function returnError(res, error, code = 400) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.end(JSON.stringify({
    error: error.toString()
  }));
}

// Define HTTP request handler
async function onRequest(req, res) {
  let requestedHeader = req.headers && req.headers.accept;
  if (requestedHeader && !docWrappers[requestedHeader]) {
    requestedHeader = undefined;
  }

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
      returnError(res, error);
      return;
    }
  }

  // Determine expected content type
  const contentType = requestedHeader || 'application/did+ld+json';
  res.setHeader('Content-Type', contentType);

  // Check if URL is valid to get a DID
  const matches = identifierRegex.exec(req.url);
  if (matches && matches.length > 1) {
    // Fetch DID document
    dock.did.getDocument(matches[1])
      .then(document => {
        const wrapperMethod = docWrappers[requestedHeader || 'none'];
        res.end(wrapperMethod(document, contentType));
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
