async function createProject(title,description,target_amount,deadline) {
    $('#cover-spin').show();
    if(contractObj) {
        try { 
            $('#create-project-modal').modal('hide');               
            await contractObj.methods.createProject(title,description,target_amount,deadline).send({from:currentAccount}).then(function(projectID) {
                $("#create_project_form")[0].reset();                
                if(typeof getAllProjects !== "undefined"){
                    getAllProjects(); 
                }
        
                if(typeof getMyProjects !== "undefined"){
                    getMyProjects();
                }
            });
        } catch(e) {
            console.log(e);                    
            const data = e.data;            
            if(data !== undefined) {
                const txHash = Object.keys(data)[0];
                reason = data[txHash].reason;
            } else {
                reason = "";
            }

            if(reason == "") {
                reason = "Something went wrong, Please try again";
            }
            toastr.error(reason, 'Alert!', {timeOut: 5000}); 
        }                   
    } else {
        toastr.error('Something went wrong, Please try again', 'Alert!', {timeOut: 5000});
    }
    $('#cover-spin').hide();
}

function addProjectRow(project,tableID) {
    var tableObj = document.getElementById(tableID);
    if(tableObj !== undefined && tableObj !== null) { 
        console.log(tableID);       
        currentBalance = web3.utils.fromWei(project.currentBalance, 'ether');
        receivedAmount = web3.utils.fromWei(project.receivedAmount, 'ether');

        var tablerow = '<td>'+project.title+'</td><td>'+project.description.substring(0, 50) + '...'+'</td><td>'+project.targetAmount+' ETH</td><td>'+receivedAmount+' ETH</td><td>'+moment.unix(project.startingTimestamp).format("MM/DD/YYYY HH:mm:ss")+'</td><td>'+moment.unix(project.endingTimestamp).format("MM/DD/YYYY HH:mm:ss")+'</td><td>'+projectStatus[project.projectStatus]+'</td>';

        if(tableID == "active_projects_table" && projectStatus[project.projectStatus] == "Open") {
            tablerow = tablerow + '<td><button class="btn btn-outline-dark btn-sm" value="Add Fund" data-projectid='+project._projectID+' onclick="addFund(this)" />Add Fund</button></td>';
        }

        tableObj.insertRow().innerHTML = tablerow;
    }
}

async function addFund(that) {
    projectID = $(that).attr('data-projectid');    
    $("#add_fund_form").find('#project_id').val(projectID);
    setProgressBar(projectID);
        
}

async function setProgressBar(projectID) {
    await contractObj.methods.getProject(projectID).call().then(function(project){
        targetAmount = project.targetAmount;
        if(project.projectStatus == 1) {
            currentBalance = project.targetAmount;            
        } else {
            currentBalance = web3.utils.fromWei(project.currentBalance, 'ether');
        }    
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
    $('#cover-spin').show();
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
            console.log(e);                    
            const data = e.data;            
            if(data !== undefined) {
                const txHash = Object.keys(data)[0];
                reason = data[txHash].reason;
            }  else {
                reason = "";
            }

            if(reason == "") {
                reason = "Something went wrong, Please try again";
            }
            toastr.error(reason, 'Alert!', {timeOut: 5000}); 
        }                    
    } else {
        toastr.error('Something went wrong, Please try again', 'Alert!', {timeOut: 5000});
    }
    $('#cover-spin').hide();        
}

async function getRefund(that) {
    projectID = $(that).attr('data-projectid');    
    $('#cover-spin').show();
    if(contractObj) {                
        try {
            await contractObj.methods.getRefund(projectID).send({from:currentAccount, gas:3000000}).then(function() {                                
                toastr.success('Refunded successully', 'Success', {timeOut: 5000});                
            });
        } catch(e) {
            console.log(e);                    
            const data = e.data;            
            if(data !== undefined) {
                const txHash = Object.keys(data)[0];
                reason = data[txHash].reason;
            }  else {
                reason = "";
            }

            if(reason == "") {
                reason = "Something went wrong, Please try again";
            }
            toastr.error(reason, 'Alert!', {timeOut: 5000}); 
        }                    
    } else {
        toastr.error('Something went wrong, Please try again', 'Alert!', {timeOut: 5000});
    }
    $('#cover-spin').hide(); 
        
}
    