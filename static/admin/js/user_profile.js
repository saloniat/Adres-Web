$(document).ready(function(){
    $.validator.addMethod("lettersWithSpace", function(value, element) {
        return this.optional(element) || /^[A-Za-z\s]+$/.test(value);
    }, "Only letters and spaces are allowed.");

    $("#name").on("input", function () {
        let cleanValue = $(this).val().replace(/[^A-Za-z\s]/g, '');
        $(this).val(cleanValue);
    });


    $('#user_profile').validate({
            errorElement: 'p',
            rules: {
                name:{
                    required: true,
                    lettersWithSpace: true,
                },
                phone_no:{
                    required:true,
                },
                email:{
                    required:true,
                    email: true,
                }
            },
            messages: {
                name:{
                    required: "Name is required."
                },
                phone_no:{
                    required: "Phone is required."
                },
                email:{
                    required: "Email is required.",
                }
            },
            submitHandler:function(){
                $.ajax({
                    url: '/admin/user-profile/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#user_profile').serialize(),
                    beforeSend: function(){
                        $("#submit").prop("disabled", true);
                        $('.overlay').show();
                    },
                    success: function(response){
                        if(response.error == 0 || response.status == 200 || response.status == 201){
                            $("#submit").prop("disabled", false);
                            $.growl.notice({title: "User Profile ", message: response.msg, size: 'large'});
                        }else{
                            $.growl.error({title: "User Profile ", message: response.msg, size: 'large'});
                        }
                    },
                    complete: function(response){
                        $('.overlay').hide();
                    }
                });
            }
    });
});
