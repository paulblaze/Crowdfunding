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
    <h4 class="section-heading mb-4">All Projects</h2>      
    <table id="active_projects_table" class="table table-striped table-bordered" style="width:100%">
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Target Amount</th>
                <th>Fund Raised</th>                
                <th>Start Time</th>
                <th>End Time</th>                
                <th>Status</th>
                <th>Action</th>                
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
async function getAllProjects() {
    $('#cover-spin').show();
    if(contractObj) {                
        await contractObj.methods.totalProjects().call().then(function(totalProjects) {            
            if(totalProjects > 0) { 
                $("#active_projects_table").find("tr:gt(0)").remove();
                for(i=1;i<=totalProjects;i++) {                
                    contractObj.methods.getProject(i).call().then(function(project){ console.log(project);
                        if(project.projectStatus == 0) {
                            addProjectRow(project,'active_projects_table');
                        }    
                    });  
                }
            }             
        });        
    }
    $('#cover-spin').hide();
}
</script>
</html> 