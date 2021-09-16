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
    <h4 class="section-heading mb-4">My Projects</h2>      
    <table id="my_projects_table" class="table table-striped table-bordered" style="width:100%">
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Target Amount</th>
                <th>Fund Raised</th>                
                <th>Start Time</th>
                <th>End Time</th>                
                <th>Status</th>                                           
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>

    <?php include 'includes/create_project_modal.php'; ?>
</div>
</body>
<?php include 'includes/footer.php'; ?>
<script type="text/javascript">
async function getMyProjects() {
    $('#cover-spin').show();
    if(contractObj) {         
        await contractObj.methods.getOwnerProjects(currentAccount).call().then(function(myProjects) {
            $("#my_projects_table").find("tr:gt(0)").remove();            
            if(myProjects.length > 0) {                
                myProjects.forEach((projectID) => {
                    contractObj.methods.getProject(projectID).call().then(function(project){                        
                        addProjectRow(project,'my_projects_table');
                    });  
                });                       
            } else {
                var tableObj = document.getElementById('my_projects_table');
                tablerow = '<td colspan="8" class="text-center">No Projects Created.</td>';
                tableObj.insertRow().innerHTML = tablerow;
            }
        });                
    }
    $('#cover-spin').hide();
}
</script>
</html> 