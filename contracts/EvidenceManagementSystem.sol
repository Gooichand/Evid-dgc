// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceManagementSystem {
    
    // Enums
    enum UserRole { None, PublicViewer, Investigator, ForensicAnalyst, LegalProfessional, CourtOfficial, EvidenceManager, Auditor, Administrator }
    enum CaseStatus { Open, UnderReview, Closed, Archived }
    enum EvidenceStatus { Submitted, Verified, Challenged, Accepted, Rejected }
    enum CaseVisibility { Public, Restricted, Confidential, PublicReleased }
    
    // Structs
    struct User {
        string fullName;
        string badgeNumber;
        string department;
        string jurisdiction;
        UserRole role;
        bool isActive;
        bool isRegistered;
        uint256 registrationDate;
        uint256 lastLogin;
    }
    
    struct Case {
        string caseNumber;
        string caseTitle;
        string description;
        string incidentDate;
        string location;
        string[] suspects;
        string[] victims;
        CaseStatus status;
        CaseVisibility visibility;
        address leadInvestigator;
        string leadInvestigatorName;
        uint256 createdAt;
        uint256 lastModified;
        bool releasedToPublic;
        address releasedBy;
        string releasedByName;
        uint256 releaseDate;
        string releaseReason;
        string[] evidenceIds;
        mapping(address => bool) authorizedPersonnel;
        address[] authorizedList;
        bool exists;
    }
    
    struct Evidence {
        string evidenceId;
        string caseNumber;
        string itemNumber;
        string description;
        string category;
        string collectionDate;
        string collectionLocation;
        string collectedBy;
        string ipfsHash;
        string fileType;
        string fileSize;
        bytes32 fileHash;
        address submittedBy;
        string submitterName;
        string submitterBadge;
        uint256 submissionTime;
        EvidenceStatus status;
        CaseVisibility visibility;
        bool releasedToPublic;
        address releasedBy;
        string releasedByName;
        uint256 releaseDate;
        string releaseReason;
        mapping(address => bool) authorizedViewers;
        address[] viewerList;
        mapping(address => uint256) accessLog;
        string forensicNotes;
        address analyzedBy;
        uint256 analysisDate;
        bool exists;
    }
    
    struct PublicComment {
        uint256 commentId;
        string targetId;
        string targetType;
        address commenter;
        string commenterName;
        string commentText;
        uint256 timestamp;
        bool exists;
    }
    
    struct AccessRequest {
        uint256 requestId;
        address requester;
        string requesterName;
        string evidenceId;
        string justification;
        uint256 requestDate;
        bool approved;
        address approvedBy;
        uint256 approvalDate;
        bool exists;
    }
    
    // State variables
    mapping(address => User) public users;
    mapping(string => Case) public cases;
    mapping(string => Evidence) public evidence;
    mapping(uint256 => PublicComment) public publicComments;
    mapping(uint256 => AccessRequest) public accessRequests;
    
    string[] public caseNumbers;
    string[] public evidenceIds;
    string[] public publicCaseNumbers;
    string[] public publicEvidenceIds;
    
    uint256 public commentCounter;
    uint256 public requestCounter;
    uint256 public totalUsers;
    
    address public admin;
    
    // Events
    event UserRegistered(address indexed user, string name, UserRole role, string department);
    event CaseCreated(string indexed caseNumber, address investigator, CaseVisibility visibility, uint256 timestamp);
    event EvidenceSubmitted(string indexed evidenceId, string caseNumber, address submitter, uint256 timestamp);
    event EvidenceAccessed(string indexed evidenceId, address accessor, string accessorName, uint256 timestamp);
    event AccessGranted(string indexed evidenceId, address grantedTo, address grantedBy, uint256 timestamp);
    event AccessRequested(uint256 indexed requestId, address requester, string evidenceId, uint256 timestamp);
    event AccessRequestApproved(uint256 indexed requestId, address approver, uint256 timestamp);
    event CaseStatusChanged(string indexed caseNumber, CaseStatus oldStatus, CaseStatus newStatus, address changedBy);
    event EvidenceStatusChanged(string indexed evidenceId, EvidenceStatus oldStatus, EvidenceStatus newStatus, address changedBy);
    event CaseReleasedToPublic(string indexed caseNumber, address releasedBy, string reason, uint256 timestamp);
    event EvidenceReleasedToPublic(string indexed evidenceId, address releasedBy, string reason, uint256 timestamp);
    event PublicCommentAdded(uint256 indexed commentId, string targetId, address commenter, uint256 timestamp);
    
    // Modifiers
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered && users[msg.sender].isActive, "User not registered or inactive");
        _;
    }
    
    modifier onlyInvestigator() {
        require(users[msg.sender].role == UserRole.Investigator || users[msg.sender].role == UserRole.Administrator, "Only investigators allowed");
        _;
    }
    
    modifier onlyForensicOrInvestigator() {
        require(
            users[msg.sender].role == UserRole.ForensicAnalyst || 
            users[msg.sender].role == UserRole.Investigator || 
            users[msg.sender].role == UserRole.Administrator, 
            "Only forensic analysts or investigators allowed"
        );
        _;
    }
    
    modifier onlyEvidenceManager() {
        require(users[msg.sender].role == UserRole.EvidenceManager || users[msg.sender].role == UserRole.Administrator, "Only evidence managers allowed");
        _;
    }
    
    modifier onlyCourtOrManager() {
        require(
            users[msg.sender].role == UserRole.CourtOfficial || 
            users[msg.sender].role == UserRole.EvidenceManager || 
            users[msg.sender].role == UserRole.Administrator, 
            "Only court officials or evidence managers allowed"
        );
        _;
    }
    
    modifier onlyAdmin() {
        require(users[msg.sender].role == UserRole.Administrator, "Only administrators allowed");
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
            jurisdiction: "Global",
            role: UserRole.Administrator,
            isActive: true,
            isRegistered: true,
            registrationDate: block.timestamp,
            lastLogin: block.timestamp
        });
        totalUsers = 1;
    }
    
    // User Management Functions
    function registerUser(
        string memory _fullName,
        string memory _badgeNumber,
        string memory _department,
        string memory _jurisdiction,
        UserRole _role
    ) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(_role != UserRole.None && _role != UserRole.Administrator, "Invalid role");
        
        users[msg.sender] = User({
            fullName: _fullName,
            badgeNumber: _badgeNumber,
            department: _department,
            jurisdiction: _jurisdiction,
            role: _role,
            isActive: true,
            isRegistered: true,
            registrationDate: block.timestamp,
            lastLogin: block.timestamp
        });
        
        totalUsers++;
        emit UserRegistered(msg.sender, _fullName, _role, _department);
    }
    
    function registerAsPublicViewer(string memory _fullName) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            fullName: _fullName,
            badgeNumber: "",
            department: "Public",
            jurisdiction: "Public",
            role: UserRole.PublicViewer,
            isActive: true,
            isRegistered: true,
            registrationDate: block.timestamp,
            lastLogin: block.timestamp
        });
        
        totalUsers++;
        emit UserRegistered(msg.sender, _fullName, UserRole.PublicViewer, "Public");
    }
    
    function updateLastLogin() public onlyRegistered {
        users[msg.sender].lastLogin = block.timestamp;
    }
    
    function getUserInfo(address _user) public view returns (User memory) {
        return users[_user];
    }
    
    function isUserRegistered(address _user) public view returns (bool) {
        return users[_user].isRegistered;
    }
    
    // Case Management Functions
    function createCase(
        string memory _caseNumber,
        string memory _title,
        string memory _description,
        string memory _incidentDate,
        string memory _location,
        CaseVisibility _visibility
    ) public onlyInvestigator {
        require(!cases[_caseNumber].exists, "Case already exists");
        
        Case storage newCase = cases[_caseNumber];
        newCase.caseNumber = _caseNumber;
        newCase.caseTitle = _title;
        newCase.description = _description;
        newCase.incidentDate = _incidentDate;
        newCase.location = _location;
        newCase.status = CaseStatus.Open;
        newCase.visibility = _visibility;
        newCase.leadInvestigator = msg.sender;
        newCase.leadInvestigatorName = users[msg.sender].fullName;
        newCase.createdAt = block.timestamp;
        newCase.lastModified = block.timestamp;
        newCase.exists = true;
        
        caseNumbers.push(_caseNumber);
        emit CaseCreated(_caseNumber, msg.sender, _visibility, block.timestamp);
    }
    
    function addSuspectToCase(string memory _caseNumber, string memory _suspectInfo) public onlyInvestigator {
        require(cases[_caseNumber].exists, "Case does not exist");
        require(cases[_caseNumber].leadInvestigator == msg.sender || users[msg.sender].role == UserRole.Administrator, "Not authorized");
        
        cases[_caseNumber].suspects.push(_suspectInfo);
        cases[_caseNumber].lastModified = block.timestamp;
    }
    
    function addVictimToCase(string memory _caseNumber, string memory _victimInfo) public onlyInvestigator {
        require(cases[_caseNumber].exists, "Case does not exist");
        require(cases[_caseNumber].leadInvestigator == msg.sender || users[msg.sender].role == UserRole.Administrator, "Not authorized");
        
        cases[_caseNumber].victims.push(_victimInfo);
        cases[_caseNumber].lastModified = block.timestamp;
    }
    
    function updateCaseStatus(string memory _caseNumber, CaseStatus _newStatus) public onlyCourtOrManager {
        require(cases[_caseNumber].exists, "Case does not exist");
        
        CaseStatus oldStatus = cases[_caseNumber].status;
        cases[_caseNumber].status = _newStatus;
        cases[_caseNumber].lastModified = block.timestamp;
        
        emit CaseStatusChanged(_caseNumber, oldStatus, _newStatus, msg.sender);
    }
    
    function releaseCaseToPublic(string memory _caseNumber, string memory _reason) public canReleaseToPublic {
        require(cases[_caseNumber].exists, "Case does not exist");
        require(!cases[_caseNumber].releasedToPublic, "Case already released to public");
        
        cases[_caseNumber].releasedToPublic = true;
        cases[_caseNumber].visibility = CaseVisibility.PublicReleased;
        cases[_caseNumber].releasedBy = msg.sender;
        cases[_caseNumber].releasedByName = users[msg.sender].fullName;
        cases[_caseNumber].releaseDate = block.timestamp;
        cases[_caseNumber].releaseReason = _reason;
        
        publicCaseNumbers.push(_caseNumber);
        emit CaseReleasedToPublic(_caseNumber, msg.sender, _reason, block.timestamp);
    }
    
    function releaseCaseEvidenceToPublic(string memory _caseNumber, string memory _reason) public canReleaseToPublic {
        require(cases[_caseNumber].exists, "Case does not exist");
        
        // Release case first
        if (!cases[_caseNumber].releasedToPublic) {
            releaseCaseToPublic(_caseNumber, _reason);
        }
        
        // Release all evidence in the case
        string[] memory caseEvidenceIds = cases[_caseNumber].evidenceIds;
        for (uint i = 0; i < caseEvidenceIds.length; i++) {
            if (evidence[caseEvidenceIds[i]].exists && !evidence[caseEvidenceIds[i]].releasedToPublic) {
                releaseEvidenceToPublic(caseEvidenceIds[i], _reason);
            }
        }
    }
    
    function authorizePersonnelToCase(string memory _caseNumber, address _personnelAddress) public onlyEvidenceManager {
        require(cases[_caseNumber].exists, "Case does not exist");
        require(users[_personnelAddress].isRegistered, "Personnel not registered");
        
        if (!cases[_caseNumber].authorizedPersonnel[_personnelAddress]) {
            cases[_caseNumber].authorizedPersonnel[_personnelAddress] = true;
            cases[_caseNumber].authorizedList.push(_personnelAddress);
        }
    }
    
    function getPublicCaseDetails(string memory _caseNumber) public view returns (
        string memory caseTitle,
        string memory description,
        string memory incidentDate,
        string memory location,
        string[] memory suspects,
        string[] memory victims,
        CaseStatus status,
        string memory leadInvestigatorName,
        uint256 createdAt,
        string[] memory evidenceIds
    ) {
        require(cases[_caseNumber].exists, "Case does not exist");
        require(cases[_caseNumber].releasedToPublic, "Case not released to public");
        
        Case storage c = cases[_caseNumber];
        return (
            c.caseTitle,
            c.description,
            c.incidentDate,
            c.location,
            c.suspects,
            c.victims,
            c.status,
            c.leadInvestigatorName,
            c.createdAt,
            c.evidenceIds
        );
    }
    
    function getCasesBySector(CaseVisibility _visibility) public view onlyRegistered returns (string[] memory) {
        string[] memory result = new string[](caseNumbers.length);
        uint256 count = 0;
        
        for (uint i = 0; i < caseNumbers.length; i++) {
            if (cases[caseNumbers[i]].visibility == _visibility) {
                result[count] = caseNumbers[i];
                count++;
            }
        }
        
        // Resize array
        string[] memory finalResult = new string[](count);
        for (uint i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
    
    function checkCaseAccess(string memory _caseNumber, address _userAddress) public view returns (bool) {
        if (!cases[_caseNumber].exists) return false;
        if (cases[_caseNumber].releasedToPublic) return true;
        if (cases[_caseNumber].leadInvestigator == _userAddress) return true;
        if (cases[_caseNumber].authorizedPersonnel[_userAddress]) return true;
        if (users[_userAddress].role == UserRole.Administrator) return true;
        if (users[_userAddress].role == UserRole.EvidenceManager) return true;
        if (users[_userAddress].role == UserRole.CourtOfficial) return true;
        if (users[_userAddress].role == UserRole.Auditor) return true;
        
        return false;
    }
    
    // Evidence Management Functions
    function submitEvidence(
        string memory _evidenceId,
        string memory _caseNumber,
        string memory _itemNumber,
        string memory _description,
        string memory _category,
        string memory _collectionDate,
        string memory _collectionLocation,
        string memory _collectedBy,
        string memory _ipfsHash,
        string memory _fileType,
        string memory _fileSize,
        bytes32 _fileHash
    ) public onlyForensicOrInvestigator {
        require(!evidence[_evidenceId].exists, "Evidence already exists");
        require(cases[_caseNumber].exists, "Case does not exist");
        
        Evidence storage newEvidence = evidence[_evidenceId];
        newEvidence.evidenceId = _evidenceId;
        newEvidence.caseNumber = _caseNumber;
        newEvidence.itemNumber = _itemNumber;
        newEvidence.description = _description;
        newEvidence.category = _category;
        newEvidence.collectionDate = _collectionDate;
        newEvidence.collectionLocation = _collectionLocation;
        newEvidence.collectedBy = _collectedBy;
        newEvidence.ipfsHash = _ipfsHash;
        newEvidence.fileType = _fileType;
        newEvidence.fileSize = _fileSize;
        newEvidence.fileHash = _fileHash;
        newEvidence.submittedBy = msg.sender;
        newEvidence.submitterName = users[msg.sender].fullName;
        newEvidence.submitterBadge = users[msg.sender].badgeNumber;
        newEvidence.submissionTime = block.timestamp;
        newEvidence.status = EvidenceStatus.Submitted;
        newEvidence.visibility = cases[_caseNumber].visibility;
        newEvidence.exists = true;
        
        evidenceIds.push(_evidenceId);
        cases[_caseNumber].evidenceIds.push(_evidenceId);
        
        emit EvidenceSubmitted(_evidenceId, _caseNumber, msg.sender, block.timestamp);
    }
    
    function addForensicAnalysis(string memory _evidenceId, string memory _forensicNotes) public onlyForensicOrInvestigator {
        require(evidence[_evidenceId].exists, "Evidence does not exist");
        
        evidence[_evidenceId].forensicNotes = _forensicNotes;
        evidence[_evidenceId].analyzedBy = msg.sender;
        evidence[_evidenceId].analysisDate = block.timestamp;
    }
    
    function updateEvidenceStatus(string memory _evidenceId, EvidenceStatus _newStatus) public onlyForensicOrInvestigator {
        require(evidence[_evidenceId].exists, "Evidence does not exist");
        
        EvidenceStatus oldStatus = evidence[_evidenceId].status;
        evidence[_evidenceId].status = _newStatus;
        
        emit EvidenceStatusChanged(_evidenceId, oldStatus, _newStatus, msg.sender);
    }
    
    function releaseEvidenceToPublic(string memory _evidenceId, string memory _reason) public canReleaseToPublic {
        require(evidence[_evidenceId].exists, "Evidence does not exist");
        require(!evidence[_evidenceId].releasedToPublic, "Evidence already released to public");
        
        evidence[_evidenceId].releasedToPublic = true;
        evidence[_evidenceId].visibility = CaseVisibility.PublicReleased;
        evidence[_evidenceId].releasedBy = msg.sender;
        evidence[_evidenceId].releasedByName = users[msg.sender].fullName;
        evidence[_evidenceId].releaseDate = block.timestamp;
        evidence[_evidenceId].releaseReason = _reason;
        
        publicEvidenceIds.push(_evidenceId);
        emit EvidenceReleasedToPublic(_evidenceId, msg.sender, _reason, block.timestamp);
    }
    
    function getEvidence(string memory _evidenceId) public returns (
        string memory caseNumber,
        string memory itemNumber,
        string memory description,
        string memory category,
        string memory collectionDate,
        string memory collectionLocation,
        string memory collectedBy,
        string memory ipfsHash,
        string memory fileType,
        string memory fileSize,
        bytes32 fileHash,
        string memory submitterName,
        uint256 submissionTime,
        EvidenceStatus status
    ) {
        require(evidence[_evidenceId].exists, "Evidence does not exist");
        require(checkEvidenceAccess(_evidenceId, msg.sender), "Access denied");
        
        // Log access
        evidence[_evidenceId].accessLog[msg.sender] = block.timestamp;
        emit EvidenceAccessed(_evidenceId, msg.sender, users[msg.sender].fullName, block.timestamp);
        
        Evidence storage e = evidence[_evidenceId];
        return (
            e.caseNumber,
            e.itemNumber,
            e.description,
            e.category,
            e.collectionDate,
            e.collectionLocation,
            e.collectedBy,
            e.ipfsHash,
            e.fileType,
            e.fileSize,
            e.fileHash,
            e.submitterName,
            e.submissionTime,
            e.status
        );
    }
    
    function getMyEvidence() public view onlyRegistered returns (string[] memory) {
        string[] memory result = new string[](evidenceIds.length);
        uint256 count = 0;
        
        for (uint i = 0; i < evidenceIds.length; i++) {
            if (evidence[evidenceIds[i]].submittedBy == msg.sender) {
                result[count] = evidenceIds[i];
                count++;
            }
        }
        
        // Resize array
        string[] memory finalResult = new string[](count);
        for (uint i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
    
    function getAccessibleEvidence() public view onlyRegistered returns (string[] memory) {
        string[] memory result = new string[](evidenceIds.length);
        uint256 count = 0;
        
        for (uint i = 0; i < evidenceIds.length; i++) {
            if (checkEvidenceAccess(evidenceIds[i], msg.sender)) {
                result[count] = evidenceIds[i];
                count++;
            }
        }
        
        // Resize array
        string[] memory finalResult = new string[](count);
        for (uint i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
    
    function checkEvidenceAccess(string memory _evidenceId, address _userAddress) public view returns (bool) {
        if (!evidence[_evidenceId].exists) return false;
        if (evidence[_evidenceId].releasedToPublic) return true;
        if (evidence[_evidenceId].submittedBy == _userAddress) return true;
        if (evidence[_evidenceId].authorizedViewers[_userAddress]) return true;
        if (users[_userAddress].role == UserRole.Administrator) return true;
        if (users[_userAddress].role == UserRole.EvidenceManager) return true;
        if (users[_userAddress].role == UserRole.CourtOfficial) return true;
        if (users[_userAddress].role == UserRole.Auditor) return true;
        
        // Check case access
        string memory caseNumber = evidence[_evidenceId].caseNumber;
        return checkCaseAccess(caseNumber, _userAddress);
    }
    
    // Access Control Functions
    function requestAccess(string memory _evidenceId, string memory _justification) public onlyRegistered returns (uint256) {
        require(evidence[_evidenceId].exists, "Evidence does not exist");
        require(!checkEvidenceAccess(_evidenceId, msg.sender), "Already have access");
        
        requestCounter++;
        accessRequests[requestCounter] = AccessRequest({
            requestId: requestCounter,
            requester: msg.sender,
            requesterName: users[msg.sender].fullName,
            evidenceId: _evidenceId,
            justification: _justification,
            requestDate: block.timestamp,
            approved: false,
            approvedBy: address(0),
            approvalDate: 0,
            exists: true
        });
        
        emit AccessRequested(requestCounter, msg.sender, _evidenceId, block.timestamp);
        return requestCounter;
    }
    
    function approveAccessRequest(uint256 _requestId) public onlyCourtOrManager {
        require(accessRequests[_requestId].exists, "Request does not exist");
        require(!accessRequests[_requestId].approved, "Request already approved");
        
        AccessRequest storage request = accessRequests[_requestId];
        request.approved = true;
        request.approvedBy = msg.sender;
        request.approvalDate = block.timestamp;
        
        // Grant access
        grantDirectAccess(request.evidenceId, request.requester);
        
        emit AccessRequestApproved(_requestId, msg.sender, block.timestamp);
    }
    
    function grantDirectAccess(string memory _evidenceId, address _userAddress) public onlyEvidenceManager {
        require(evidence[_evidenceId].exists, "Evidence does not exist");
        require(users[_userAddress].isRegistered, "User not registered");
        
        if (!evidence[_evidenceId].authorizedViewers[_userAddress]) {
            evidence[_evidenceId].authorizedViewers[_userAddress] = true;
            evidence[_evidenceId].viewerList.push(_userAddress);
        }
        
        emit AccessGranted(_evidenceId, _userAddress, msg.sender, block.timestamp);
    }
    
    // Public Features
    function getPublicReleasedCases() public view returns (string[] memory) {
        return publicCaseNumbers;
    }
    
    function getPublicReleasedEvidence() public view returns (string[] memory) {
        return publicEvidenceIds;
    }
    
    function addPublicComment(string memory _targetId, string memory _targetType, string memory _commentText) public onlyRegistered {
        commentCounter++;
        publicComments[commentCounter] = PublicComment({
            commentId: commentCounter,
            targetId: _targetId,
            targetType: _targetType,
            commenter: msg.sender,
            commenterName: users[msg.sender].fullName,
            commentText: _commentText,
            timestamp: block.timestamp,
            exists: true
        });
        
        emit PublicCommentAdded(commentCounter, _targetId, msg.sender, block.timestamp);
    }
    
    function getCommentsForTarget(string memory _targetId, string memory _targetType) public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](commentCounter);
        uint256 count = 0;
        
        for (uint i = 1; i <= commentCounter; i++) {
            if (publicComments[i].exists && 
                keccak256(bytes(publicComments[i].targetId)) == keccak256(bytes(_targetId)) &&
                keccak256(bytes(publicComments[i].targetType)) == keccak256(bytes(_targetType))) {
                result[count] = i;
                count++;
            }
        }
        
        // Resize array
        uint256[] memory finalResult = new uint256[](count);
        for (uint i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
    
    function getPublicStatistics() public view returns (uint256 publicCases, uint256 publicEvidence, uint256 totalComments) {
        return (publicCaseNumbers.length, publicEvidenceIds.length, commentCounter);
    }
    
    // View Functions
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