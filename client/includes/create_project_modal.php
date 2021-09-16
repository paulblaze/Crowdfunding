<!-- Create Project Modal -->
<div class="modal fade" id="create-project-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-notify modal-info" role="document">
    <!--Content-->
    <div class="modal-content">
      <!--Header-->
      <div class="modal-header text-center">
        <h4 class="modal-title white-text w-100 font-weight-bold py-2">Post Your Project</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true" class="white-text">&times;</span>
        </button>
      </div>

      <!--Body-->
      <form id="create_project_form" class="needs-validation" novalidate>
      <div class="modal-body">
        <div class="md-form mb-5">          
          <input type="text" id="project_title" class="form-control validate" required>
          <label data-error="wrong" data-success="right" for="form3">Project Title</label>
           <div class="invalid-feedback">
            Please provide a valid title
           </div>
        </div>

        <div class="md-form mb-4 pink-textarea active-pink-textarea">
            <textarea id="project_description" class="md-textarea form-control" rows="2" required></textarea>
            <label for="form18">Project Description</label>
            <div class="invalid-feedback">
             Please provide a valid description
            </div>
        </div>

        <div class="md-form mb-5">          
          <input type="text" id="target_amount" class="form-control validate" required>
          <label data-error="wrong" data-success="right" for="form3">Target Amount</label>
          <div class="invalid-feedback">
            Please provide a valid amount
           </div>
        </div>

        <div class="md-form mb-5">          
          <input type="text" id="project_deadline" class="form-control validate" required>
          <label data-error="wrong" data-success="right" for="form3">Deadline (in days)</label>
          <div class="invalid-feedback">
            Please provide a valid days
           </div>
        </div>
        
      </div>

        <!--Footer-->
        <div class="modal-footer justify-content-center">
            <input type="submit" class="btn btn-info waves-effect" value="Create Project">
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
    var form = document.getElementById('create_project_form');    
    form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add('was-validated');
            } else {
                event.preventDefault();
                event.stopPropagation();                
                console.log($("#project_title").val());
                var project_title = $("#project_title").val();
                var project_description = $("#project_description").val();
                var target_amount = $("#target_amount").val();
                var project_deadline = $("#project_deadline").val();
                createProject(project_title,project_description,target_amount,project_deadline)                                
            }
            
    }, false);
}, false);
})();
</script>