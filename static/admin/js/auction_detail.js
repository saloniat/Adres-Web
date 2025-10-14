$(document).ready(function(){
    $('.select').chosen();
    // set_datetimepicker('#start_date');
    // set_datetimepicker('#end_date');
    setCurrentFutureDateTimePicker('#start_date');
    setCurrentFutureDateTimePicker('#end_date');

    randerAddListingUtcToLocal("#utc_start_date", "#start_date"); // Rander datetime for start date
    randerAddListingUtcToLocal("#utc_end_date", "#end_date"); // Rander datetime for end date
    randerUtcToLocal("#auction_date_text_one"); // Rander datetime for reservation agreement
    randerUtcToLocal("#auction_date_text_two"); // Rander datetime for reservation agreement

    function formatInternationalNumber(x) {
        x = x.replace(/,/g, ''); // remove existing commas
        if (isNaN(x) || x === "") return x;
        return Number(x).toLocaleString("en-US"); // UAE uses international style
    }

    $("#start_price, #deposit_amount, #reserve_amount, #full_amount, #bid_increments").on("input", function () {
        let value = $(this).val();
        $(this).val(formatInternationalNumber(value));
    });

    $("#start_price, #deposit_amount, #reserve_amount, #full_amount, #bid_increments").on("input", function () {
        let value = $(this).val();
        $(this).val(formatInternationalNumber(value));
    });

    $("#sell_at_full_amount_status").on("change", function(){
        if($(this).is(':checked')){
            $(".full_price_field").show();
        }else{
            $(".full_price_field").hide();
        }
    });

    $("#bid_increment_status").on("change", function(){
        if($(this).is(':checked')){
            $(".bid_increment_field").show();
            $(".bid_increment_required_msg").hide();
        }else{
            $(".bid_increment_field").hide();
            $(".bid_increment_required_msg").show();
        }
    });

    $('#start_date').on('dp.change', function(e) {
        $(".auction_date_text").text($(this).val());
        var utc_date_time = convertLocalToUTC($(this).val());
        $("#utc_start_date").val(utc_date_time);
    });

    $('#end_date').on('dp.change', function(e) {
        var utc_date_time = convertLocalToUTC($(this).val());
        $("#utc_end_date").val(utc_date_time);
    });

    // --------------Next button for Ownership info----------
    $(document).on('click', '#section_one_next_button', function(){
        section_one_validate();
        if($('#auction_detail_frm').valid()){
            // -------Enable next section-------
            var href = $("#section_two").data('href');
            $("#section_two").attr('href', "#"+href);
            $("#section_two").removeClass('collapsed');
            $("#"+href).removeClass('collapse').addClass("in");
            $("#"+href).css('height', 'auto');
            $("#section_one").addClass('collapsed');
            $("#collapseOne").removeClass('in').addClass('collapse');
            $("#submit_button_section").show();
        }
    });

    $(document).on('change', "#relist", function () {
        var relist = $(this).val();
        if (relist == 1){
            $("#start_date, #end_date").prop("disabled", false);
            $("#start_date, #end_date").val("");
            setCurrentFutureDateTimePicker('#start_date');
            setCurrentFutureDateTimePicker('#end_date');
        }else{
            location.reload();
        }
    });

    //  ----------------Form Submit-----------
    $(document).on('click', '#property_info_submit_next_btn, #property_info_submit_exit_btn', function(){
        // ----------Adding Validation Rule Here For Owner----------
        section_two_validate();
        if($('#auction_detail_frm').valid()){
            if ($(this).attr("id") == "property_info_submit_next_btn"){
                var redirection_url = ""
            }else{
                var redirection_url = "/admin/listing/"
            }
            save_property('auction_detail_frm', redirection_url);
        }
    });

    // -----------Form Validation----------
    $('#auction_detail_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            auction_type:{
                required: false,
            },
            start_price:{
                required: false,
            },
            deposit_amount:{
                required: false,
            },
            reserve_amount:{
                required: false,
            },
            buyer_preference:{
                required: false,
            },
            start_date:{
                required: false,
            },
            end_date:{
                required: false,
            },
            is_featured:{
                required: false,
            },
            full_amount:{
                required: false,
            },
            bid_increments:{
                required: false,
            },
            signature:{
                required: false,
            },
            term_agreement:{
                required: false,
            }
        },
        messages:{
            num_beds:{
                required: "Bed is required"
            },
        },
        errorPlacement: function(error, element) {
            var range_input_arr = ['price_decrease_rate', 'dutch_auction_time', 'dutch_pause_time', 'sealed_auction_time', 'english_auction_time', 'sealed_pause_time'];
            if(element.hasClass('asset_type_radio')){
                error.insertAfter($('.asset_type_label').closest('.listing-type'));
            }else if(element.hasClass('select')){
                error.insertAfter(element.next('.chosen-container'));
            }else if(element.parent().hasClass('date')){
                error.insertAfter(element.parent());
            }else if(element.parent().hasClass('open_house_start')){
                error.insertAfter(element.parent());
            }else if(element.parent().hasClass('open_house_end')){
                error.insertAfter(element.parent());
            }else if(element.attr('name') == 'highest_offer_format'){
                error.insertAfter(element.closest('.lh46'));
            }else if(jQuery.inArray(element.attr('name'), range_input_arr) !== -1){
                error.insertAfter(element.closest('.range-slide'));
            }else{
                error.insertAfter(element);
            }
        },
        invalidHandler: function(e,validator) {
            // loop through the errors:
            console.log(validator.errorList);
            for (var i=0;i<validator.errorList.length;i++){
                console.log(validator.errorList[i].element);
                // "uncollapse" section containing invalid input/s:
                $(validator.errorList[i].element).closest('.panel-collapse.collapse').collapse('show');
            }
        }
    });
    
});

function save_property(element, redirection_url=""){
    for (instance in CKEDITOR.instances){
        CKEDITOR.instances[instance].updateElement();
    }
    $("#property_info_submit_next_btn, #property_info_submit_exit_btn").attr("disabled", true);
    //return false;
    $.ajax({
        url: '/admin/save-listing/',
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
                $.growl.notice({title: "Property ", message: response.msg, size: 'large'});
                try{
                    var property_id = response.data.data.property_id;
                    var auction_id = response.data.data.auction_id;
                }catch(ex){
                    var property_id = '';
                    var auction_id = '';
                }

                if(element == 'auction_detail_frm' && property_id != "" && auction_id != ""){
                    var auction_type = $('option:selected','#auction_type').val();
                    try{
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
                }

                window.setTimeout(function () {
                    if(redirection_url == ''){
                        window.location.href = "/admin/auction-detail/" +'?property_id='+response.data.data.property_id;
                    }else{
                        window.location.href = redirection_url;
                    }
                }, 2000);
            }else{
                $("#property_info_submit_next_btn, #property_info_submit_exit_btn").removeAttr("disabled");
                if(typeof(response.data) != 'undefined' && typeof(response.data.msg) != 'undefined'){
                    var msg = response.data.msg;
                }else{
                    var msg = response.msg;
                }

                var custom_msg = '';
                if(typeof(msg) === 'object'){
                    $.each(msg, function (i) {
                        try{
                            custom_msg += '<span>'+msg[i]+'</span><br>';
                        }catch(ex){
                            custom_msg += '<span>'+msg+'</span><br>';
                        }

                    });
                }else if(Array.isArray(msg)){
                    $.each(msg, function(i) {
                        custom_msg += '<span>'+msg[i]+'</span><br>';
                    });
                }else{
                    custom_msg = msg;
                }
                window.setTimeout(function () {
                    $.growl.error({title: "Property ", message: custom_msg, size: 'large'});
                }, 2000);
            }
        }
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


function section_one_validate(){
    $('#auction_detail_frm').validate().settings.rules = {
        auction_type:{
            required: true,
        },
        start_price:{
            required: true,
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        deposit_amount:{
            required: true,
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        reserve_amount:{
            required: true,
            greaterThanValue: function(){
                if ($('#reserve_amount').val() != "") {
                    return '#start_price';
                } else {
                    return false;
                }
            },
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        buyer_preference:{
            required: true,
        },
        start_date:{
            required: true,
        },
        end_date:{
            required: true,
            greaterThan: function(){
                if ($('#end_date').val() != "") {
                    return "#start_date";
                } else {
                    return false;
                }
            },
            timeDifferenceValid: function(){
                if ($('#auction_type').val() == 2) {
                    return "#start_date";
                } else {
                    return false;
                }
            },
        },
        is_featured:{
            required: true,
        },
        full_amount: {
            required: function() {
                return $("#sell_at_full_amount_status").is(":checked");
            },
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
            
        },
        bid_increment_status:{
            required: true,
        },
        
        bid_increments:{
            required: true,
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        // bid_increments:{
        //     required: function(){
        //         return $("#bid_increment_status").is(":checked");
        //     },
        // },
    };
}

function section_two_validate(){
    $('#auction_detail_frm').validate().settings.rules = {
        auction_type:{
            required: true,
        },
        start_price: {
            required: true,
            number: {
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            min: {
                param: 1,
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        deposit_amount: {
            required: true,
            number: {
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            min: {
                param: 1,
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        reserve_amount: {
            required: true,
            number: {
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            min: {
                param: 1,
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            greaterThanValue: function(){
                if ($('#reserve_amount').val() != "") {
                    return '#start_price';
                } else {
                    return false;
                }
            },
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        buyer_preference:{
            required: true,
        },
        start_date:{
            required: true,
        },
        end_date:{
            required: true,
            greaterThan: function(){
                if ($('#end_date').val() != "") {
                    return "#start_date";
                } else {
                    return false;
                }
            },
            timeDifferenceValid: function(){
                if ($('#auction_type').val() == 2) {
                    return "#start_date";
                } else {
                    return false;
                }
            },
        },
        is_featured:{
            required: true,
        },
        full_amount: {
            required: function() {
                return $("#sell_at_full_amount_status").is(":checked");
            },
            number: {
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            min: {
                param: 1,
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        bid_increment_status:{
            required: true,
        },
        
        bid_increments: {
            required: true,
            number: {
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            min: {
                param: 1,
                depends: function(element) {
                    return $(element).val() !== "";  // Only validate if not empty
                }
            },
            normalizer: function (value) {
                return value.replace(/,/g, ''); // remove commas before validation
            }
        },
        // bid_increments:{
        //     required: function(){
        //         return $("#bid_increment_status").is(":checked");
        //     },
        // },
        signature:{
            required: true,
        },
        term_agreement:{
            required: true,
        }
    };
    
}
