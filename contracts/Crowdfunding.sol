// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./library/SafeMath.sol";
import "./library/SafeMath8.sol";
import "./library/SafeMath16.sol";
import "./library/Timer.sol";
import "./Project.sol";

contract Crowdfunding is Project {

    using SafeMath for uint256;

    address payable contractAdmin;

    //Contributions
    mapping (uint => address[]) private projectContributors;
    mapping (address => uint[]) private contributedProjects;
    mapping (uint => mapping(address => uint256)) private projectContributions;

    //Modifiers
    modifier onlyAdmin() {
        require(contractAdmin == msg.sender,"Access Denied");
        _;
    }

    modifier notOwner(uint projectID) {
        require(projects[projectID].owner != msg.sender,"The project owner can not contribute");
        _;
    }
    
    //Events
    event fundReceived(uint256 projectID, address contributor, uint256 amount, uint256 currentBalance);
    event ownerPaid(uint256 projectID, address owner, uint256 receivedAmount);

    constructor() {
        //Defaults
        contractAdmin = payable(msg.sender);     
    }

    //Contribute to projects 
    function contribute(uint256 projectID) external payable notOwner(projectID) {
        
        require(projects[projectID].projectID != 0,"Project doesn't exists");
        require(projects[projectID].endingTimestamp > block.timestamp,"Project deadline reached. unable to send fund");
        require(projects[projectID].projectStatus == pStatus.Open,"Unable to payout now. Invalid funding status");
        require(msg.value >= 1 ether,"Minumum amount to contribute is 1 ether");

        uint256 _contributionBalance = projectContributions[projectID][msg.sender];
        uint256 _targetAmount = projects[projectID].targetAmount;
        uint256 _currentBalance = projects[projectID].currentBalance;
        
        if(_currentBalance != 0) {
            uint256 _fundRequired = _targetAmount.sub(_currentBalance / 1 ether) * 1 ether; 
            require(_fundRequired >= msg.value,'You are trying to send more fund than required fund');
        }        

        if(_contributionBalance == 0) {
            projectContributors[projectID].push(msg.sender);
            contributedProjects[msg.sender].push(projectID);
        }

        _contributionBalance = _contributionBalance.add(msg.value);
        projectContributions[projectID][msg.sender] = _contributionBalance;

        _currentBalance = _currentBalance.add(msg.value);
        projects[projectID].currentBalance = _currentBalance;
        projects[projectID].receivedAmount = _currentBalance;

        emit fundReceived(projectID, msg.sender, msg.value, _currentBalance);
        updateProjectStatus(projectID);
    }

    //Update Project Status
    function updateProjectStatus(uint256 projectID) private {
        if(projects[projectID].projectStatus == pStatus.Open) {
            uint256 _currentBalance = projects[projectID].currentBalance / 1 ether;
            uint256 _targetAmount = projects[projectID].targetAmount;
            uint256 _endingTimestamp = projects[projectID].endingTimestamp;

            if(_currentBalance >= _targetAmount) {                
                payout(projectID);                
            } else if (block.timestamp > _endingTimestamp) {
                projects[projectID].projectStatus = pStatus.Expired;
            }
        }        
    }

    //Pay/release funds to projec  t owner
    function payout(uint256 projectID) public payable returns(bool) {
        address payable _projectOwner = payable(projects[projectID].owner);
        uint256 _currentBalance = projects[projectID].currentBalance;
        uint256 _targetAmount = projects[projectID].targetAmount * 1 ether;
        
        require(_currentBalance > 0,"Unable to payout now. Invalid fund");
        require(_currentBalance >= _targetAmount,"Unable to payout now. Fund not reached the target");
                
        _projectOwner.transfer(_currentBalance);  
        
        projects[projectID].completedTimestamp = block.timestamp;
        projects[projectID].projectStatus = pStatus.Completed;
        projects[projectID].currentBalance = 0;

        emit ownerPaid(projectID,_projectOwner,_currentBalance);
        return true;
    }

    //Refund to the project contributors if fund not reached goal and expired
    function bulkRefund(uint256 projectID) external onlyAdmin() payable returns(bool) {
        require(projects[projectID].projectStatus != pStatus.Completed, "Project completed already unable to refund");        

        //Check Deadline is reached or not
        uint256 _endingTimestamp = projects[projectID].endingTimestamp;
        require(block.timestamp > _endingTimestamp, "Project deadline is not reached");        

        if(projects[projectID].projectStatus != pStatus.Expired)
            updateProjectStatus(projectID);

        //Bulk refund 
        uint256 _contributorsLength = projectContributors[projectID].length;
        for(uint256 i=0; i<_contributorsLength; i++ ) {
            address payable _contributor = payable(projectContributors[projectID][i]);
            uint256 _contribution = projectContributions[projectID][address(projectContributors[projectID][i])];
            _contributor.transfer(_contribution);
        }

        //update project current balance
        projects[projectID].currentBalance = 0;        
        projects[projectID].projectStatus = pStatus.Expired;

        return true;
    }
    
    //get refund
    function getRefund(uint256 projectID) external payable returns(bool){

        require(projects[projectID].projectStatus != pStatus.Completed, "Project completed already unable to refund");        

        //Check Deadline is reached or not    
        uint256 _endingTimestamp = projects[projectID].endingTimestamp;
        require(block.timestamp > _endingTimestamp, "Project deadline is not reached");

        //Check the contribution amount is valid
        uint256 _contribution = uint256(projectContributions[projectID][address(msg.sender)]) > 0  ?  projectContributions[projectID][address(msg.sender)] : 0;
        require(_contribution > 0, "Unable to refund. Not a valid contribution to refund");

        if(projects[projectID].projectStatus != pStatus.Expired)
            updateProjectStatus(projectID);

        //Refund to the contributor
        payable(msg.sender).transfer(_contribution);
        projectContributions[projectID][address(msg.sender)] = 0;

        //Update project current balance after refund
        uint256 _currentBalance = projects[projectID].currentBalance;
        _currentBalance = _currentBalance.sub(_contribution);
        projects[projectID].currentBalance = _currentBalance;

        return true;
    }

    function getContributedProjects(address contributor) public view returns(uint256[] memory) {

        return contributedProjects[contributor];
    }

    function getProjectContribution(uint256 projectID, address contributor) public view returns(uint256) {

        return projectContributions[projectID][contributor];
    }
}