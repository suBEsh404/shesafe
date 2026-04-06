"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTRACT_ABI = void 0;
exports.isConfigured = isConfigured;
exports.storeEvidenceHash = storeEvidenceHash;
exports.verifyEvidenceHash = verifyEvidenceHash;
const ethers_1 = require("ethers");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const env_1 = require("../config/env");
const CONTRACT_ABI = [
    'function storeEvidence(string evidenceHash, uint256 timestamp, string caseId) returns (bytes32)',
    'function verifyEvidence(string evidenceHash) view returns (bool)',
    'event EvidenceStored(bytes32 indexed recordKey, string evidenceHash, uint256 timestamp, string caseId, address indexed submittedBy)'
];
exports.CONTRACT_ABI = CONTRACT_ABI;
function isConfigured() {
    return Boolean(env_1.blockchain.rpcUrl && env_1.blockchain.contractAddress && env_1.blockchain.privateKey);
}
function getContract() {
    if (!isConfigured()) {
        throw new ApiError_1.default(500, 'Blockchain provider is not configured');
    }
    const provider = new ethers_1.ethers.JsonRpcProvider(env_1.blockchain.rpcUrl, env_1.blockchain.chainId);
    const wallet = new ethers_1.ethers.Wallet(env_1.blockchain.privateKey, provider);
    return new ethers_1.ethers.Contract(env_1.blockchain.contractAddress, CONTRACT_ABI, wallet);
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
