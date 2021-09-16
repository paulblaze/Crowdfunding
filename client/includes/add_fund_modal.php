<!-- Add fund modal -->
<div class="modal fade" id="add-fund-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-notify modal-info modal-xl modal-fullscreen-xxl-down" role="document">
    <!--Content-->
    <div class="modal-content">
      <!--Header-->
      <div class="modal-header">
        <h4 class="modal-title white-text w-100 font-weight-bold py-2">Project Contribution</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true" class="white-text">&times;</span>
        </button>
      </div>

      <!--Body-->
      <form id="add_fund_form" class="needs-validation" novalidate>
        <input type="hidden" id="project_id" value ="" />
      <div class="modal-body">
                  
        <h4 class="project-title section-heading mb-4"></h4>            
        <p class="project-description"></p>
        
        <hr class="my-2">

        <div class="container px-4 mt-5">
        <div class="progress" style="height: 30px;">
        <div
            class="progress-bar progress-bar-striped progress-bar-animated bg-dark"
            role="progressbar"
            style="width: 0%;"
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
        >
            <span class="percentage"></span>
        </div>
        </div>
        </div>

        <div class="container px-4 mt-5">
        <div class="row gx-5">
        <div class="col">
            <div class="p-3 bg-dark text-white">
                <h4>Current Balance: <span class="current-balance"></span></h4>
            </div>
            </div>
            <div class="col">
            <div class="p-3 bg-dark text-white">
                <h4>Target: <span class="target-amount"></span></h4>
            </div>
            </div>            
        </div>
        </div>

        <div class="container px-4 mt-5">
        <h4 class="section-heading mb-4 text-center">Transfer amount</h4>  
        <div class="md-form mb-5">          
          <input type="text" id="fund_amount" class="form-control validate" required>
          <label data-error="wrong" data-success="right" for="form3">Amount to send</label>
          <div class="invalid-feedback">
            Please provide a valid amount
           </div>
        </div>
        </div>

      </div>   

        <!--Footer-->
        <div class="modal-footer justify-content-center">
            <input type="submit" class="btn btn-info waves-effect" value="Add Fund">
        </div>
     </form>         
    </div>    
    <!--/.Content-->
  </div>
</div>

<script type="text/javascript">
(function() {
'use strict';
window.addEventListener('load', function() {    
    var form1 = document.getElementById('add_fund_form');    
    form1.addEventListener('submit', function(event) {
            if (form1.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                form1.classList.add('was-validated');
            } else {
                event.preventDefault();
                event.stopPropagation();
                var projectID= $("#project_id").val();
                var fund_amount = $('#fund_amount').val();
                console.log(fund_amount);
                contributeToProject(projectID,fund_amount)                                
            }
            
    }, false);
}, false);
})();
</script>