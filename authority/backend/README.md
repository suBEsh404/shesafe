# Women Safety Evidence Locker Backend

Production-oriented Node.js + Express backend for secure evidence capture, encryption, tamper-proof hashing, blockchain notarization, and role-based sharing.

## Features
- JWT authentication with refresh tokens
- AES-256-GCM encryption before storage
- Cloudinary-backed encrypted uploads
- Optional IPFS storage adapter hook
- Blockchain hash notarization through ethers.js
- Evidence verification against on-chain hashes
- Emergency and travel batching flows
- Access control and chain-of-custody logs
- MongoDB models for users, evidence, access grants, and emergency sessions
- Queue-ready structure for blockchain writes and file processing

## Quick Start
1. Copy `.env.example` to `.env` and fill in the values.
2. Install dependencies with `npm install`.
3. Start MongoDB, Redis, Cloudinary, and the blockchain RPC provider as needed.
4. Run the server with `npm run dev`.

## Notes
- Files are never written to blockchain.
- Only hashes and metadata are stored on-chain.
- The smart contract reference lives in `contracts/EvidenceRegistry.sol`.
