// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EvidenceRegistry {
    struct EvidenceRecord {
        string evidenceHash;
        uint256 timestamp;
        string caseId;
        address submittedBy;
        bool exists;
    }

    mapping(bytes32 => EvidenceRecord) private records;

    event EvidenceStored(bytes32 indexed recordKey, string evidenceHash, uint256 timestamp, string caseId, address indexed submittedBy);

    function storeEvidence(string calldata evidenceHash, uint256 timestamp, string calldata caseId) external returns (bytes32) {
        bytes32 recordKey = keccak256(bytes(evidenceHash));
        records[recordKey] = EvidenceRecord({
            evidenceHash: evidenceHash,
            timestamp: timestamp,
            caseId: caseId,
            submittedBy: msg.sender,
            exists: true
        });

        emit EvidenceStored(recordKey, evidenceHash, timestamp, caseId, msg.sender);
        return recordKey;
    }

    function verifyEvidence(string calldata evidenceHash) external view returns (bool) {
        bytes32 hashKey = keccak256(bytes(evidenceHash));
        return records[hashKey].exists && keccak256(bytes(records[hashKey].evidenceHash)) == keccak256(bytes(evidenceHash));
    }

    function getEvidence(string calldata evidenceHash) external view returns (string memory, uint256, string memory, address, bool) {
        bytes32 hashKey = keccak256(bytes(evidenceHash));
        EvidenceRecord storage record = records[hashKey];
        return (record.evidenceHash, record.timestamp, record.caseId, record.submittedBy, record.exists);
    }
}
