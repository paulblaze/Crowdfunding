async function createProject(title,description,target_amount,deadline) {     
    if(contractObj) {
        try {                
            await contractObj.methods.createProject(title,description,target_amount,deadline).send({from:currentAccount, gas:3000000}).then(function(projectID) {
                $("#create_project_form")[0].reset();
                $('#create-project-modal').modal('hide');
                getAllProjects();
                getMyProjects();
            });
        } catch(e) {
            console.log(e);
            const data = e.data;
            const txHash = Object.keys(data)[0]; // TODO improve
            const reason = data[txHash].reason;

            if(reason == "") {
                reason = "Something went wrong, Please try again"
            }
            toastr.error(reason, 'Alert!', {timeOut: 5000});            
        }                   
    } else {
        toastr.error('Something went wrong, Please try again', 'Alert!', {timeOut: 5000});
    }
}

async function getAllProjects() {
    if(contractObj) {                
        await contractObj.methods.totalProjects().call().then(function(totalProjects) {
            if(totalProjects > 0) { 
                $("#all_projects_table").find("tr:gt(0)").remove();
                for(i=1;i<=totalProjects;i++) {                
                    contractObj.methods.getProject(i).call().then(function(project){                        
                        addProjectRow(project,'all_projects_table');
                    });  
                }
            }
        });                
    }
}

function addProjectRow(project,tableID) {
    var tableObj = document.getElementById(tableID);
    currentBalance = web3.utils.fromWei(project.currentBalance, 'ether');

    var tablerow = '<td>'+project.title+'</td><td>'+project.description.substring(0, 50) + '...'+'</td><td>'+project.targetAmount+' ETH</td><td>'+currentBalance+' ETH</td><td>'+moment.unix(project.startingTimestamp).format("MM/DD/YYYY HH:mm:ss")+'</td><td>'+moment.unix(project.endingTimestamp).format("MM/DD/YYYY HH:mm:ss")+'</td><td>'+projectStatus[project.projectStatus]+'</td>';

    if(tableID == "all_projects_table" && projectStatus[project.projectStatus] == "Open") {
        tablerow = tablerow + '<td><button class="btn btn-outline-dark btn-sm" value="Add Fund" data-projectid='+project._projectID+' onclick="addFund(this)" />Add Fund</button></td>';
    } 

    tableObj.insertRow().innerHTML = tablerow;
}

async function addFund(that) {
    projectID = $(that).attr('data-projectid');    
    $("#add_fund_form").find('#project_id').val(projectID);
    setProgressBar(projectID);
        
}

async function setProgressBar(projectID) {
    await contractObj.methods.getProject(projectID).call().then(function(project){
        targetAmount = project.targetAmount;
        currentBalance = web3.utils.fromWei(project.currentBalance, 'ether');
        percentage = parseFloat(currentBalance/targetAmount * 100).toFixed(1); 
        $("#add-fund-modal").find('.project-title').html(project.title);
        $("#add-fund-modal").find('.project-description').html(project.description);
        $("#add-fund-modal").find('.target-amount').html(targetAmount+' ETH');
        $("#add-fund-modal").find('.current-balance').html(currentBalance+' ETH');
        $("#add-fund-modal").find('.progress-bar').attr('aria-valuenow',percentage);
        $("#add-fund-modal").find('.progress-bar').css('width', percentage+'%');
        $("#add-fund-modal").find('.progress-bar').find('.percentage').html(percentage+'%');
        $('#add-fund-modal').modal('show');       
    });
}

async function contributeToProject(projectID,fund_amount) {
    if(contractObj) {                
        var etherAmount = web3.utils.toBN(fund_amount);
        var weiValue = web3.utils.toWei(etherAmount,'ether'); console.log(weiValue);
        try {
            await contractObj.methods.contribute(projectID).send({from:currentAccount, gas:3000000, value:weiValue}).then(function() {                
                $("#fund_amount").val('');
                toastr.success('Fund added successully', 'Success', {timeOut: 5000});
                setProgressBar(projectID);
            });
        } catch(e) {
            const data = e.data;
            const txHash = Object.keys(data)[0]; // TODO improve
            const reason = data[txHash].reason;

            if(reason == "") {
                reason = "Something went wrong, Please try again"
            }
            toastr.error(reason, 'Alert!', {timeOut: 5000});
        }                    
    } else {
        toastr.error('Something went wrong, Please try again', 'Alert!', {timeOut: 5000});
    }        
}