// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceManagementSystem {
    
    enum UserRole { None, PublicViewer, Investigator, ForensicAnalyst, LegalProfessional, CourtOfficial, EvidenceManager, Auditor, Administrator }
    enum CaseStatus { Open, UnderReview, Closed, Archived }
    enum EvidenceStatus { Submitted, Verified, Challenged, Accepted, Rejected }
    
    struct User {
        string fullName;
        string badgeNumber;
        string department;
        UserRole role;
        bool isActive;
        bool isRegistered;
        uint256 registrationDate;
    }
    
    struct Case {
        string caseNumber;
        string caseTitle;
        string description;
        CaseStatus status;
        address leadInvestigator;
        uint256 createdAt;
        bool releasedToPublic;
        bool exists;
    }
    
    struct Evidence {
        string evidenceId;
        string caseNumber;
        string description;
        string ipfsHash;
        string fileType;
        address submittedBy;
        uint256 submissionTime;
        EvidenceStatus status;
        bool releasedToPublic;
        bool exists;
    }
    
    mapping(address => User) public users;
    mapping(string => Case) public cases;
    mapping(string => Evidence) public evidence;
    
    string[] public caseNumbers;
    string[] public evidenceIds;
    string[] public publicCaseNumbers;
    string[] public publicEvidenceIds;
    
    uint256 public totalUsers;
    address public admin;
    
    event UserRegistered(address indexed user, string name, UserRole role);
    event CaseCreated(string indexed caseNumber, address investigator);
    event EvidenceSubmitted(string indexed evidenceId, string caseNumber, address submitter);
    event CaseReleasedToPublic(string indexed caseNumber, address releasedBy);
    event EvidenceReleasedToPublic(string indexed evidenceId, address releasedBy);
    
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered && users[msg.sender].isActive, "User not registered or inactive");
        _;
    }
    
    modifier onlyInvestigator() {
        require(users[msg.sender].role == UserRole.Investigator || users[msg.sender].role == UserRole.Administrator, "Only investigators allowed");
        _;
    }
    
    modifier canReleaseToPublic() {
        require(
            users[msg.sender].role == UserRole.CourtOfficial || 
            users[msg.sender].role == UserRole.EvidenceManager || 
            users[msg.sender].role == UserRole.Administrator, 
            "Only court officials, evidence managers, or administrators can release to public"
        );
        _;
    }
    
    constructor() {
        admin = msg.sender;
        users[msg.sender] = User({
            fullName: "System Administrator",
            badgeNumber: "ADMIN001",
            department: "System Administration",
            role: UserRole.Administrator,
            isActive: true,
            isRegistered: true,
            registrationDate: block.timestamp
        });
        totalUsers = 1;
    }
    
    function registerUser(
        string memory _fullName,
        string memory _badgeNumber,
        string memory _department,
        UserRole _role
    ) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(_role != UserRole.None && _role != UserRole.Administrator, "Invalid role");
        
        users[msg.sender] = User({
            fullName: _fullName,
            badgeNumber: _badgeNumber,
            department: _department,
            role: _role,
            isActive: true,
            isRegistered: true,
            registrationDate: block.timestamp
        });
        
        totalUsers++;
        emit UserRegistered(msg.sender, _fullName, _role);
    }
    
    function registerAsPublicViewer(string memory _fullName) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            fullName: _fullName,
            badgeNumber: "",
            department: "Public",
            role: UserRole.PublicViewer,
            isActive: true,
            isRegistered: true,
            registrationDate: block.timestamp
        });
        
        totalUsers++;
        emit UserRegistered(msg.sender, _fullName, UserRole.PublicViewer);
    }
    
    function createCase(
        string memory _caseNumber,
        string memory _title,
        string memory _description
    ) public onlyInvestigator {
        require(!cases[_caseNumber].exists, "Case already exists");
        
        cases[_caseNumber] = Case({
            caseNumber: _caseNumber,
            caseTitle: _title,
            description: _description,
            status: CaseStatus.Open,
            leadInvestigator: msg.sender,
            createdAt: block.timestamp,
            releasedToPublic: false,
            exists: true
        });
        
        caseNumbers.push(_caseNumber);
        emit CaseCreated(_caseNumber, msg.sender);
    }
    
    function submitEvidence(
        string memory _evidenceId,
        string memory _caseNumber,
        string memory _description,
        string memory _ipfsHash,
        string memory _fileType
    ) public onlyRegistered {
        require(!evidence[_evidenceId].exists, "Evidence already exists");
        require(cases[_caseNumber].exists, "Case does not exist");
        
        evidence[_evidenceId] = Evidence({
            evidenceId: _evidenceId,
            caseNumber: _caseNumber,
            description: _description,
            ipfsHash: _ipfsHash,
            fileType: _fileType,
            submittedBy: msg.sender,
            submissionTime: block.timestamp,
            status: EvidenceStatus.Submitted,
            releasedToPublic: false,
            exists: true
        });
        
        evidenceIds.push(_evidenceId);
        emit EvidenceSubmitted(_evidenceId, _caseNumber, msg.sender);
    }
    
    function releaseCaseToPublic(string memory _caseNumber) public canReleaseToPublic {
        require(cases[_caseNumber].exists, "Case does not exist");
        require(!cases[_caseNumber].releasedToPublic, "Case already released to public");
        
        cases[_caseNumber].releasedToPublic = true;
        publicCaseNumbers.push(_caseNumber);
        emit CaseReleasedToPublic(_caseNumber, msg.sender);
    }
    
    function releaseEvidenceToPublic(string memory _evidenceId) public canReleaseToPublic {
        require(evidence[_evidenceId].exists, "Evidence does not exist");
        require(!evidence[_evidenceId].releasedToPublic, "Evidence already released to public");
        
        evidence[_evidenceId].releasedToPublic = true;
        publicEvidenceIds.push(_evidenceId);
        emit EvidenceReleasedToPublic(_evidenceId, msg.sender);
    }
    
    function getPublicCases() public view returns (string[] memory) {
        return publicCaseNumbers;
    }
    
    function getPublicEvidence() public view returns (string[] memory) {
        return publicEvidenceIds;
    }
    
    function getUserInfo(address _user) public view returns (User memory) {
        return users[_user];
    }
    
    function getCaseInfo(string memory _caseNumber) public view returns (Case memory) {
        require(cases[_caseNumber].exists, "Case does not exist");
        return cases[_caseNumber];
    }
    
    function getEvidenceInfo(string memory _evidenceId) public view returns (Evidence memory) {
        require(evidence[_evidenceId].exists, "Evidence does not exist");
        return evidence[_evidenceId];
    }
    
    function getTotalCases() public view returns (uint256) {
        return caseNumbers.length;
    }
    
    function getTotalEvidence() public view returns (uint256) {
        return evidenceIds.length;
    }
    
    function getTotalUsers() public view returns (uint256) {
        return totalUsers;
    }
}