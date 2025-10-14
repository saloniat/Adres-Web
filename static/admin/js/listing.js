$(document).ready(function(){
    $('.convert_to_local_date_time_cst, .convert_to_local_date_time').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDateFromUTC(added_on.trim(), 'yyyy-mm-dd','ampm');
                actual_date = local_date.split(" ");
                actual_date = actual_date[0]+' <span>'+actual_date[1]+' '+actual_date[2]+'</span>';
                $(this).html(actual_date);
            }else{
                $(this).html('-');
            }
        }catch(ex){
            //console.log(ex);
        }
    });

    $(document).on('click', '.display_status', function(){
        $(this).next().show();
        $(this).hide();
    });
    $(document).on('click', '.approval_status', function(){
        $(this).next().show();
        $(this).hide();
    });

    $(document).on('click', '#del_prop_false', function(){
        $('#del_prop_true').removeAttr('rel_id');
        $('#del_prop_false').removeAttr('rel_id');
        $('.personalModalwrap').modal('hide');
        return false;
    });

    $('#listing_setting_frm').validate({
        errorElement: 'p',
        rules:{
            auto_approval:{
                required: true
            },
            // is_deposit_required:{
            //     required: true
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
            bid_limit:{
                required: function () {
                    if (parseInt($('input[name="auto_approval"]').val()) == 1) {
                        return true;
                    }else{
                        return false;
                    }
                },
                min:0
            },
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

    $(document).on("click", "#emailAllUsersFormFavourite #emailAllSubmitWatcher", function (e) {
        e.preventDefault();
        var property_id = $("#emailPropertyidFavourite").val();
        //emailPropertyTotalWatcher(property_id);
    })

    $('#prop_search').on('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Optional: prevent form submission
            propertyListingSearch(1);
        }
    });
});

function change_property_status(property_id,element){
    var status_id = $('option:selected',element).val();
       var status_name = $('option:selected',element).text();
       var property_id = property_id;
       data = {property_id: property_id, status_id : status_id, status_name: status_name};

       $.ajax({
        url: '/admin/change-property-status/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: data,
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                var property_id = response.property_id.toString();
                var status_id = response.status_id;
                var status_name = response.status_name;
                var badge_class='badge-success';
                if(status_id == 2 || status_id == 5){
                    badge_class = 'badge-danger';
                }else if(status_id == 4 || status_id == 7){
                    badge_class = 'badge-warning';
                }
                $('#change_status_'+property_id).hide();
                $('#display_status_'+property_id).html('<span class="badge '+badge_class+'" style="cursor:pointer;">'+status_name+'</span>').show();
                window.setTimeout(function () {
                    $.growl.notice({title: "Listing ", message: response.msg, size: 'large'});
                }, 2000);
            }else{
                window.setTimeout(function () {
                    $.growl.error({title: "Listing ", message: response.msg, size: 'large'});
                }, 2000);
            }
        }
    });
}

function check_approval_status(property_id, element){
    var approval_id = $('option:selected',element).val();
    var approval_name = $('option:selected',element).text();
    if (approval_id == 29){
        $("#property_return_property_id").val(property_id);
        $("#return_approval_id").val(approval_id);
        $("#return_approval_name").val(approval_name);
        $('#property_return_reason').val("");
        $('#property_return_modal').modal('show');
    }else{
        $('#property_return_modal').modal('hide');
        change_apporval_status_new(property_id, approval_id, approval_name);
    }
}

function save_approval_status(){
    var property_id = $("#property_return_property_id").val();
    var approval_id = $("#return_approval_id").val();
    var approval_name = $("#return_approval_name").val();
    var seller_property_return_reason = $("#property_return_reason").val();
    if (seller_property_return_reason == ""){
        $("#property_return_reason").addClass("error");
        $.growl.error({title: "Listing Approval ", message: "Reason field is required.", size: 'large'});
        return false;
    }else{
        change_apporval_status_new(property_id, approval_id, approval_name, seller_property_return_reason);
    }
    
}

function change_apporval_status_new(property_id, approval_id, approval_name, return_reason=""){
    console.log("yessssss");
    data = {property_id: property_id, approval_id : approval_id, approval_name: approval_name, return_reason: return_reason};
    $.ajax({
     url: '/admin/change-approval-status/',
     type: 'post',
     dataType: 'json',
     cache: false,
     data: data,
     beforeSend: function(){
         $('.overlay').show();
     },
     success: function(response){
         $('.overlay').hide();
         $('#property_return_modal').modal('hide');
         if(response.error == 0){
             var property_id = response.property_id.toString();
             var approval_id = response.approval_id;
             var approval_name = response.approval_name;
             var badge_class='badge-success';
             if(approval_id != 28){
                 badge_class = 'badge-warning';
             }
             $('#change_approval_'+property_id).hide();
             $('#approval_status_'+property_id).html('<span class="badge '+badge_class+'" style="cursor:pointer;">'+approval_name+'</span>').show();
             window.setTimeout(function () {
                 $.growl.notice({title: "Listing ", message: response.msg, size: 'large'});
             }, 2000);
             custom_response = {
                //  'user_id': response.data.agent_id,
                 'user_id': encryptUserId(String(response.data.agent_id), encryptionKey),
             };
             customCallBackFunc(update_notification_socket, [custom_response]);
         }else{
             window.setTimeout(function () {
                 $.growl.error({title: "Listing ", message: response.msg, size: 'large'});
             }, 2000);
         }
     }
 });
 
}

function propertyListingSearch(current_page){
    var search = $('#prop_search').val();
    var currpage = current_page;
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var status = $('option:selected','#prop_filter_status').val();
    var closing_status = $('option:selected','#closing_status').val();
    var asset_type = $('option:selected','#filter_asset_type').val();
    var auction_type = $('option:selected','#filter_auction_type').val();
    var property_type = $('option:selected','#filter_property_type').val();
    var agent = $('option:selected','#filter_agent').val();
    var developer = $('option:selected','#filter_developer').val();
    var project = $('option:selected','#filter_project').val();
    var employee_id = $('option:selected','#filter_employee').val();
    var seller_id = $('option:selected','#filter_seller').val();
    var sub_admin_id = $('option:selected','#filter_sub_admin').val();
    var property_approval = $('option:selected','#filter_property_approval').val();
    
    try{
        // var uri = window.location.href.toString();
        // if (uri.indexOf("?") > 0) {
        //     var clean_uri = uri.substring(0, uri.indexOf("?"));
        //     window.history.replaceState({}, document.title, clean_uri);
        // }
        const url = new URL(window.location.href);
        url.search = ""; // Clears query parameters
        window.history.replaceState({}, document.title, url.toString());
    }catch(ex){
        //console.log(ex);
    }

    $.ajax({
        url: '/admin/listing/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: {search: search, perpage: recordPerpage, status: status, closing_status: closing_status, asset_type: asset_type, auction_type: auction_type, page: currpage, property_type: property_type, agent:agent, developer: developer, property_approval: property_approval, project_id: project, employee_id: employee_id, seller_id: seller_id, sub_admin_id: sub_admin_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                if($('#prop_num_record').val() != ""){
                    recordPerpage = $('#prop_num_record').val();
                }
                //var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');
                $('#tbl_property_list').empty();
                $('#tbl_property_list').html(response.property_listing_html);
                $("#tbl_property_list").find('script').remove();
                $("#prop_listing_pagination_list").html(response.pagination_html);
                $("#counter_num").val(response.sno);
                // if(response.auction_id == 1 || response.auction_id == 2 || response.auction_id == ""){
                //     $("#download_btn_section").html('<a href="javascript:void(0)" class="btn btn-primary btn-xs" onclick="downloadListing(\''+response.page+'\');"><i class="fas fa-download"></i> Download</a> <a href="/admin/listing-settings/" class="btn btn-primary btn-xs"><i class="fas fa-wrench"></i> Setting</a>');
                // }else{
                //     $("#download_btn_section").html('<a href="javascript:void(0)" class="btn btn-primary btn-xs" onclick="downloadListing(\''+response.page+'\');"><i class="fas fa-download"></i> Download</a>');
                // }
            }else{
                $('#tbl_property_list').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
            }
            $(window).scrollTop(0);
            $("#tbl_property_list").find('script').remove();
        }
    });
}

function downloadListing__OLD(current_page){
    var search = $('#prop_search').val();
    var currpage = current_page;
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('#prop_num_record').val();
    }
    var status = $('#prop_filter_status').val();
    var asset_type = $('#filter_asset_type').val();
    var auction_type = $('#filter_auction_type').val();
    var property_type = '';
    var agent = $('#filter_agent').val();
    
    var filter_sub_admin = $('#filter_sub_admin').val();
    var filter_developer = $('#filter_developer').val();
    var filter_employee = $('#filter_employee').val();
    var filter_seller = $('#filter_seller').val();
    var filter_project = $('#filter_project').val();
    property_type = $('#filter_property_type').val();
    var filter_property_approval = $('#filter_property_approval').val();
    var filter_property_approval = $('#filter_property_approval').val();

    window.location.href = '/admin/download-listing/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&status='+status+'&asset_type='+asset_type+'&auction_type='+auction_type+'&property_type='+property_type+'&agent='+agent;
}

function downloadListing__NEW(current_page){
    $.ajax({
        url: '/admin/download-listing-csv/',
        type: 'POST',
        xhrFields: {
            responseType: 'blob'  // important for file download
        },
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  // Uncomment if CSRF is enabled
        },
        success: function(blob, status, xhr) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Optional: Get filename from Content-Disposition
            const disposition = xhr.getResponseHeader('Content-Disposition');
            let filename = 'data.csv';
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename="(.+)"/);
                if (match.length === 2) filename = match[1];
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
        error: function() {
            alert('Download failed.');
        }
    });
}


function downloadListing(current_page){
    var search = $('#prop_search').val();
    var currpage = current_page;
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var status = $('option:selected','#prop_filter_status').val();
    var closing_status = $('option:selected','#closing_status').val();
    var asset_type = $('option:selected','#filter_asset_type').val();
    var auction_type = $('option:selected','#filter_auction_type').val();
    var property_type = $('option:selected','#filter_property_type').val();
    var agent = $('option:selected','#filter_agent').val();
    var developer = $('option:selected','#filter_developer').val();
    var project = $('option:selected','#filter_project').val();
    var employee_id = $('option:selected','#filter_employee').val();
    var seller_id = $('option:selected','#filter_seller').val();
    var sub_admin_id = $('option:selected','#filter_sub_admin').val();
    var property_approval = $('option:selected','#filter_property_approval').val();
    
    try{
        const url = new URL(window.location.href);
        url.search = ""; // Clears query parameters
        window.history.replaceState({}, document.title, url.toString());
    }catch(ex){
        //console.log(ex);
    }

    $.ajax({
        url: '/admin/download-listing-csv/',
        type: 'post',
        // dataType: 'json',
        xhrFields: {
            responseType: 'blob'  // important for file download
        },
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  // Uncomment if CSRF is enabled
        },
        cache: false,
        data: {search: search, perpage: recordPerpage, status: status, closing_status: closing_status, asset_type: asset_type, auction_type: auction_type, page: currpage, property_type: property_type, agent:agent, developer: developer, property_approval: property_approval, project_id: project, employee_id: employee_id, seller_id: seller_id, sub_admin_id: sub_admin_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(blob, status, xhr) {
            $('.overlay').hide();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Optional: Get filename from Content-Disposition
            const disposition = xhr.getResponseHeader('Content-Disposition');
            let filename = 'data.csv';
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const match = disposition.match(/filename="(.+)"/);
                if (match.length === 2) filename = match[1];
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        },
    });
}




function property_delete_confirmation(property_id){
    $('.personalModalwrap').modal('hide');
    $('#confirmPropertyDeleteModal').modal('show');
    $('.del_prop_btn').attr('rel_id', property_id);
}

function delete_property(){
    var row_id = $('#del_prop_true').attr('rel_id');
    if(row_id != ""){
    $('#property_list #row_id_'+row_id).remove();
    var search = $('#prop_search').val();
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('#prop_num_record').val();
    }
    var status = $('#prop_filter_status').val();
    var asset_type = $('#filter_asset_type').val();
    var auction_type = $('#filter_auction_type').val();
    var property_type = $('#filter_property_type').val();
        $.ajax({
        url: '/admin/delete-property/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {property_id: row_id, search: search, perpage: recordPerpage, status: status, asset_type: asset_type, auction_type: auction_type, page: 1, property_type: property_type},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $('#del_prop_true').removeAttr('rel_id');
            $('#del_prop_false').removeAttr('rel_id');
            $('#confirmPropertyDeleteModal').modal('hide');
            var auction_type = $('option:selected','#filter_auction_type').val();
            var auction_type_text = '';
            if(response.error == 0){
                $.growl.notice({title: "Property ", message: response.msg, size: 'large'});
                if(parseInt(auction_type) == 4){
                    auction_type_text = 'traditional offer';
                }else if(parseInt(auction_type) == 7){
                    auction_type_text = 'highest offer';
                }else if(parseInt(auction_type) == 4){
                    auction_type_text = 'live offer';
                }
                if(auction_type_text != ""){
                    window.location.href = '/admin/listing/?auction_type='+auction_type_text;
                }else{
                    window.location.href = '/admin/listing/';
                }

            }else{
                //$('#agent_list').empty();
                $('#del_prop_true').removeAttr('rel_id');
                $('#del_prop_false').removeAttr('rel_id');
                $('#confirmPropertyDeleteModal').modal('hide');
                window.setTimeout(function () {
                    $.growl.error({title: "Property ", message: response.msg, size: 'large'});
                }, 2000);
            }
            $(window).scrollTop(0);
        }
    });
    }
}

function get_listing_setting_details(property_id){
    if(property_id){
    data = {'property_id': property_id}
        $.ajax({
            url: '/admin/get-listing-settings/',
            type: 'post',
            headers: { 'X-CSRFToken': getCookie('csrftoken') },
            dataType: 'json',
            cache: false,
            data: data,
            beforeSend: function () {
                $(':submit').attr('disabled', 'disabled');
                $.blockUI({
                    message: '<h4>Please wait!</h4>'
                });
            },
            complete: function () {
                $.unblockUI();
                $(':submit').removeAttr('disabled');
            },
            success: function(response){
                $('.error:not("input.error")').hide();
                var property_id = response.property_id;
                $('#listing_setting_frm #property_id').val(property_id);

                var auto_approval = 0;
                var deposit_required = 0;
                var show_reverse_not_met = 0;
                var is_log_time_extension = 0;
                var time_flash = '';
                var bid_limit = '';
                var deposit_amount = '';
                var log_time_extension = '';
                var auction_id = '';
                var remain_time_to_add_extension = '';
                if(response.listing_setting.auto_approval == true){
                    auto_approval = 1;
                }
                if(response.listing_setting.is_deposit_required == true){
                    deposit_required = 1;
                }
                if(response.listing_setting.show_reverse_not_met == true){
                    show_reverse_not_met = 1;
                }
                if(response.listing_setting.is_log_time_extension == true){
                    is_log_time_extension = 1;
                }
                if(response.listing_setting.time_flash){
                    time_flash = response.listing_setting.time_flash;
                }
                if(response.listing_setting.log_time_extension){
                    log_time_extension = response.listing_setting.log_time_extension;
                }
                if(response.listing_setting.remain_time_to_add_extension){
                    remain_time_to_add_extension = response.listing_setting.remain_time_to_add_extension;
                }
                if(response.listing_setting.bid_limit){
                    bid_limit = response.listing_setting.bid_limit;
                }
                if(response.listing_setting.deposit_amount){
                    deposit_amount = response.listing_setting.deposit_amount;
                }
                if(response.listing_setting.auction_id){
                    auction_id = response.listing_setting.auction_id;
                }
                if(response.listing_setting.service_fee){
                    service_fee = response.listing_setting.service_fee;
                }
                if(response.listing_setting.auction_fee){
                    auction_fee = response.listing_setting.auction_fee;
                }
                $('#listing_setting_frm #property_id').val(property_id);
                $('#listing_setting_frm #auction_id').val(auction_id);
                $('#listing_setting_frm input[name="auto_approval"][value="'+auto_approval+'"]').prop('checked', true);
                $('#listing_setting_frm input[name="is_deposit_required"][value="'+deposit_required+'"]').prop('checked', true);
                $('#listing_setting_frm input[name="reserve_not_met"][value="'+show_reverse_not_met+'"]').prop('checked', true);
                $('#listing_setting_frm input[name="is_log_time_extension"][value="'+is_log_time_extension+'"]').prop('checked', true);
                $('#listing_setting_frm #timer_flash').val(time_flash);
                $('#listing_setting_frm #log_time_extension').val(log_time_extension);
                $('#listing_setting_frm #remain_time_to_add_extension').val(remain_time_to_add_extension);
                $('#listing_setting_frm #service_fee').val(service_fee);
                $('#listing_setting_frm #auction_fee').val(auction_fee);

                if(auto_approval == 1){
                    $('#listing_setting_frm #bid_limit').val(bid_limit);
                    $('#listing_setting_frm .bid_limit_section').show();
                }else{
                    $('#listing_setting_frm #bid_limit').val('');
                    $('#listing_setting_frm .bid_limit_section').hide();
                }
                if(deposit_required == 1){
                    $('#listing_setting_frm #listing_deposit_amount').val(deposit_amount);
                    $('#listing_setting_frm .deposit_amount_section').show();
                }else{
                    $('#listing_setting_frm #listing_deposit_amount').val('');
                    $('#listing_setting_frm .deposit_amount_section').hide();
                }
                $('#EditLisingSettingModal').modal('show');
            }
        });
    }
}

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
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
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
                        if(response.data.auction_type){
                            auction_type = response.data.auction_type;
                        }

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

function close_listing_setting_popup(){
    $('#EditLisingSettingModal').modal('hide');
}

function close_make_highest_popup(){
    $('#highestBidderDetailsModal').modal('hide');
}

function propertyBidderListingSearch(property_id, current_page, filter_listing){
    $('#popup_property_id').val(property_id);
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var search = $('#popup_bidder_popup_search').val();
    var currpage = current_page;
    var asset_type_filter = '';
    var filter_bidder_status = $('#popup_filter_bidder_status').val();
    $.ajax({
        url: '/admin/property-bidder-registration/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: {'search': search, 'page': currpage, 'page_size': recordPerpage, 'asset_type': asset_type_filter, 'filter_bidder_status': filter_bidder_status, 'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#bid_popup_listing_pagination_list").empty();
            $("#popup_bidder_list").empty();
            $("#bidder_list_export_btn_section").empty();
            $("#popup_property_address").empty();
            var url = response.domain_react_url +'property/detail/'+property_id+'/'+response.property_url_decorator;
            $("#propertyLink").attr("href", url);
            if(response.property_image != ""){
                $("#popup_property_image").attr('src', response.property_image);
            }else {
                $("#popup_property_image").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_name != ""){
                // $('#popup_property_address').html(response.property_address+' <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
                $('#popup_property_address').html(response.property_name+' <span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' - '+response.property_community+'</span>');
            }

            if(response.error == 0){
                $("#popup_bidder_list").html(response.bidder_listing_html);
                $("#bid_popup_listing_pagination_list").html(response.pagination_html);
                $("#bidder_list_export_btn_section").html('<button type="button" class="btn btn-primary btn-xs" onClick="exportBidderList(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button>');
                //$("#blog_sidebar").html(response.blog_sidebar_html);
            }else{
                $('#blog_list').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bidder_list_export_btn_section").html('<button type="button" class="btn btn-primary btn-xs"><i class="fas fa-file-export"></i> Export</button>');
                $("#bid_listing_pagination_list").hide();
            }
            $('#bidderlistModal').modal('show');
        }
    });
}

function propertyBidHistorySearch(property_id, current_page){
    $('#bidHistoryPropertyId').val(property_id);
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var currpage = current_page;
    var search = $('#search_bid_history').val();
    $.ajax({
        url: '/admin/property-bid-history/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            // console.log("New Res:",response)
            $('.overlay').hide();
            $("#bidHistoryPaginationList").empty();
            $("#bidHistoryList").empty();
            $("#bidHistoryPropertyName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#bidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#bidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_name != ""){
                var url = response.domain_react_url +'property/detail/'+property_id+'/'+response.property_url_decorator;
                // $('#bidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
                $('#bidHistoryPropertyName').html('<a href="'+url+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' - '+response.property_community+'</span>');
            }
            if(response.auction_type){
                // $('#bidHistoryAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                // $('#bidHistoryBidIncrement').html('$' + response.bid_increment)
            }
            if(response.property_type){
                // $('#bidHistoryPropertyType').html(response.property_type)
            }

            if(response.property_image != ""){
                $("#tempbidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#tempbidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_name != ""){
                var url = response.domain_react_url +'property/detail/'+property_id+'/'+response.property_url_decorator;
                // $('#tempbidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
                $('#tempbidHistoryPropertyName').html('<a href="'+url+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' '+response.community+'</span>');
            }

            if(response.error == 0){
                $("#bidHistoryList").html(response.bid_history_html);
                $("#bidHistoryListTemp").html(response.temp_bid_history_html);
                $("#bidHistoryPaginationList").html(response.pagination_html);
                if( !response.is_reserve_met ){
                    if(parseInt(response.status_id) == 9 && parseInt(response.closing_status_id) == 16 && parseInt(response.number_bid) > 0 && !response.payment_settled){
                        // var html_button = "<button class='btn btn-primary' onclick=\"makeHighestBid('" + property_id + "')\">Make Highest Bid</button>";
                        var html_button = "<button class='btn btn-primary' onclick=\"highestBidderDetails('" + property_id + "')\">Make Highest Bid</button>";
                        $(".make_highest_bid").html(html_button);
                        $(".make_highest_bid").show();

                    }else if(parseInt(response.status_id) == 9 && parseInt(response.number_bid) > 0 && response.payment_settled) {
                        var html_button = "<button class='btn btn-primary' disabled >Make Highest Bid</button>";
                        $(".make_highest_bid").html(html_button);
                        $(".make_highest_bid").show();
                    }
                    if(response.can_relist){
                        var button = "<button type='button' class='btn btn-secondary' onclick='propertyRelist("+property_id+");'>Relist</button>"
                        $(".make_relist").html(button).show();
                    }else{
                        $(".make_relist").hide();
                    }
                }
            }else{
                $('#bidHistoryList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bidHistoryPaginationList").hide();
            }
            var search_bid_history = $('#search_bid_history').val();
            if(typeof(response.total) != 'undefined' && response.total){
                //$('#bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_bid_history" id="search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyBidHistorySearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div><div class="block last highest_bid_btn"><button type="button" class="btn btn-primary btn-sm pl20" onClick="confirmDeleteLastBid(\''+response.property_id+'\')"> <i class="fas fa-trash-alt"></i> Highest Bid</button></div>');
                //$('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="clearfix"></div>   <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div><div class="block last highest_bid_btn"><button type="button" class="btn btn-primary btn-sm pl20" onClick="confirmDeleteLastBid(\''+response.property_id+'\')"> <i class="fas fa-trash-alt"></i> Highest Bid</button></div>');
                $('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div>');
                $('#tempbid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div> <div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div>');
            }else{
                //$('#bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_bid_history" id="search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyBidHistorySearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
                $('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div>');
            }

            $('#bidderrecordModal').modal('show');
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error);
            alert("Something went wrong. Please try again.");
        }
    });
}

function propertyBidHistoryPreviousSearch(property_id, current_page){
    $('#bidHistoryPropertyId').val(property_id);
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var currpage = current_page;
    var search = $('#search_bid_history').val();
    $.ajax({
        url: '/admin/property-bid-history/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            // console.log("New Res:",response)
            $('.overlay').hide();
            $("#bidHistoryPaginationList").empty();
            $("#bidHistoryList").empty();
            $("#bidHistoryPropertyName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#bidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#bidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_name != ""){
                var url = response.domain_react_url +'property/detail/'+property_id+'/'+response.property_url_decorator;
                // $('#bidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
                $('#bidHistoryPropertyName').html('<a href="'+url+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' - '+response.property_community+'</span>');
            }
            if(response.auction_type){
                // $('#bidHistoryAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                // $('#bidHistoryBidIncrement').html('$' + response.bid_increment)
            }
            if(response.property_type){
                // $('#bidHistoryPropertyType').html(response.property_type)
            }

            if(response.property_image != ""){
                $("#tempbidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#tempbidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_name != ""){
                var url = response.domain_react_url +'property/detail/'+property_id+'/'+response.property_url_decorator;
                // $('#tempbidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
                $('#tempbidHistoryPropertyName').html('<a href="'+url+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' '+response.community+'</span>');
            }

            if(response.error == 0){
                $("#bidHistoryList").html(response.bid_history_html);
                $("#bidHistoryListTemp").html(response.temp_bid_history_html);
                $("#bidHistoryPaginationList").html(response.pagination_html);
            }else{
                $('#bidHistoryList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bidHistoryPaginationList").hide();
            }
            var search_bid_history = $('#search_bid_history').val();
            if(typeof(response.total) != 'undefined' && response.total){
                //$('#bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_bid_history" id="search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyBidHistorySearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div><div class="block last highest_bid_btn"><button type="button" class="btn btn-primary btn-sm pl20" onClick="confirmDeleteLastBid(\''+response.property_id+'\')"> <i class="fas fa-trash-alt"></i> Highest Bid</button></div>');
                //$('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="clearfix"></div>   <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div><div class="block last highest_bid_btn"><button type="button" class="btn btn-primary btn-sm pl20" onClick="confirmDeleteLastBid(\''+response.property_id+'\')"> <i class="fas fa-trash-alt"></i> Highest Bid</button></div>');
                $('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div>');
                $('#tempbid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div> <div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div>');
            }else{
                //$('#bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_bid_history" id="search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyBidHistorySearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
                $('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div>');
            }

            $('#bidderrecordModal').modal('show');
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error);
            alert("Something went wrong. Please try again.");
        }
    });
}


function makeHighestBid(property_id){
    $.ajax({
        url: '/admin/make-highest-bid/',
        type: 'post',
        dataType: 'json',
        cache: false,
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        // data: {'property_id': property_id, csrfmiddlewaretoken: getCookie("csrftoken"),},
        data: {'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Highest Bid", message: response.msg, size: 'large'});
                $('#bidderrecordModal').modal('hide');
            }else{
                $.growl.error({title: "Highest Bid", message: response.msg, size: 'large'});
            }  
        }
    });
}

function makeHighestBidFromPopUp(){
    var property_id = $("#highestBidderDetailsPropertyId").val();
    $.ajax({
        url: '/admin/make-highest-bid/',
        type: 'post',
        dataType: 'json',
        cache: false,
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        // data: {'property_id': property_id, csrfmiddlewaretoken: getCookie("csrftoken"),},
        data: {'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Highest Bid", message: response.msg, size: 'large'});
                $('#highestBidderDetailsModal').modal('hide');
                $('.make_highest_bid button').attr('disabled', true);
            }else{
                $.growl.error({title: "Highest Bid", message: response.msg, size: 'large'});
            }  
        }
    });
}

function highestBidderDetails(property_id){
    $.ajax({
        url: '/admin/highest-bidder-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        // data: {'property_id': property_id, csrfmiddlewaretoken: getCookie("csrftoken"),},
        data: {'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $("#highestBidderDetailsPropertyId").val(property_id);
                $("#highest_bid_amount").text(response.data.highest_bid_amount.toLocaleString());
                $(".highest_biidder_name").text(response.data.highest_biidder_name);
                $('#highestBidderDetailsModal').modal('show');
            }else{
                $.growl.error({title: "Highest Bidder Details", message: response.msg, size: 'large'});
            }  
        }
    });
}

function totalPropertyFavouriteSearch(property_id, current_page){
    $('#propertyTotalView').val(property_id);
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var currpage = current_page;
    var search = $('#search_property_favourite').val();
    $.ajax({
        url: '/admin/property-total-favourite/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#propertyTotalFavouritePaginationList").empty();
            $("#propertyTotalFavouritePaginationListList").empty();
            $("#propertyTotalFavouriteName").empty();
            if(response.property_image != ""){
                $("#propertyTotalFavouriteImage").attr('src', response.property_image);
            }else {
                $("#propertyTotalFavouriteImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_name != ""){
                var url = response.domain_react_url +'property/detail/'+property_id+'/'+response.property_url_decorator;
                $('#propertyTotalFavouriteName').html('<a href="'+url+'" id="" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' -  '+response.property_community+'</span>');
            }
            
            if(response.error == 0){
                $("#propertyTotalFavouritePaginationListList").html(response.html);
                $("#propertyTotalFavouritePaginationList").html(response.pagination_html);
            }else{
                $('#propertyTotalFavouritePaginationListList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#propertyTotalFavouritePaginationList").hide();
            }
            var search_property_total_watcher = $('#search_property_favourite').val();
            if(typeof(response.total) != 'undefined' && response.total){
                $('#property_total_favourite_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_favourite" id="search_property_favourite" class="form-control" value="'+search_property_total_watcher+'"><button type="button" id="property_total_watcher_search_btn" class="btn btn-gray btn-xs" onclick="totalPropertyFavouriteSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportPropertyTotalFavourite(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="emailPropertyTotalToAllFavourite(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div>');
            }else{
                $('#property_total_favourite_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_favourite" id="search_property_favourite" class="form-control" value="'+search_property_total_watcher+'"><button type="button" id="property_total_watcher_search_btn" class="btn btn-gray btn-xs" onclick="totalPropertyFavouriteSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportPropertyTotalFavourite(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
            }

            $('#property_favourite_model').modal('show');
        }
    });
}

function totalPropertyInterestSearch(property_id, current_page){
    $('#propertyTotalView').val(property_id);
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var currpage = current_page;
    var search = $('#search_property_interest').val();
    $.ajax({
        url: '/admin/property-total-interest/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#propertyTotalInterestPaginationList").empty();
            $("#propertyTotalInterestPaginationListList").empty();
            $("#propertyTotalInterestName").empty();
            if(response.property_image != ""){
                $("#propertyTotalInterestImage").attr('src', response.property_image);
            }else {
                $("#propertyTotalInterestImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_name != ""){
                var url = response.domain_react_url +'property/detail/'+property_id+'/'+response.property_url_decorator;
                $('#propertyTotalInterestName').html('<a href="'+url+'" id="" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' -  '+response.property_community+'</span>');
            }
            
            if(response.error == 0){
                $("#propertyTotalInterestPaginationListList").html(response.html);
                $("#propertyTotalInterestPaginationList").html(response.pagination_html);
            }else{
                $('#propertyTotalInterestPaginationListList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#propertyTotalInterestPaginationList").hide();
            }
            var search_property_total_watcher = $('#search_property_interest').val();
            if(typeof(response.total) != 'undefined' && response.total){
                $('#property_total_interest_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_interest" id="search_property_interest" class="form-control" value="'+search_property_total_watcher+'"><button type="button" id="property_total_watcher_search_btn" class="btn btn-gray btn-xs" onclick="totalPropertyInterestSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportPropertyTotalInterest(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="block last"></div>');
            }else{
                $('#property_total_inrest_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_interest" id="search_property_interest" class="form-control" value="'+search_property_total_watcher+'"><button type="button" id="property_total_watcher_search_btn" class="btn btn-gray btn-xs" onclick="totalPropertyInterestSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportPropertyTotalInterest(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
            }

            $('#property_interest_model').modal('show');
        }
    });
}

function buyNowSearch(property_id, current_page){
    $('#propertyBuyNow').val(property_id);
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var currpage = current_page;
    var search = $('#search_property_buy_now').val();
    $.ajax({
        url: '/admin/property-buy-now/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#propertyBuyNowPaginationList").empty();
            $("#propertyBuyNowPaginationListList").empty();
            $("#propertyBuyNowName").empty();
            if(response.property_image != ""){
                $("#propertyBuyNowImage").attr('src', response.property_image);
            }else {
                $("#propertyBuyNowImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_name != ""){
                var url = response.domain_react_url +'property/detail/'+property_id+'/'+response.property_url_decorator;
                // $('#propertyBuyNowName').html('<a href="'+url+'" id="" target="_blank">'+response.property_name+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' -  '+response.property_community+'</span>');
                $('#propertyBuyNowName').html(response.property_name+'<span><i class="fas fa-map-marker-alt"></i> '+response.property_state+' -  '+response.property_community+'</span>');
            }
            
            if(response.error == 0){
                $("#propertyBuyNowPaginationListList").html(response.html);
                $("#propertyBuyNowPaginationList").html(response.pagination_html);
            }else{
                $('#propertyBuyNowPaginationListList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#propertyBuyNowPaginationList").hide();
            }
            var search_property_total_watcher = $('#search_property_interest').val();
            if(typeof(response.total) != 'undefined' && response.total){
                $('#property_buy_now_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_buy_now" id="search_property_buy_now" class="form-control" value=""><button type="button" id="property_buy_now_btn" class="btn btn-gray btn-xs" onclick="buyNowSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportPropertyBuyNow(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="block last"></div>');
            }else{
                $('#property_total_inrest_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_buy_now" id="search_property_buy_now" class="form-control" value=""><button type="button" id="property_buy_now_btn" class="btn btn-gray btn-xs" onclick="buyNowSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-xs" onClick="exportPropertyBuyNow(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
            }

            $('#buy_now_model').modal('show');
        }
    });
}

function acceptBuyNow(property_id, requested_user_id){
    $.ajax({
        url: '/admin/accept-buy-now/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id, "requested_user_id": requested_user_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Buy Now", message: response.msg, size: 'large'});
                buyNowSearch(property_id, 1);
                custom_response = {
                    //  'user_id': response.data.agent_id,
                    'user_id': encryptUserId(String(requested_user_id), encryptionKey),
                };
                customCallBackFunc(update_notification_socket, [custom_response]);
            }else{
                $.growl.error({title: "Buy Now", message: response.msg, size: 'large'});
            }
        }
    });
}

function exportBidderList(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = '';
    var status = '';
    if(typeof($('#popup_bidder_popup_search').val()) != 'undefined'){
        search = $('#popup_bidder_popup_search').val();
    }
    if(typeof($('option:selected','#popup_filter_bidder_status').val()) != 'undefined'){
        status = $('option:selected','#popup_filter_bidder_status').val();
    }
    var recordPerpage = 10
    var currpage = current_page;
    var page_size = recordPerpage;

    window.location.href = '/admin/export-bidder-list/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone+'&status='+status;
}

function exportPropertyTotalFavourite(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#search_property_favourite').val();
    var currpage = current_page;
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var page_size = recordPerpage;
    window.location.href = '/admin/export-property-total-favourite/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

function exportPropertyTotalInterest(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#search_property_interest').val();
    var currpage = current_page;
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var page_size = recordPerpage;
    window.location.href = '/admin/export-property-total-interest/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

function exportPropertyBuyNow(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#search_property_interest').val();
    var currpage = current_page;
    var recordPerpage = 10
    if($('#prop_num_record').val() != ""){
        recordPerpage = $('option:selected','#prop_num_record').val();
    }
    var page_size = recordPerpage;
    window.location.href = '/admin/export-property-buy-now/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

function emailPropertyTotalToAllFavourite(property_id){
    $("#emailPropertyidFavourite").val(property_id);
    $("#emailRecordModalEmailFavourite").modal('show');
}


function emailPropertyTotalFavourite(){
    var property_id = $("#emailPropertyidFavourite").val();
    var listing_id = $('#emailPropertyidFavourite').val()
    var subject = $('#subjectFavourite').val().trim()
    var message = $('#messageFavourite').val().trim()
    var emailFor = $('#emailForObjectFavourite').val()
    if(!subject || !message){
        return false;
    }
    $.ajax({
        url: '/admin/email-all-property-viewer/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: { 'property_id': property_id, 'subject': subject, 'message': message, 'email_for': emailFor },
        beforeSend: function(){
            $('.overlay').show();
            //$('#emailAllSubmit').prop('disabled', true).html('Please wait...')
        },
        complete: function(){
             $('.overlay').hide();
            //$('#emailAllSubmit').prop('disabled', false).html('Send')
        },
        success: function(response){
            //$('.overlay').hide();
            if (response.error == 0 || response.status == 200) {
                    $("#emailRecordModalEmailWatcher").modal("hide");
                    $('#subjectWatcher, #messageWatcher').val('');
                    $('#emailAllSubmitWatcher').attr('disabled', true);
                    window.setTimeout(function () {
                        $.growl.notice({title: "Email Users", message: "Email Sent Successfully", size: 'large'});
                    }, 0);
                } else {
                    $("#emailrecordModal").modal("show");
                    window.setTimeout(function () {
                        $.growl.error({title: "Email Users", message: response.msg, size: 'large'});
                    }, 0);
                }
        }
    });
}

function enable_disable_email_all_button_favourite(){
    var subject = $("#subjectFavourite").val().trim();
    var message = $("#messageFavourite").val().trim();
    if(subject && message){
        $('#emailAllSubmitFavourite').attr('disabled', false)
    } else {
        $('#emailAllSubmitFavourite').attr('disabled', true)
    }
}

function customCallBackFunc(callback, args){
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}

function update_notification_socket(response){
    socket.emit("getNotifications", {"user_id": response.user_id});
}

function update_bidder_socket(response){
    if(typeof(response.auction_type) != 'undefined' && parseInt(response.auction_type) == 2){
        if("user_id" in response && response.user_id != ""){
            var encryptedUserId = encryptUserId(str(response.user_id), encryptionKey);
        }else{
            var encryptedUserId = response.user_id;
        }
        socket.emit("checkInsiderBid", {"user_id": encryptedUserId, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
    }else{
        if("user_id" in response && response.user_id != ""){
            var encryptedUserId = encryptUserId(str(response.user_id), encryptionKey);
        }else{
            var encryptedUserId = response.user_id;
        }
        socket.emit("checkBid", {"user_id": encryptedUserId, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
    }

}

function show_hide_data(listing_id){
    element = $("#bidding-record-data" + listing_id);
    if (element.is(":visible")){
        element.hide(1000);
        $('#arrowPositionBidder' + listing_id).removeClass('fa-chevron-up').addClass('fa-chevron-down');
    } else{
        element.show(1000);
        $('#arrowPositionBidder' + listing_id).removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
}

function printPage(class_name){
    var divToPrint = document.getElementById('tempbidderrecordModal');
    var htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding;0.5em;' +
        '}' +
        '</style>';
    htmlToPrint += divToPrint.outerHTML;

    newWin = window.open("");
    newWin.document.write("<h3 align='center'>Print Page</h3>");
    newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();
    return false;
}

function exportBidHistory(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#search_bid_history').val();
    if (search !== undefined && search !== null) {
        // If search is not undefined or null, it stays as is
    } else {
        search = '';
    }
    var currpage = current_page;
    var recordPerpage = 10;
    var page_size = recordPerpage;

    window.location.href = '/admin/export-bid-history/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

function emailPropertyTotalToAllBids(property_id){
    $("#emailPropertyidBid").val(property_id);
    $("#emailRecordModalEmailBid").modal('show');
}


function emailPropertyTotalBid(){
    var property_id = $("#emailPropertyidBid").val();
    var listing_id = $('#emailPropertyidBid').val()
    var subject = $('#subjectBid').val().trim()
    var message = $('#messageBid').val().trim()
    var emailFor = $('#emailForObjectBid').val()
    if(!subject || !message){
        return false;
    }
    $.ajax({
        url: '/admin/email-all-property-viewer/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: { 'property_id': property_id, 'subject': subject, 'message': message, 'email_for': emailFor },
        beforeSend: function(){
            $('.overlay').show();
            //$('#emailAllSubmit').prop('disabled', true).html('Please wait...')
        },
        complete: function(){
             $('.overlay').hide();
            //$('#emailAllSubmit').prop('disabled', false).html('Send')
        },
        success: function(response){
            //$('.overlay').hide();
            if (response.error == 0 || response.status == 200) {
                    $("#emailRecordModalEmailBid").modal("hide");
                    $('#subjectBid, #messageBid').val('');
                    $('#emailAllSubmitBid').attr('disabled', true);
                    window.setTimeout(function () {
                        $.growl.notice({title: "Email Users", message: "Email Sent Successfully", size: 'large'});
                    }, 0);
                } else {
                    $("#emailrecordModal").modal("show");
                    window.setTimeout(function () {
                        $.growl.error({title: "Email Users", message: response.msg, size: 'large'});
                    }, 0);
                }
        }
    });
}

function enable_disable_email_all_button_bid(){
    var subject = $("#subjectBid").val().trim();
    var message = $("#messageBid").val().trim();
    if(subject && message){
        $('#emailAllSubmitBid').attr('disabled', false)
    } else {
        $('#emailAllSubmitBid').attr('disabled', true)
    }
}

function propertyRelist(property_id){
    $.ajax({
        url: '/admin/property-relist/',
        type: 'post',
        dataType: 'json',
        cache: false,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  // Uncomment if CSRF is enabled
        },
        data: { 'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        complete: function(){
             $('.overlay').hide();
        },
        success: function(response){
            if (response.error == 0) {
                window.setTimeout(function () {
                    $.growl.notice({title: "Property Relist", message: response.msg, size: 'large'});
                }, 0);

                setTimeout(()=>{
                    window.location.href = "/admin/auction-detail/?property_id="+response.property_id;
                }, 2000);

            } else {
                window.setTimeout(function () {
                    $.growl.error({title: "Property Relist", message: response.msg, size: 'large'});
                }, 0);
            }
        }
    });
}