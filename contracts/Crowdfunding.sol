// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./library/SafeMath.sol";
import "./library/SafeMath8.sol";
import "./library/SafeMath16.sol";
import "./Project.sol";

contract Crowdfunding is Project {

    using SafeMath for uint256;

    address payable contractAdmin;

    //Contributions
    mapping (uint => address[]) private contributors;
    mapping (uint => mapping(address => uint256)) private contributions;

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
    event ownerPaid(uint256 projectID, address owner, uint256 currentBalance);

    constructor() {
        //Defaults
        contractAdmin = payable(msg.sender);     
    }

    //Contribute to projects 
    function contribute(uint256 projectID) external payable notOwner(projectID) {
        uint256 _contributionBalance = contributions[projectID][msg.sender];
        uint256 _currentBalance = projects[projectID].currentBalance;

        if(_contributionBalance == 0) {
            contributors[projectID].push(msg.sender);
        }

        _contributionBalance = _contributionBalance.add(msg.value);
        contributions[projectID][msg.sender] = _contributionBalance;

        _currentBalance = _currentBalance.add(msg.value);
        projects[projectID].currentBalance = _currentBalance;

        emit fundReceived(projectID, msg.sender, msg.value, _currentBalance);
        checkProjectFundingStatus(projectID);
    }

    //Check funding status
    function checkProjectFundingStatus(uint256 projectID) private {
        uint256 _currentBalance = projects[projectID].currentBalance;
        uint256 _targetAmount = projects[projectID].targetAmount;
        uint256 _endingTimestamp = projects[projectID].endingTimestamp;

        if(_currentBalance >= _targetAmount) {
            projects[projectID].fundingStatus = fStatus.Completed;
            projects[projectID].completedTimestamp = block.timestamp;
        } else if (block.timestamp > _endingTimestamp) {
            projects[projectID].fundingStatus = fStatus.Expired;
        }
    }

    //Pay/release funds to project owner
    function payout(uint256 projectID) external onlyAdmin() payable returns(bool) {
        address payable _projectOwner = payable(projects[projectID].owner);
        uint256 _currentBalance = projects[projectID].currentBalance;
        uint256 _targetAmount = projects[projectID].targetAmount;

        require(projects[projectID].fundingStatus == fStatus.Completed,"Unable to payout now. Invalid funding status");
        require(_currentBalance > 0,"Unable to payout now. Invalid fund");
        require(_currentBalance >= _targetAmount,"Unable to payout now. Fund not reached the target");
                
        _projectOwner.transfer(_currentBalance);        
        emit ownerPaid(projectID,msg.sender,_currentBalance);

        projects[projectID].currentBalance = 0;
        projects[projectID].fundingStatus = fStatus.Paid;
        projects[projectID].projectStatus = pStatus.Closed;

        return true;
    }

    //Refund to the contributors if fund not reached goal and expired
    function refund(uint256 projectID) external onlyAdmin() payable returns(bool) {

        require(projects[projectID].fundingStatus == fStatus.Expired, "Unable to refund now. Invalid funding status");

        uint256 _contributorsLength = contributors[projectID].length;

        for(uint256 i=0; i<_contributorsLength; i++ ) {
            address payable _contributor = payable(contributors[projectID][i]);
            uint256 _contribution = contributions[projectID][address(contributors[projectID][i])];
            _contributor.transfer(_contribution);
        }

        projects[projectID].currentBalance = 0;
        projects[projectID].fundingStatus = fStatus.Refunded;
        projects[projectID].projectStatus = pStatus.Closed;

        return true;
    }
}