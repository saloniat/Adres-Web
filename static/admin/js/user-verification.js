$(document).ready(function(){
    $('.verification_status').on('click', function () {
        var verification_status = $(this).val();
        if(verification_status == 1){
            $('.reject_reason').hide();
        }else{
            $('.reject_reason').show();
        }
    });
    $('#account_verification_frm').validate({
        gnore: [],
        errorElement: 'p',
        rules:{
            verification_status:{
                required: true,
            },
            reject_reason:{
                required: function(){
                    if (parseInt($('input[name="verification_status"]:checked').val()) == 2) {
                        return true;
                    }else {
                        return false;
                    }
                },
            },
        },
        messages:{

        }

    });
    
    $("#submit_frm").on('click', function(){
        if($('#account_verification_frm').valid()){
            save_data('account_verification_frm');
        }
    });
});


function save_data(element){
    $.ajax({
        url: '/admin/user-verification/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: $('#'+element).serialize(),
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Verification ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    window.location.reload();
                }, 2000);
                custom_response = {
                    // 'user_id': response.data.user_id,
                    'user_id': encryptUserId(String(response.data.user_id), encryptionKey),
                };
                customCallBackFunc(update_notification_socket, [custom_response]);
            }else{
                $.growl.error({title: "Verification ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    window.location.reload();
                }, 2000);
            }
        }
    });
}

function update_notification_socket(response){
    socket.emit("getNotifications", {"user_id": response.user_id});
}