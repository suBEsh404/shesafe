const { ethers } = require('ethers');
const ApiError = require('../utils/ApiError');
const { blockchain } = require('../config/env');

const CONTRACT_ABI = [
  'function storeEvidence(string evidenceHash, uint256 timestamp, string caseId) returns (bytes32)',
  'function verifyEvidence(string evidenceHash) view returns (bool)',
  'event EvidenceStored(bytes32 indexed recordKey, string evidenceHash, uint256 timestamp, string caseId, address indexed submittedBy)'
];

function isConfigured() {
  return Boolean(blockchain.rpcUrl && blockchain.contractAddress && blockchain.privateKey);
}

function getContract() {
  if (!isConfigured()) {
    throw new ApiError(500, 'Blockchain provider is not configured');
  }

  const provider = new ethers.JsonRpcProvider(blockchain.rpcUrl, blockchain.chainId);
  const wallet = new ethers.Wallet(blockchain.privateKey, provider);
  return new ethers.Contract(blockchain.contractAddress, CONTRACT_ABI, wallet);
}

async function storeEvidenceHash({ evidenceHash, timestamp, caseId }) {
  const contract = getContract();
  const transaction = await contract.storeEvidence(evidenceHash, BigInt(timestamp), caseId || '');
  const receipt = await transaction.wait();

  return {
    txHash: transaction.hash,
    receipt
  };
}

async function verifyEvidenceHash(evidenceHash) {
  const contract = getContract();
  return contract.verifyEvidence(evidenceHash);
}

module.exports = {
  isConfigured,
  storeEvidenceHash,
  verifyEvidenceHash,
  CONTRACT_ABI
};
