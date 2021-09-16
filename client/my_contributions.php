<!DOCTYPE html>
<html lang="en">
<style>
        .meta-gray {
            -webkit-filter: grayscale(1);
        }
        .meta-normal {
            -webkit-filter: grayscale(0);
        }
        .percentage{
            font-weight: 900;
            font-size: 16px;
        }
</style>    
<?php include 'includes/header.php'; ?>
<body>
    <?php include 'includes/menus.php'; ?>
    
    <div class="container-fluid mt-2">
    <div class="d-flex justify-content-end">        
        <button class="btn btn-outline-info btn-rounded mb-2" data-toggle="modal" data-target="#create-project-modal">Post your project</button>
    </div> 
    <h4 class="section-heading mb-4">My Contributions</h2>      
    <table id="my_contributions_table" class="table table-striped table-bordered" style="width:100%">
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Target Amount</th>
                <th>Fund Raised</th>
                <th>Contribution Amount</th>                
                <th>Start Time</th>
                <th>End Time</th>                
                <th>Project Status</th> 
                <th>Fund Status</th>                                
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>

    <?php include 'includes/create_project_modal.php'; ?>
    <?php include 'includes/add_fund_modal.php'; ?>
</div>
</body>
<?php include 'includes/footer.php'; ?>
<script type="text/javascript">

async function getMyContributions() {
    $('#cover-spin').show();
    if(contractObj) {        
        await contractObj.methods.getContributedProjects(currentAccount).call().then(function(myContributions) { console.log(myContributions);
            $("#my_contributions_table").find("tr:gt(0)").remove();
            if(myContributions.length > 0) {                
                myContributions.forEach((projectID) => {
                    contractObj.methods.getProjectContribution(projectID,currentAccount).call().then(function(contributionAmount){ 
                        contractObj.methods.getProject(projectID).call().then(function(project){                        
                            project.contributionAmount = contributionAmount;
                            addContributionRow(project,'my_contributions_table');
                        });                        
                    });  
                });                       
            } else {
                var tableObj = document.getElementById('my_contributions_table');
                tablerow = '<td colspan="8" class="text-center">No Contributions Found.</td>';
                tableObj.insertRow().innerHTML = tablerow;
            }
        });                
    }
    $('#cover-spin').hide();
}

function addContributionRow(project,tableID) {
    var tableObj = document.getElementById(tableID);
    currentBalance = web3.utils.fromWei(project.currentBalance, 'ether');
    receivedAmount = web3.utils.fromWei(project.receivedAmount, 'ether');
    contributionAmount = web3.utils.fromWei(project.contributionAmount, 'ether');

    var tablerow = '<td>'+project.title+'</td><td>'+project.description.substring(0, 50) + '...'+'</td><td>'+project.targetAmount+' ETH</td><td>'+receivedAmount+' ETH</td><td>'+contributionAmount+' ETH</td><td>'+moment.unix(project.startingTimestamp).format("MM/DD/YYYY HH:mm:ss")+'</td><td>'+moment.unix(project.endingTimestamp).format("MM/DD/YYYY HH:mm:ss")+'</td><td>'+projectStatus[project.projectStatus]+'</td>';
    
    if(projectStatus[project.projectStatus] == "Open" || projectStatus[project.projectStatus] == "Expired") {
        console.log(moment.unix(project.endingTimestamp).valueOf()+" "+moment.utc())
        if(moment.unix(project.endingTimestamp).valueOf() > moment.utc()) {
            tablerow = tablerow + '<td><button class="btn btn-outline-dark btn-sm" value="Add More Fund" data-projectid='+project._projectID+' onclick="addFund(this)" />Add More Fund</button></td>';
        } else {
            if(contributionAmount > 0 ) {
                tablerow = tablerow + '<td><button class="btn btn-outline-dark btn-sm" value="Get Fund" data-projectid='+project._projectID+' onclick="getRefund(this)" />Get Refund</button></td>';
            } else {
                tablerow = tablerow + '<td>Refunded</td>';
            }           
        }
        
    } else {
        tablerow = tablerow + '<td>Donated</td>';
    }

    tableObj.insertRow().innerHTML = tablerow;
}
</script>
</html> 