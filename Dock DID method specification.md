# Dock DID method specification

Version: 0.1

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
Dock is currently running as a proof of authority network but will evolve into a proof of stake chain. DIDs can be created 
by anyone holding Dock tokens but the creator of the DID is not necessarily the owner of the DID and thus cannot manage 
(update, remove) them. DIDs are managed using their corresponding private keys and these keys are independent of keys 
controlling the Dock tokens spent while creating the DID.  
The chain does not store the full DID document but only the DID, the corresponding keys and controllers and block number 
for the last update and this block number changes with each update to the DID. This is needed for replay protection. Dock's 
client SDK retrieves those details and constructs the full DID document.  
Currently, Dock supports registering a new DID with only one public key on chain. The key can be rotated by providing a 
signed message from the current key. The DID can be removed by providing a signed message from the current key. In future, 
multiple keys for authentication and authorization and other relevant W3C compliant features will be supported. 

## DID support in Dock SDK
The SDK supports CRUD operations with the DID.

1. To create a new DID, a DID, a public key and a controller are needed. The controller is the owner of the public key and is also a DID. 
It can be the same as the DID being created or different. A public key of one of the three supported types is needed. The public key can 
either be generated using the SDK or passed from outside. Similarly for the DID, it can be either generated from the SDK or passed from 
outside as 32 bytes. The DID and public key are not cryptographically related. For more details, check [this example in SDK documentation](https://github.com/docknetwork/sdk/blob/master/tutorials/src/tutorial_did.md#did-creation).
1. To rotate key of an existing DID, the current key is used to sign an update message containing the new public key and optionally 
the new controller (if controller is not supplied, the controller remains unchanged). The update message contains the block number 
for the last update of the DID. For details, check [this example in the SDK documentation](https://github.com/docknetwork/sdk/blob/master/tutorials/src/tutorial_did.md#updating-an-existing-did-on-chain).
1. To remove an existing DID, the current key is used to sign a remove message with the block number for the last update. For 
more details, check [the SDK documentation](https://github.com/docknetwork/sdk/blob/master/tutorials/src/tutorial_did.md#removing-an-existing-did-from-chain).

The SDK supports DID resolvers for resolving DIDs. For more refer [this section](https://docknetwork.github.io/sdk/tutorials/tutorial_resolver.html) 
in the SDK documentation.  

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