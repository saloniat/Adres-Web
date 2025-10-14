$(document).ready(function(){
    $(document).on('click', '#global_listing_setting_frm input[name="is_deposit_required"]', function(){
        var is_deposit_required = parseInt($(this).val());
        if(is_deposit_required == 1){
            $('#global_deposit_amount_section').show();
        }else{
            $('#global_deposit_amount_section').hide();
        }
    });

    $(document).on('click', '#listing_setting_frm input[name="is_deposit_required"]', function(){
        var is_deposit_required = parseInt($(this).val());
        if(is_deposit_required == 1){
            $('.deposit_amount_section').show();
        }else{
            $('.deposit_amount_section').hide();
        }
    });

    $(document).on('click', '#global_listing_setting_frm input[name="autobid"]', function(){
        var is_deposit_required = parseInt($(this).val());
        if(is_deposit_required == 1){
            $('#global_autobid_section').show();
        }else{
            $('#global_autobid_section').hide();
        }
    });

    $('#global_listing_setting_frm').validate({
        errorElement: 'p',
        rules:{
            // auto_approval:{
            //     required: true
            // },
            // is_deposit_required:{
            //     required: true,
            //     digits: true
            // },
            reserve_not_met:{
                required: true
            },
            is_log_time_extension:{
                required: true
            },
            log_time_extension:{
                required: function () {
                    if (parseInt($('input[name="is_log_time_extension"]').val()) == 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                //min:1
                min: function(){
                    if (parseInt($('input[name="remain_time_to_add_extension"]').val())) {
                        return parseInt($('input[name="remain_time_to_add_extension"]').val());
                    } else {
                        return 1;
                    }
                }
            },
            remain_time_to_add_extension:{
                required: true,
                min:1,
                max: function(){
                    if (parseInt($('input[name="log_time_extension"]').val())) {
                        return parseInt($('input[name="log_time_extension"]').val());
                    } else {
                        return false;
                    }
                }
            },
            // timer_flash:{
            //     required: true,
            //     min:1
            // },
            
            service_fee:{
                required: true,
                min: 1,
                max: 100,
                number: true
            },
            auction_fee:{
                required: true,
                min: 1,
                maxlength: 15, // Ensures max 15 digits
                number: true
            },
        },
        messages:{
            auto_approval:{
                required: "Auto approval is required"
            },
            reserve_not_met:{
                required: "Reserve not met is required"
            },
            is_log_time_extension:{
                required: "Is log time extension is required"
            },
            log_time_extension:{
                required: "Log time extension is required",
                min: "Value must be equal or greater than 'When to start adding time'."
            },
            timer_flash:{
                required: "Timer flash is required",
                min: "Value must be greater than zero"
            },
            bid_limit:{
                required: "Bid Limit is required",
                min: "Value must be greater than zero"
            },
            remain_time_to_add_extension:{
                min: "Value must be greater than zero",
                max: "Value must be equal or less than 'Log Time Extension'"
            }
        },
        errorPlacement: function(error, element) {
            if(element.hasClass('auto_approval')){
                error.insertAfter($('.auto_approval_label').closest('div'));
            }else if(element.hasClass('is_log_time_extension')){
                error.insertAfter($('.is_log_time_extension_label').closest('div'));
            }else if(element.hasClass('reserve_not_met')){
                error.insertAfter($('.reserve_not_met_label').closest('div'));
            }else{
                error.insertAfter(element);
            }
        },
        submitHandler:function(){
            save_listing_setting('global_listing_setting_frm');
        }
    });

    $('#listing_setting_frm').validate({
        errorElement: 'p',
        rules:{
            // auto_approval:{
            //     required: true
            // },
            // is_deposit_required:{
            //     required: true,
            //     digits: true
            // },
            reserve_not_met:{
                required: true
            },
            is_log_time_extension:{
                required: true
            },
            log_time_extension:{
                required: function () {
                    if (parseInt($('input[name="is_log_time_extension"]').val()) == 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                //min:1
                min: function(){
                    if (parseInt($('input[name="remain_time_to_add_extension"]').val())) {
                        return parseInt($('input[name="remain_time_to_add_extension"]').val());
                    } else {
                        return 1;
                    }
                }
            },
            // timer_flash:{
            //     required: true,
            //     min:1
            // },
            remain_time_to_add_extension:{
                required: true,
                min:1,
                max: function(){
                    if (parseInt($('input[name="log_time_extension"]').val())) {
                        return parseInt($('input[name="log_time_extension"]').val());
                    } else {
                        return false;
                    }
                }
            },
            // bid_limit:{
            //     required: function () {
            //         if (parseInt($('input[name="auto_approval"]').val()) == 1) {
            //             return true;
            //         }else{
            //             return false;
            //         }
            //     },
            //     min:0
            // },
            // deposit_amount:{
            //     required: function () {
            //         if (parseInt($('input[name="is_deposit_required"]').val()) == 1) {
            //             return true;
            //         }else{
            //             return false;
            //         }
            //     },
            //     min:1
            // },
            service_fee:{
                required: true,
                min: 1,
                max: 100,
                number: true
            },
            auction_fee:{
                required: true,
                min: 1,
                maxlength: 15, // Ensures max 15 digits
                number: true
            },
        },
        messages:{
            auto_approval:{
                required: "Auto approval is required"
            },
            reserve_not_met:{
                required: "Reserve not met is required"
            },
            is_log_time_extension:{
                required: "Is log time extension is required"
            },
            log_time_extension:{
                required: "Log time extension is required",
                min: "Value must be equal or greater than 'When to start adding time'."
            },
            timer_flash:{
                required: "Timer flash is required",
                min: "Value must be greater than zero"
            },
            remain_time_to_add_extension:{
                required:"When to start adding is required",
                min: "Value must be greater than zero",
                max: "Value must be equal or less than 'Log Time Extension'"
            },
            bid_limit: {
                required:"Bid Limit is required",
                min: "Value must be greater than zero"
            }
        },
        errorPlacement: function(error, element) {
            if(element.hasClass('auto_approval')){
                error.insertAfter($('.auto_approval_label').closest('div'));
            }else if(element.hasClass('is_log_time_extension')){
                error.insertAfter($('.is_log_time_extension_label').closest('div'));
            }else if(element.hasClass('reserve_not_met')){
                error.insertAfter($('.reserve_not_met_label').closest('div'));
            }else{
                error.insertAfter(element);
            }
        },
        submitHandler:function(){
            save_listing_setting('listing_setting_frm');
        }
    });

});

function save_listing_setting(form){
    var is_global = 0;
    if(form == 'global_listing_setting_frm'){
        is_global = 1;
        data = {
        }
    }
    $.ajax({
        url: '/admin/save-listing-settings/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: $('#'+form).serialize(),
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Property Settings ", message: response.msg, size: 'large'});
                if(form == 'listing_setting_frm'){
                    $('#EditLisingSettingModal').modal('hide');
                    try{
                        var property_id = response.data.property_id;
                        var auction_id = response.data.auction_id;
                        var auction_type = 1;
                        // if(response.data.auction_type){
                        //     auction_type = response.data.auction_type;
                        // }

                       custom_response = {
                        'site_id': site_id,
                        'user_id': '',
                        'property_id': property_id,
                        'auction_id': auction_id,
                        'auction_type': auction_type,
                      };
                      customCallBackFunc(update_bidder_socket, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }else{
                    window.setTimeout(function () {
                        window.location.href = '/admin/listing/';
                    }, 2000);
                }
            }else{
                window.setTimeout(function () {
                    $.growl.error({title: "Property Settings", message: response.msg, size: 'large'});
                }, 2000);
            }
        },
        complete: function(){
            $('.overlay').hide();
        },
    });
}


function update_bidder_socket(response){
    if(typeof(response.auction_type) != 'undefined' && parseInt(response.auction_type) == 2){
        if("user_id" in response && response.user_id != ""){
            var encryptedUserId = encryptUserId(str(response.user_id), encryptionKey);
        }else{
            var encryptedUserId = response.user_id;
        }
        // socket.emit("checkInsiderBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
        socket.emit("checkInsiderBid", {"user_id": encryptedUserId, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
    }else{
        if("user_id" in response && response.user_id != ""){
            var encryptedUserId = encryptUserId(str(response.user_id), encryptionKey);
        }else{
            var encryptedUserId = response.user_id;
        }
        // socket.emit("checkBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
        socket.emit("checkBid", {"user_id": encryptedUserId, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
    }

}