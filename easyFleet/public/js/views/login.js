
$(document).ready(function(){
	
	var lv = new LoginValidator();
	var lc = new LoginController();

	// Popover // 
	// $('#sign-in-form input').hover(function(){
	// 	$(this).popover('show')
	// });

	// Validation //
	$("#sign-in-form").validate({
		rules:{
				user : { required: true, email:true } ,
				pass : { required: true, minlength: 6}},
		messages:{
				user:{ required: "Enter your Username"},
				pass:{ required: "Enter your Password"}},
		errorClass: "help-inline",
		errorElement: "span",
		highlight:function(element, errorClass, validClass) {
				$(element).parents('.control-group').addClass('error');},
		unhighlight: function(element, errorClass, validClass) {
				$(element).parents('.control-group').removeClass('error');
				$(element).parents('.control-group').addClass('success');}		
	});		

// main login form //

	$("#sign-in-form").ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (lv.validateForm() == false){
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$("input:checkbox:checked").length == 1})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/home';
		},
		error : function(e){
            lv.showLoginError('Login Failure', 'Please check your username and/or password');
		}
	}); 
	// $('#user-tf').focus();
	
// login retrieval form via email //
	
	// var ev = new EmailValidator();
	
	// $('#get-credentials-form').ajaxForm({
	// 	url: '/lost-password',
	// 	beforeSubmit : function(formData, jqForm, options){
	// 		if (ev.validateEmail($('#email-tf').val())){
	// 			ev.hideEmailAlert();
	// 			return true;
	// 		}	else{
	// 			ev.showEmailAlert("<b> Error!</b> Please enter a valid email address");
	// 			return false;
	// 		}
	// 	},
	// 	success	: function(responseText, status, xhr, $form){
	// 		ev.showEmailSuccess("Check your email on how to reset your password.");
	// 	},
	// 	error : function(){
	// 		ev.showEmailAlert("Sorry. There was a problem, please try again later.");
	// 	}
	// });
	
})