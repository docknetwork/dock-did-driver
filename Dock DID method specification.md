# Dock DID method specification

Version: 0.2

## Overview
This document describes a new DID method for hosting DIDs on the [Dock](https://dock.io/) blockchain. Dock is a permissionless
chain built using [Substrate](https://www.parity.io/substrate/). Dock provides a W3C compliant DID and verifiable credentials
implementation.  

## DID Syntax
The method is named `dock` hence all Dock DIDs start with `did:dock`. The identifier is a [ss58](https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58))
string which is equivalent to base58 string and a checksum. Thus Dock DIDs are represented as `did:dock:<SS58 string>`.
However DIDs are stored as 32 raw bytes on the chain without the prefix `did:dock` to save space. The SDK supports querying
by either the fully qualified DID `did:dock:<SS58 string>` or the 32 byte hex string.

## Supported cryptography

Currently, three public key and signing algorithms are supported for authentication.

1. Schnorr signatures with Sr25519. The public key is 32 bytes and signature is 64 bytes in size. These are supported by Substrate and Polkadot.
1. EdDSA signatures with Ed25519 curve. The public key is 32 bytes and signature is 64 bytes in size.
1. ECDSA signatures with secp256k1 curve. Compressed public keys are used, hence the public key is 33 bytes in size. Signature is 65 bytes in size.

## Dock chain
Dock is currently running as a proof of stake chain. DIDs can be created
by anyone holding Dock tokens but the creator of the DID is not necessarily the owner of the DID and thus cannot manage
(update, remove) them. DIDs are managed using their corresponding private keys and these keys are independent of keys
controlling the Dock tokens spent while creating the DID.  
The chain does not store the full DID document but only the DID, the corresponding keys, controllers and service endpoints. 
Dock's client SDK retrieves those details and constructs the full DID document.  
Currently, Dock supports registering a DID with one or more public keys. More keys can be added by providing a
signed message from existing key with the appropriate privileges. Similarly controllers can be added or removed, service endpoints 
can be added or removed.  The DID can be removed by providing a signed message from an appropriate key or one of the controllers. 

## Example Dock DIDs

**DID with Sr25519 key**

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW",
  "authentication": [
    "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1"
  ],
  "assertionMethod": [
    "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1"
  ],
  "publicKey": [
    {
      "id": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1",
      "type": "Sr25519VerificationKey2020",
      "controller": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW",
      "publicKeyBase58": "8bEsU4JWBVVFQCdd8du7Txo6L3JHdJYQByHBqzL1WXwy"
    }
  ]
}
```

**DID with Ed25519 key**

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW",
  "authentication": [
    "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1"
  ],
  "assertionMethod": [
    "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1"
  ],
  "publicKey": [
    {
      "id": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1",
      "type": "Ed25519VerificationKey2018",
      "controller": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW",
      "publicKeyBase58": "AfeMnJvmf8ZXDyJq1xCQQkdwdhfSfBfVuQ5jyS2HZEmx"
    }
  ]
}
```

**DID with Secp256k1 key**

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW",
  "authentication": [
    "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1"
  ],
  "assertionMethod": [
    "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1"
  ],
  "publicKey": [
    {
      "id": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW#keys-1",
      "type": "EcdsaSecp256k1VerificationKey2019",
      "controller": "did:dock:5CEdyZkZnALDdCAp7crTRiaCq6KViprTM6kHUQCD8X6VqGPW",
      "publicKeyBase58": "2AaB7RdBuszV9gvY9R25yy8uLP8q1D1uw1Sd21bbP5Gum"
    }
  ]
}
```

## Privacy Considerations
The accounts used to send the transactions are independent of the keys associated with the DID. So the DID could have been created with one account, updated with another account and removed with another account. The accounts are not relevant
in the data model and not associated with the DID in the chain-state, they can however be discovered in the transaction log.  
To avoid being correlated, the different DIDs must be used.
