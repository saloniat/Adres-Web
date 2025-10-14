$(document).ready(function(){
    $(".showpwd").on("click", function () {
        let inputField;
        let inputFieldEye;

        if ($(this).hasClass("password_one")) {
            inputField = $("#current_password");
            inputFieldEye = $(this).find(".password_one_eye");
        } else if ($(this).hasClass("password_two")) {
            inputField = $("#new_password");
            inputFieldEye = $(this).find(".password_two_eye");
        } else if ($(this).hasClass("password_three")) {
            inputField = $("#confirm_new_password");
            inputFieldEye = $(this).find(".password_three_eye");
        }

        if (inputField) {
            const currentType = inputField.attr("type");
            inputField.attr("type", currentType === "password" ? "text" : "password");
        }

        if (inputFieldEye) {
            inputFieldEye.toggleClass("fa-eye fa-eye-slash");
        }
    });


    $('#change_password').validate({
            errorElement: 'p',
            rules: {
                current_password:{
                    required: true,
                    // minlength:6,
                    // maxlength:12,
                },
                new_password:{
                    required:true,
                    // minlength:6,
                    // maxlength:12,
                    // uppercasepass:true,
                    // numberpass:true
                    strongPassword: true,
                },
                confirm_new_password:{
                    required:true,
                    // minlength:6,
                    // maxlength:12,
                    // uppercasepass:true,
                    // numberpass:true,
                    strongPassword: true,
                    equalTo: "#new_password"
                }
            },
            messages: {
                current_password:{
                    required: "Current password is required."
                },
                new_password:{
                    required: "New password is required."
                },
                confirm_new_password:{
                    required: "Confirm password is required.",
                    equalTo: "Confirm password should be same as New password."
                }
            },
            submitHandler:function(){
                $.ajax({
                    url: '/admin/change-password/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#change_password').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        if(response.error == 0 || response.status == 200 || response.status == 201){
                            $("#current_password").val("");
                            $("#new_password").val("");
                            $("#confirm_new_password").val("");
                            $.growl.notice({title: "Change Password ", message: response.msg, size: 'large'});
                            setTimeout(() => {
                                window.location.href = '/admin/listing/';
                            }, 2000);
                        }else{
                            $.growl.error({title: "Change Password ", message: response.msg, size: 'large'});
                        }
                    },
                    complete: function(response){
                        $('.overlay').hide();
                    }
                });
            }
    });
});
