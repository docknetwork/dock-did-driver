# Dock DID method specification

Version: 0.1

## Overview
This document describes a new DID method for hosting DIDs on the [Dock](https://dock.io/) blockchain. Dock is a permissionless chain built using [Substrate](https://www.parity.io/substrate/). Dock provides a W3C compliant DID and verifiable credentials implementation.  

## DID Syntax
The method is named `dock` hence all Dock DIDs start with `did:dock`. The identifier is a [ss58](https://github.com/paritytech/substrate/wiki/External-Address-Format-(SS58)) string which is somewhat equivalent to base58 string and a checksum.  
Thus Dock DIDs are represented as `did:dock:<SS58 string>`. However DIDs are stored as 32 raw bytes on the chain without the prefix `did:dock` to save space. The SDK supports querying by either the fully qualified DID `did:dock:<SS58 string>` or the 32 byte hex string.

## Supported cryptography

Currently, three public key and signing algorithms are supported for authentication. 

1. Schnorr signatures with Sr25519. The public key is 32 bytes and signature is 64 bytes in size. These are supported by Substrate and Polkadot.
1. EdDSA signatures with Ed25519 curve. The public key is 32 bytes and signature is 64 bytes in size.
1. ECDSA signatures with secp256k1 curve. Compressed public keys are used, hence the public key is 32 bytes in size. Signature is 64 bytes in size.

## Dock chain
Dock is currently running as a proof of authority network but will evolve into a proof of stake chain. DIDs can be created by anyone holding Dock tokens but the creator of the DID is not necessarily the owner of the DID and thus cannot manage (update, remove) them. DIDs are managed using their corresponding private keys and these keys are independent of keys controlling the Dock tokens spent while creating the DID.  
The chain does not store the full DID document but only the DID, the corresponding keys and controllers and block number for the last update and this block number changes with each update to the DID. This is needed for replay protection. Dock's client SDK retrieves those details and constructs the full DID document.
Currently, Dock supports registering a new DID with only one public key on chain. The key can be rotated by providing a signed message from the current key. The DID can be removed by providing a signed message from the current key.  
In future, multiple keys for authentication and authorization and other relevant W3C compliant features will be supported. 

## Dock SDK
The SDK supports CRUD operations with the DID.

1. To create a new DID, a DID, a public key and a controller are needed. The controller is the owner of the public key and is also a DID. It can be the same as the DID being created or different. 
A public key of one of the three supported types is needed. The public key can either be generated using the SDK or passed from outside. Similarly for the DID, it can be either generated from the SDK or passed from outside as 32 bytes. The DID and public key are not cryptographically related.  
For details, check the SDK documentation.
1. To rotate key of an existing DID, the current key is used to sign an update message containing the new public key and optionally the new controller (if controller is not supplied, the controller remains unchanged). The update message contains the block number for the last update of the DID.  
For details, check the SDK documentation.
1. To remove an existing DID, the current key is used to sign a remove message with the block number for the last update.  
For details, check the SDK documentation.