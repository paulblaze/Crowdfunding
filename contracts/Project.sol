// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./library/SafeMath.sol";
import "./library/SafeMath8.sol";
import "./library/SafeMath16.sol";

contract Project {

    using SafeMath for uint256;
    
    enum fStatus {
        Inprogress,
        Completed,        
        Paid,
        Expired,
        Refunded
    }

    enum pStatus {
        Open,
        Closed
    }
    
    //Project Information
    struct projectInfo {
        uint256 projectID;
        string title;
        string description;
        uint256 targetAmount;
        uint256 deadlineInDays;
        uint256 startingTimestamp;
        uint256 endingTimestamp;
        uint256 completedTimestamp;        
        fStatus fundingStatus;
        pStatus projectStatus;
        address owner;
        uint256 currentBalance;        
    }
    uint256 numOfProjects;

    //Projects
    mapping (uint256 => projectInfo) internal projects;

    //Create Project
    function createProject(
        string calldata _title, 
        string calldata _description, 
        uint256 _targetAmount, 
        uint256 _deadlineInDays
    ) external returns (uint256 projectID) {

        uint256 _startingTimestamp = block.timestamp;
        numOfProjects = numOfProjects.add(1);
        uint256 _projectID = numOfProjects;

        projectInfo storage project = projects[_projectID];
        project.title = _title;
        project.description = _description;
        project.targetAmount = _targetAmount;
        project.deadlineInDays = _deadlineInDays;
        project.startingTimestamp = _startingTimestamp;
        project.endingTimestamp = _startingTimestamp + _deadlineInDays * 1 days;
        project.fundingStatus = fStatus.Inprogress;
        project.projectStatus = pStatus.Open;
        project.owner = msg.sender;

        return _projectID;
    }

    //Get Project
    function getProject(uint256 projectID) public view returns (
        string memory title,
        string memory description,
        uint256 targetAmount,
        uint256 deadlineInDays,
        uint256 startingTimestamp,
        uint256 endingTimestamp,
        fStatus fundingStatus,
        pStatus projectStatus,
        address owner,
        uint256 currentBalance        
    ) {

        projectInfo storage project = projects[projectID];

        return (
            project.title,
            project.description,
            project.targetAmount,
            project.deadlineInDays,
            project.startingTimestamp,
            project.endingTimestamp,
            project.fundingStatus,
            project.projectStatus,
            project.owner,
            project.currentBalance            
        );
    }
}