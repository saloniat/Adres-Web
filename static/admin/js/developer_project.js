var currpage = 1;
var recordPerpage = 10;
$(document).ready(function(){
    $('.convert_to_local_date_time_cst').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDateFromUTC(added_on.trim(), 'mm-dd-yyyy','ampm');
                $(this).html(local_date);
            }else{
                $(this).html('-');
            }
        }catch(ex){
            //console.log(ex);
        }
    });

    $(document).on("click","#del_prop_false",function() {
        $('#confirmPropertyDeleteModal').modal('hide');
    });
    $.validator.setDefaults({ ignore: ":hidden:not(select)" })
    try{
        CKEDITOR.env.isCompatible = true;
    }catch(ex){
        console.log("cked: "+ex);
    }

    try{
        CKEDITOR.on( 'instanceReady', function(e) {
            $('iframe', e.editor.container.$).contents().on('click', function() {
                e.editor.focus();
            });
        });
    }catch(ex){
        //console.log(ex);
    }

    init_auction_start_date();
    init_auction_end_date();

    $('#project_info_frm #starting_price').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "" || value == ""){
                return "";
            }else{
                return '' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });
    });

    $('#datetimepicker1').on('dp.change',function(e){
        var virtual_date_element = $(this).find('input:first').attr('id');
        var date_element = $(this).find('input:last').attr('id');
        var dates = $("#"+virtual_date_element).val();
        if(dates != ""){
            var actualStartDate = dates.split(" ");
            //new lines
            var mdy_format = actualStartDate[0].split("-");

            mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
            actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);


            //var utc_date = convert_to_utc_datetime(actualStartDate);
            var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
            $("#"+date_element+"_local").val(actualStartDate);
            $("#"+date_element).val(utc_date);
            try{
                // $('#virtual_bidding_end_date').val('');
                // $('#bidding_end_date_local').val('');
                // $('#bidding_end_date').val('');
                var new_date = actualStartDate.split(" ");

                var newStartDate = new_date[0];

                var new_min_date = new Date(actualStartDate);
                var new_max_date = new Date(newStartDate+' 23:59:59');
                //live_min_max_date(new_min_date, new_max_date);


            }catch(ex){
                //console.log(ex);
            }
        }
    });

    add_icon_dropdown_new_feature();

    // cst_convert_bidding_date('registration_date');
    // cst_convert_bidding_date('completion_date');
    convert_date('registration_date');
    convert_date('completion_date');

    // Assuming multiple Dropzones with IDs like 'uploadFloorPlanImgFrm_1', 'uploadFloorPlanImgFrm_2', etc.
    document.querySelectorAll('.dropzone').forEach((dropzoneElement) => {
        const elementId = dropzoneElement.id;
        if (!elementId.startsWith('uploadFloorPlanImgFrm')) return
        floor_plan_image_params = {
            url: '/admin/save-images/',
            field_name: 'floor_plan_image',
            file_accepted: '.png, .jpg, .jpeg',
            element: elementId,
            upload_multiple: false,
            max_files: 1,
            call_function: function (response) {
                set_floor_plan_details(response, elementId);
            }
        }
        try{
            initdrozone(floor_plan_image_params);
        }catch(ex){
            //console.log(ex);
        }
    });

    facility_image_params = {
        url: '/admin/save-images/',
        field_name: 'facility_image',
        file_accepted: '.png, .jpg, .jpeg',
        element: 'uploadFacilityImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_facility_details
    }
    try{
        initdrozone(facility_image_params);
    }catch(ex){
        //console.log(ex);
    }

    project_image_params = {
        url: '/admin/save-images/',
        field_name: 'developer_project_image',
        file_accepted: '.png, .jpg, .jpeg',
        element: 'projectImageFrm',
        upload_multiple: true,
        call_function: set_project_image_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
    }
    try{
        initdrozone(project_image_params);
    }catch(ex){
        //console.log(ex);
    }
    project_doc_params = {
        url: '/admin/save-images/',
        field_name: 'developer_project_document',
        file_accepted: '.pdf',
        element: 'projectDocFrm',
        upload_multiple: true,
        call_function: set_project_doc_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
    }
    try{
        initdrozone(project_doc_params);
    }catch(ex){
        //console.log(ex);
    }

    $(document).on('click', '.display_status', function(){
        $(this).next().show();
        $(this).hide();
    });

    $(document).on('click', '.approval_status', function(){
        $(this).next().show();
        $(this).hide();
    });

    $(document).on('change', '#city', function(){
        var city = $(this).val();
        $.ajax({
            url: '/admin/get-municipality/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {prop_city: city},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    $('#municipality').empty();
                    $('#district').empty();
                    $('#municipality').append('<option value="">Select</option>');
                    $.each(response.municipality, function(i, item) {
                        $('#municipality').append('<option value="'+item.id+'">'+item.municipality_name+'</option>');
                    });
                    $('#municipality').trigger("chosen:updated");
                    // -------Enable next section-------
                    var href = $("#section_two").data('href');
                    $("#section_two").attr('href', "#"+href);
                    $("#section_two").removeClass('collapsed');
                    $("#"+href).removeClass('collapse').addClass("in");
                }
            }
        });
    });

    $(document).on('change', '#municipality', function(){
        var municipality = $(this).val();
        $.ajax({
            url: '/admin/get-district/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {municipality: municipality},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    $('#district').empty();
                    $('#district').append('<option value="">Select</option>');
                    $.each(response.district, function(i, item) {
                        $('#district').append('<option value="'+item.id+'">'+item.district_name+'</option>');
                    });
                    $('#district').trigger("chosen:updated");
                }
            }
        });
    });

    $(document).on('change', '#district', function(){
        var district = $(this).val();
        var prop_city = $("#city").val();
        if (prop_city != 83){
            $(".community_text").show();
            $('.community_dropdown').hide();
            return false;
        }

        $.ajax({
            url: '/admin/get-community/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {district},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                
                if(response.error == 0){
                    $(".community_text").hide();
                    $('.community_dropdown').show();
                    $('#community_data').empty();
                    $('#community_data').append('<option value="">Select</option>');
                    $.each(response.community, function(i, item) {
                        $('#community_data').append('<option value="'+item.community_name+'">'+item.community_name+'</option>');
                    });
                    $('#community_data').trigger("chosen:updated");
                }
            }
        });
    });

    $(document).on('click', 'input[name="project_type"]', function(){
        var asset_id = $(this).val();
        $('p.error').hide();
        $.ajax({
            url: '/admin/get-project-info-data/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {asset_id: asset_id},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    $('#project_type').empty();
                    $('#project_type').append('<option value="">Select</option>');
                    $.each(response.project_type_listing, function(i, item) {
                        $('#project_type').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#project_type').trigger("chosen:updated");
                }else{
                }
            }
        });
    });

    $('#project_info_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            project_type:{required: true},
            project_type:{
                required: function () {
                    if ($('option:selected','#project_type').val() == "") {
                        $("#project_type").parent().append('<p id="property_type-error" class="error">Property Type is required</p>');
                    } else {
                        return false
                    }
                }
            },
            project_name:{
                required: true,
                atLeastOneAlpha: true,
            },
            project_name_ar:{
                required: true,
                // atLeastOneAlpha: true,
            },
            registration_number:{required: true},
            country:{
                required: function () {
                    if ($('option:selected','#country').val() == "" || typeof($('option:selected','#country').val())  === "undefined") {
                        $("#country").parent().append('<p id="country-error" class="error">Country is required</p>');
                    } else {
                        return false
                    }
                }
            },
            city:{required: true},
            municipality:{required: true},
            district:{ required: true},
            neighborhood:{
                required: function(){
                    if($("#city").val() != '83'){
                        return true;
                    }else{
                        return false;
                    }
                },
                atLeastOneAlpha: function(){
                    if($("#city").val() != '83'){
                        return true;
                    }else{
                        return false;
                    }
                },
            },
            community:{
                required: function(){
                    if($("#city").val() != '83'){
                        return true;
                    }else{
                        return false;
                    }
                },
                atLeastOneAlpha: function(){
                    if($("#city").val() != '83'){
                        return true;
                    }else{
                        return false;
                    }
                },
            },
            community_data:{
                required: function(){
                    if($("#city").val() == '83'){
                        return true;
                    }else{
                        return false;
                    }
                },
            },
            // postal_code: {required: true},
            address_one:{
                required: true,
                atLeastOneAlpha: true,
            },
            virtual_registration_date :{required: true},
            virtual_completion_date:{required: true},
            starting_price:{required: true},
            project_status:{
                required: function () {
                    if ($('option:selected','#project_status').val() == "" || typeof($('option:selected','#project_status').val())  === "undefined") {
                        $("#project_status").parent().append('<p id="project_status-error" class="error">Project Construction Status is required</p>');
                    } else {
                        return false
                    }
                }
            },

            main_project_status:{
                required: function () {
                    if ($('option:selected','#main_project_status').val() == "" || typeof($('option:selected','#main_project_status').val())  === "undefined") {
                        $("#main_project_status").parent().append('<p id="main_project_status-error" class="error">Project Status is required</p>');
                    } else {
                        return false
                    }
                }
            },

            // total_units:{
            //     required: true,
            //     min: function(){
            //         if($("#units_for_sale").val() != ""){
            //             return $("#units_for_sale").val();
            //         }
            //     },
            // },
            // units_for_sale:{
            //     required: true,
            //     max: function(){
            //         if($("#total_units").val() != ""){
            //             return $("#total_units").val();
            //         }
            //     },
            // },
            total_units: {
                required: true,
                min: function() {
                    var sale = parseInt($("#units_for_sale").val(), 10);
                    return isNaN(sale) ? 0 : sale;
                }
            },
            units_for_sale: {
                required: true,
                max: function() {
                    var total = parseInt($("#total_units").val(), 10);
                    return isNaN(total) ? Infinity : total;
                }
            },
            units_type:{
                required: true,
                atLeastOneAlpha: true,
            },
            property_size:{required: true},
        },
        messages:{
            project_type:{required: "Project type is required"},
            project_name:{required: "Project Name is required"},
            registration_number:{required: "Registration Number is required"},
            neighborhood:{required: "Neighborhood is required"},
            municipality:{required: "Municipality is required"},
            district:{ required: "District is required"},
            community:{required: "Community is required"},
            community_data:{required: "Community is required"},
            address_one:{
                required: "Address is required"
            },
            city:{required: "City is required"},
            // postal_code:{required: "Postal Code is required"},
            virtual_registration_date:{required: "Registration Date is required"},
            virtual_completion_date: {required: "Completion/Handover Date is required"},
            starting_price:{required: "Starting Price is required"},
            total_units:{required: "Total Units is required"},
            units_for_sale:{required: "Unit for Sale is required"},
            units_type:{required: "Unit type is required"},
            property_size:{required: "Property Size is required"},
        },
        errorPlacement: function(error, element) {
            var range_input_arr = ['price_decrease_rate', 'dutch_auction_time', 'dutch_pause_time', 'sealed_auction_time', 'english_auction_time', 'sealed_pause_time'];
            if(element.hasClass('select')){
                error.insertAfter(element.next('.chosen-container'));
            }else if(element.parent().hasClass('date')){
                error.insertAfter(element.parent());
            }else if(jQuery.inArray(element.attr('name'), range_input_arr) !== -1){
                error.insertAfter(element.closest('.range-slide'));
            }else{
                error.insertAfter(element);
            }
        },
        invalidHandler: function(e,validator) {
            console.log(validator.errorList);
        }
    });

    $('#project_map_view_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            /*map_url:{
                required: true
            }*/
        },
        messages:{
            /*map_url:{
                required: "Map Url is required"
            }*/
        }
    });
    $("#project_info_frm").validate();
    $("#project_map_view_frm").validate();
    // $("#project_photo_video_frm").validate();
    $('#project_photo_video_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            project_image_id:{
                required: true,
            },
        },
        messages:{
            
        }
    });

    $('#facility_info_submit_btn').on('click', function() {
        $('.error').text('');
        $('#response').text('');
        csrf_token = $('input[name="csrfmiddlewaretoken"]').val();

        // Get input field values
        const facility_name = $('#facility_name').val();
        const facility_img_id = $('#facility_img_id').val() ? $('#facility_img_id').val() : "";
        const project_id = $('#project_id').val();

        let isValid = true;

        // Validate Name
        if (facility_name.trim() === '') {
            $('#facility_name-error').text('Facility name is required');
            isValid = false;
        }else{
            $('#facility_name-error').text('');

        }

        if (facility_img_id === '') {
            $('#facility_image_error').text('Facility icon is required');
            $('#facility_image_error').show();
            isValid = false;
        }else{
            $('#facility_image_error').hide();
        }

        if(isValid){
            $.ajax({
                url: '/admin/save-facility/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {facility_name,facility_img_id, project_id, 'csrfmiddlewaretoken': csrf_token},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $.growl.notice({title: "Project ", message: response.msg, size: 'large'});
                        try{
                        }catch(ex){
                            var project_id = '';
                        }
                        window.setTimeout(function () {
                            if(response.data.data.project_id) window.location.href = '/admin/add-project-info/?project_id='+response.data.data.project_id;
                            else window.location.href = '/admin/add-project-info/';
                        }, 2000);
                    }else{
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
                            $.growl.error({title: "Project ", message: custom_msg, size: 'large'});
                        }, 2000);
                    }
                }
            });
        }
    })

    $(document).on('click', '#project_info_submit_next_btn', function(){
            console.log("project_info_submit_next_btn enter")
            $('#next_url').val('/admin/project-map-view/');
            try {
                var start_dates = $("#virtual_registration_date").val();
                var end_dates = $("#virtual_completion_date").val();
                // if (start_dates != "") {
                //     var actualStartDate = start_dates.split(" ");
                //     var change_format = actualStartDate[0].split("-");
                //     var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                //     actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                //     var actualStartDateUtc = actualStartDate;
                //     $("#registration_date").val(actualStartDateUtc);
                //     $("#registration_date_local").val(actualStartDate);
                // }else{
                //     $("#virtual_registration_date").val('');
                //     $("#registration_date").val('');
                //     $("#registration_date_local").val('');
                // }
                // if (end_dates != "") {
                //     var actualEndDate = end_dates.split(" ");
                //     var change_format = actualEndDate[0].split("-");
                //     var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                //     actualEndDate = new_format + ' ' + convert_to_24h(actualEndDate[1] + ' ' + actualEndDate[2]);
                //     var actualEndDateUtc = actualEndDate;
                //     $("#completion_date").val(actualEndDateUtc);
                //     $("#completion_date_local").val(actualEndDate);
                // }

            } catch (ex){
                    //console.log(ex);
            }

            // if($('#project_info_frm').valid() && $("#proj_listing_status").val() != "" ){
            if($('#project_info_frm').valid() && $("#project_status").val() != "" && $("#main_project_status").val() != "" ){
                if (parseInt($('input[name="project_type"]:checked').val()) != "") {
                    if($("#project_type").val() != "" && $("#state").val() != ""){
                        save_project('project_info_frm');
                    }
                } else {
                    save_project('project_info_frm');
                }
            } else{
                return false;
                // console.log("project_info_submit_next_btn")
            }
    });

    $(document).on('click', '#project_info_submit_exit_btn', function(){
        console.log("project_info_submit_exit_btn enter")
        $('#next_url').val('/admin/project-list/');
        if($('#project_info_frm').valid()){
            if($("#project_type").val() != "" && $("#city").val() != "" && $("#project_status").val() != "" ){
                save_project('project_info_frm');
            }
        } else{
        console.log("project_info_submit_exit_btn")
        }
    });

    $(document).on('click', '#project_map_submit_next_btn', function(){
        $('#project_map_view_frm').validate();
        $('#next_url').val('/admin/project-photo-video/');
        if($('#project_map_view_frm').valid()){
            save_project('project_map_view_frm');
        }
    });

    $(document).on('click', '#project_map_submit_exit_btn', function(){
        $('#next_url').val('/admin/project-list/');
        if($('#project_map_view_frm').valid()){
            save_project('project_map_view_frm');
        }
    });

    $(document).on('click', '#project_image_submit_next_btn', function(){
        $('#next_url').val('/admin/project-document-floor-plan/');
        if($('#project_photo_video_frm').valid()){
            save_project('project_photo_video_frm');
        }
    });

    $(document).on('click', '#project_image_submit_exit_btn', function(){
        $('#next_url').val('/admin/listing/');
        if($('#project_photo_video_frm').valid()){
            save_project('project_photo_video_frm');
        }
    });

    $(document).on('click', '#submit_project', function(e){
        let isFormValid = true;
        // $(".section").each(function () {
        //     if (!validateSection(this)) {
        //         isFormValid = false;
        //     }
        // });
        if (!isFormValid) {
            e.preventDefault();
        } else {
            // if($('#project_document_frm').valid()){
            //     save_project('project_document_frm');
            // }
            save_project('project_document_frm');
        }
    });

    $(document).on('click', '#addVideoBtn', function(){
        var upload_id = '';
        var actual_id = '';
        var upload_name = '';
        var actual_name = '';
        var project_id = $('#project_id').val();
        var video_url = $('#project_video_url').val();
        if(video_url != ""){
            $.ajax({
                url: '/admin/save-project-video/',
                type: 'post',
                headers: { 'X-CSRFToken': getCookie('csrftoken') }, 
                dataType: 'json',
                cache: false,
                data: {project_id: project_id, video_url: video_url},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $.growl.notice({title: "Video ", message: "Video saved successfully.", size: 'large'});
                        var video_url = $('#pproject_video_url').val('');
                        var project_video_id = $('#project_video_id').val();
                        var project_video_name = $('#project_video_name').val();
                        if(response.data.upload_id){
                            upload_id = response.data.upload_id.toString();
                            $('#projectVideoList').append('<li rel_id="'+upload_id+'"><a href="javascript:void(0)" data-article-id="'+project_id+'" data-image-id="'+upload_id+'" data-image-name="'+response.video_url+'" data-image-section="project_video" class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><iframe width="190" height="126" src="'+response.video_url+'" frameborder="0" allowfullscreen></iframe></iframe></li>');
                            upload_id = upload_id+','+project_video_id;
                            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                            upload_name = response.video_url+','+project_video_name;
                            actual_name = upload_name.replace(/(^,)|(,$)/g, "");
                            $('#project_video_id').val(actual_id);
                            $('#project_video_name').val(actual_name);
                            $('#projectVideoList').show();
                            $('#ProjectVideoDiv').show();
                        }
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "Video ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                }
            });
        }
    });

    $(document).on('click','.selectallSection',function(){
        var element_id = $(this).closest('.chosen-container').siblings('select').attr('id');
        $('#'+element_id+' option[value="0"]').prop('selected', false);
        $('#'+element_id).trigger("chosen:updated");
    });

    $(document).on('keyup', '#postal_code', function(){
        postal_code = $(this).val();
        country_code = $("#country").find(':selected').data('short-code');
        country_id = $("#country").val();
        if(postal_code.length > 4 && country_id == 4){
            params = {
                'zip_code': postal_code,
                'call_function': set_project_address_by_zipcode,
            }
            get_address_by_zipcode(params);
        }
    });

    $(document).on('keyup', '#prop_search', function(e){
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }else{
            var search = $(this).val();
            $.ajax({
                url: '/admin/listing-search-suggestion/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {'search': search},
                beforeSend: function(){
                },
                success: function(response){
                    if(response.error == 0 && response.status == 200){
                        autocomplete("prop_search", response.suggestion_list);
                    }else{
                        closeAllSuggestions('autocomplete-items');
                    }
                }
            });
        }
    });
});

function save_project(element){
    for (instance in CKEDITOR.instances){
        CKEDITOR.instances[instance].updateElement();
    }
    $.ajax({
        url: '/admin/save-project/',
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
                let message = ""
                if (parseInt(response.step) ==1){
                    message = "Project Information saved successfully.";
                }else if(parseInt(response.step) == 2){
                    message = "Map location saved successfully.";
                }else if(parseInt(response.step) == 3){
                    message = "Photos uploaded successfully.";
                }else if(parseInt(response.step) == 4){
                    message = "Documents saved successfully.";
                }
                // $.growl.notice({title: "Project ", message: response.msg, size: 'large'});
                $.growl.notice({title: "Project ", message: message, size: 'large'});
                try{
                    var project_id = response.data.data.project_id;
                }catch(ex){
                    var project_id = '';
                }

                if(response.project_id == ""){
                    custom_response = {
                        // 'user_id': response.data.data.user_id,
                        'user_id': encryptUserId(String(response.data.data.user_id), encryptionKey),
                    };
                    customCallBackFunc(update_notification_socket, [custom_response]);
                }    
                window.setTimeout(function () {
                    if(response.next_url != '/admin/project-list/' && response.next_url != ''){
                        window.location.href = response.next_url+'?project_id='+response.data.data.project_id;
                    }else{
                        window.location.href = '/admin/project-list/';
                    }
                }, 2000);
                
            }else{
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
                    $.growl.error({title: "Project ", message: custom_msg, size: 'large'});
                }, 2000);
            }
        }
    });
}

function set_facility_details(response){

    if(response.status == 200){
        var image_name = '';
        var actual_image = '';
        var upload_id = '';
        var actual_id = '';
        var upload_to = '';
        $('#facility_image_error').hide();
        if(response.uploaded_file_list){
            $.each(response.uploaded_file_list, function(i, item) {
                if(i==0){
                    if(item.file_name != ""){
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                }else{
                    if(item.file_name != ""){
                        image_name = image_name+','+item.file_name;
                        upload_id = upload_id+','+item.upload_id;
                    }
                }
                upload_to = item.upload_to;

            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#facility_img_name').val(actual_image);
            $('#facility_img_id').val(actual_id);
            if(actual_image){
                var testi_img = azure_blob_url+"facility_icon/"+actual_image;
                $('#facilityImageId').attr('src', testi_img);
                $('#facilityImageDiv').show();
            }
            $('#facilityImageDiv .facility-section a').attr({ 'data-image-id': $('#facility_img_id').val(), 'data-image-name':$('#facility_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}

function set_floor_plan_details(response, elementId, add_more=""){
    if(response.status == 200){
        var image_name = '';
        var actual_image = '';
        var upload_id = '';
        var actual_id = '';
        var upload_to = '';
        $('#floor_plan_image_error').hide();
        if(response.uploaded_file_list){
            $.each(response.uploaded_file_list, function(i, item) {
                if(i==0){
                    if(item.file_name != ""){
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                }else{
                    if(item.file_name != ""){
                        image_name = image_name+','+item.file_name;
                        upload_id = upload_id+','+item.upload_id;
                    }
                }
                upload_to = item.upload_to;

            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            let splitElementId = (elementId.split('_')[1])
            $('#floor_plan_img_name_'+splitElementId).val(actual_image);
            $('#floor_plan_img_id_'+splitElementId).val(actual_id);
            if(actual_image){
                var testi_img = azure_blob_url+"floor_plans/"+actual_image;
                $('#floorPlanImageId_'+ splitElementId).attr('src', testi_img);
                $('#floorPlanImageDiv_'+ splitElementId).show();
            }
            var project_id = $("#project_id").val();
            // console.log(project_id);
            var cnt = $(".section").length;
            var ref = cnt+project_id;
            // $('#floorPlanImageDiv_' + splitElementId + ' .floor-plan-section a').attr({ 'data-image-id': $('#floor_plan_img_id'+splitElementId).val(), 'data-image-name':$('#floor_plan_img_name').val(), 'data-image-section': upload_to, 'data-count': '' , 'data-ref': ref}).addClass('confirm_image_delete');
            // floorPlanImageDiv_inter25
            if (add_more == "add_more"){
                $('#floorPlanImageDiv_' + splitElementId + ' .floor-plan-section a').attr({ 'data-image-id': actual_id, 'data-image-name': actual_image, 'data-image-section': upload_to, 'data-count': '', 'data-ref': splitElementId}).addClass('confirm_image_delete');
            }else{
                $('#floorPlanImageDiv_' + splitElementId + ' .floor-plan-section a').attr({ 'data-image-id': actual_id, 'data-image-name': actual_image, 'data-image-section': upload_to, 'data-count': '', 'data-ref': splitElementId.slice(-2)}).addClass('confirm_image_delete');
            }
        }
    }
}

function set_project_image_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var project_image_id = $('#project_image_id').val();
    var project_image_name = $('#project_image_name').val();
    var project_id = $('#project_id').val();
    var count = parseInt($('#bannerImgList li').length);
    if(response.status == 200){
        $('#custom_property_image_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var j = 0
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                // var j = parseInt(j) + 1;
                // console.log(j);
                var image_count = parseInt($("#projectImgList li").length) + 1;
                if(i==0){
                    if(item.file_name != ""){
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                }else{
                    if(item.file_name != ""){
                        image_name = image_name+','+item.file_name;
                        upload_id = upload_id+','+item.upload_id;
                    }
                }
                if(item.file_name != ""){
                    var img_src = azure_blob_url+"developer_project_image/"+item.file_name;
                }
                if(item.upload_date){
                    try{
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();
                        var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs)?hrs:12;
                        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                        timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;
                    }catch(ex){
                        //console.log(ex);
                        var timeStp = '';
                    }
                }
                $('#projectImgList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+project_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><textarea style="display: none" id="photo_description_'+image_count+'" name="photo_description_'+image_count+'" rows="4" cols="20">Photo Description</textarea><div style="display: none" class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
            });
            image_name = image_name+','+project_image_name;
            upload_id = upload_id+','+project_image_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#project_image_name').val(actual_image);
            $('#project_image_id').val(actual_id);
            $('#PropertyImgDiv').show();
            reindex_prop_img_list();
        }
    }
}

function set_project_doc_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var project_doc_id = $('#project_doc_id').val();
    var project_doc_name = $('#project_doc_name').val();
    var project_id = $('#project_id').val();
    if(response.status == 200){
        $('#custom_project_doc_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var count = parseInt($('#bannerImgList li').length);
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                if(i==0){
                    if(item.file_name != ""){
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                }else{
                    if(item.file_name != ""){
                        image_name = image_name+','+item.file_name;
                        upload_id = upload_id+','+item.upload_id;
                    }
                }
                if(item.file_name != ""){
                    var img_src = azure_blob_url+"project_document/"+item.file_name;
                }
                if(item.upload_date){
                    try{
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();
                        var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs)?hrs:12;
                        timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;
                    }catch(ex){
                        //console.log(ex);
                        var timeStp = '';
                    }
                }
                $('#projectDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure><a href="javascript:void(0)" data-article-id="'+project_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="/static/admin/images/pdf.png" alt=""></figure><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
            });
            image_name = image_name+','+project_doc_name;
            upload_id = upload_id+','+project_doc_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#project_doc_name').val(actual_image);
            $('#project_doc_id').val(actual_id);
            $('#ProjectDocDiv').show();
            reindex_prop_doc_list();
        }
    }
}

function add_icon_dropdown_new_feature(){
    $('.new_feature_dropdown').each(function() {
        var el_id = '#'+$(this).attr('id');
        $(el_id).on('chosen:showing_dropdown', function(e){
            $(this).next().find('li.active-result:contains(Add New Feature)').html('<i class="fa fa-plus" aria-hidden="true"></i> Add New Feature');
        });
    });
}

function set_project_address_by_zipcode(response){
    $('#city').val(response.city);
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }
    $("#state > option").each(function() {
        try{
            var state_iso_code = $(this).attr('data-short-code').toLowerCase();
        }catch(ex){
            //console.log(ex);
            var state_iso_code = '';
        }
        if(state_iso_code == zip_state_iso_code){
            $(this).prop('selected',true);
        }
    });
    $('#state').trigger("chosen:updated");
}

function project_delete_confirmation(project_id){
    $('.personalModalwrap').modal('hide');
    $('#confirmPropertyDeleteModal').modal('show');
    $('.del_prop_btn').attr('rel_id', project_id);
}

function projectListingSearch(current_page){
    var search = $('#proj_search').val();
    var currpage = current_page;
    if($('#proj_num_record').val() != ""){
        recordPerpage = $('option:selected','#proj_num_record').val();
    }
    var proj_filter_status = $('option:selected','#proj_filter_status').val();
    var project_type = $('option:selected','#filter_project_type').val();
    var developer = $('option:selected','#filter_developer').val();
    var employee_id = $('option:selected','#filter_employee').val();
    var proj_status = $('option:selected','#proj_status').val();

    try{
        var uri = window.location.href.toString();
        if (uri.indexOf("?") > 0) {
            var clean_uri = uri.substring(0, uri.indexOf("?"));
            window.history.replaceState({}, document.title, clean_uri);
        }
    }catch(ex){
        //console.log(ex);
    }

    $.ajax({
        url: '/admin/project-list/',
        type: 'post',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        dataType: 'json',
        cache: false,
        data: {search: search, perpage: recordPerpage, status: proj_status, page: currpage, project_type: project_type, developer: developer, project_status: proj_filter_status, employee_id: employee_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                if($('#proj_num_record').val() != ""){
                    recordPerpage = $('#proj_num_record').val();
                }
                $('#tbl_project_list').empty();
                $('#tbl_project_list').html(response.project_listing_html);
                $("#tbl_project_list").find('script').remove();
                $("#proj_listing_pagination_list").html(response.pagination_html);
                $("#counter_num").val(response.sno);
                    // $("#download_btn_section").html('<a href="/admin/add-project-info/" class="btn btn-primary btn-xs"><i class="fas fa-plus"></i> Add New Project</a>');
            }else{
                $('#tbl_project_list').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
            }
            $(window).scrollTop(0);
            $("#tbl_project_list").find('script').remove();
        }
    });
}

function delete_project(){
    var row_id = $('#del_prop_true').attr('rel_id');
    if(row_id != ""){
        var search = $('#prop_search').val();
        if($('#prop_num_record').val() != ""){
            recordPerpage = $('#prop_num_record').val();
        }
        var status = $('#prop_filter_status').val();
        var project_type = $('#filter_project_type').val();
        $.ajax({
            url: '/admin/delete-project/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {project_id: row_id},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    $('#del_prop_true').removeAttr('rel_id');
                    $('#del_prop_false').removeAttr('rel_id');
                    $('#confirmPropertyDeleteModal').modal('hide');
                    $('#project_list #row_id_'+row_id).remove();
                    $.growl.notice({title: "Property ", message: response.msg, size: 'large'});
                    //window.location.href = '/admin/project-list/';

                }else{
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


$(function(){
    try{

        $("#project_list").sortable({
            start: function (event, ui) {
                //console.log('start');
            },
            stop: function(event, ui) {
                var total_length = $('div.block-item').length;
                if(total_length && parseInt(total_length) > 3){
                    var first_row = parseInt(total_length) -1;
                    var second_row = parseInt(total_length);
                }else{
                    var first_row = 0;
                    var second_row = 0;
                }
                var arr = [];
                var project='';
                var index = '';
                var count = parseInt($("#counter_num").val());
                var new_counter = 1;
                $.map($(this).find('div.block-item'), function(el) {
                    if(first_row > 0 && second_row > 0){
                        if(new_counter == first_row || new_counter == second_row){
                            $(el).addClass('last-row');
                            $(el).find('.action_dropdown').addClass('dropup');
                        }else{
                            $(el).removeClass('last-row');
                            $(el).find('.action_dropdown').removeClass('dropup');
                        }
                    }
                    //$(el).data('project') + ' = ' + $(el).index() + ' = ' + $(el).data('index');
                    project = $(el).data('project');
                    index = count;//$(el).index() + 1;
                    var new_obj = {'project_id': project, 'reorder_id': index};
                    arr.push(new_obj);
                    $(".srNum:eq("+$(el).index()+")").text(count);
                    count++;
                    new_counter++;
                });
                var data = {"reorder": JSON.stringify(arr)}
                $.ajax({
                    url: '/admin/project-listing-ordering/',
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    beforeSend: function(){
                        //$('.overlay').show();
                    },
                    success: function(response){
                        if(response.error == 0){
                            //console.log(response.msg);
                        }else{
                            //console.log(response.msg);
                        }
                    }
                });
            },
            change: function(event, ui) {
                //console.log('change');
                //console.log(ui);
            }
        });
    }catch(ex){
        //console.log(ex);
    }
});

function min_max_date(min_date, max_date, index){
    var new_min_date = min_date;
    var new_max_date = max_date;


    $('#add_more_open_house_date_'+index).find('.open_house_end').datetimepicker('remove');
    $('#add_more_open_house_date_'+index).find('.open_house_end').datetimepicker('destroy');

    $('#add_more_open_house_date_'+index).find('.open_house_end').datetimepicker('update', '');

    try{
        $('#add_more_open_house_date_'+index).find('.open_house_end').data("DateTimePicker").maxDate(new_max_date);
        $('#add_more_open_house_date_'+index).find('.open_house_end').data("DateTimePicker").minDate(new_min_date);
    }catch(ex){
        $('#add_more_open_house_date_'+index).find('.open_house_end').data("DateTimePicker").minDate(new_min_date);
        $('#add_more_open_house_date_'+index).find('.open_house_end').data("DateTimePicker").maxDate(new_max_date);

    }



}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 47 || charCode > 57)) {
        return false;
    }
    return true;
}

function init_auction_start_date(){
    try{
        $('#datetimepicker1').datetimepicker({
            // format: 'MM-DD-YYYY hh:mm A',
            format: 'MM-DD-YYYY',
        });
    }catch(ex){
    }
}

function init_auction_end_date(){
    var new_min_date = '';
    var new_max_date = '';
    var count_index = '';
    var virtual_dates = $("#datetimepicker2").attr('data-value');

    if(virtual_dates){
        var new_virtual_date = getLocalDate(virtual_dates, 'mm-dd-yyyy','ampm');
        var actualStartDate = new_virtual_date.split(" ");
        //new lines
        var mdy_format = actualStartDate[0].split("-");

        new_min_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
        new_max_date = new_min_date+' 23:59:59';
    }

    if(new_min_date != "" && new_max_date != ""){
        try{
            $("#datetimepicker2").datetimepicker({
                // format: 'MM-DD-YYYY hh:mm A',
                format: 'MM-DD-YYYY',
                //   maxDate: new_max_date,
                //   minDate: new_min_date,
            }).on('dp.change',function(e){
                var virtual_date_element = $(this).find('input:first').attr('id');
                var date_element = $(this).find('input:last').attr('id');
                var dates = $("#"+virtual_date_element).val();
                if(dates != ""){
                    var actualStartDate = dates.split(" ");
                    var actualDate = actualStartDate
                    //new lines
                    var mdy_format = actualStartDate[0].split("-");
                    mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

                    var newactualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                    actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

                    var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    // $("#"+date_element+"_local").val(actualStartDate);
                    // $("#"+date_element).val(utc_date);

                    // var actualDate = convert_to_date_format(actualStartDate);
                    actualDate = convert_to_date_format(actualDate);
                    $("#"+date_element+"_local").val(actualDate);
                    $("#"+date_element).val(actualDate);
                }
            });
        }catch(ex){

        }

    }else{
        try{
            $('#datetimepicker2').datetimepicker({
                // format: 'MM-DD-YYYY hh:mm A',
                format: 'MM-DD-YYYY',
            }).on('dp.change',function(e){
                var virtual_date_element = $(this).find('input:first').attr('id');
                var date_element = $(this).find('input:last').attr('id');
                var dates = $("#"+virtual_date_element).val();
                if(dates != ""){
                    var actualStartDate = dates.split(" ");
                    //new lines
                    var mdy_format = actualStartDate[0].split("-");
                    mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                    //actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                    var newactualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                    actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

                    var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    $("#"+date_element+"_local").val(actualStartDate);
                    $("#"+date_element).val(utc_date);
                }
            });
        }catch(ex){

        }
    }
}

function show_input_slider(x) {
    $("#price_decrease_rate_value").html(x+' %');
}

function add_slider_value(el) {
    var el_id = $(el).attr('data-id');
    var el_max = parseInt($(el).attr('data-max'));
    var el_val = 0;
    if($("#"+el_id).val() != ""){
        el_val = parseInt($("#"+el_id).val());
    }
    if(el_val < el_max){
        el_val = el_val + 1;
        $("#"+el_id).val(el_val);
        if(el_id == 'price_decrease_rate'){
            $("#"+el_id+"_value").html(el_val+' %');
            if($('#insider_start_price').val() != "" && $('#insider_start_price').val() != ""){
                var start_price = parseFloat($('#insider_start_price').val().replace('','').replace(/,/g, ''));
                var decrease_rate = parseFloat($('#price_decrease_rate').val());
                var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                decrease_value = decrease_value.toFixed(2);
                if(decrease_value > parseInt(decrease_value)){
                    decrease_value = numberFormat(decrease_value);
                }else{
                    decrease_value = numberFormat(parseInt(decrease_value));
                }
                $('#price_decrease_value').html('$'+decrease_value);
            }
        }else{
            $("#"+el_id+"_value").html(el_val+' Min');
            if($('#virtual_dutch_bidding_start_date').val() != ""){
                convert_insider_auction_date();
            }
        }
    }
}

function subtract_slider_value(el) {
    var el_id = $(el).attr('data-id');
    var el_val = 0;
    if($("#"+el_id).val() != ""){
        var el_val = parseInt($("#"+el_id).val());
    }
    if(el_val > 0){
        el_val = el_val - 1;
        $("#"+el_id).val(el_val);
        if(el_id == 'price_decrease_rate'){
            $("#"+el_id+"_value").html(el_val+' %');
            if($('#insider_start_price').val() != "" && $('#insider_start_price').val() != "$"){
                var start_price = parseFloat($('#insider_start_price').val().replace('$','').replace(/,/g, ''));
                var decrease_rate = parseFloat($('#price_decrease_rate').val());
                var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                decrease_value = decrease_value.toFixed(2);
                if(decrease_value > parseInt(decrease_value)){
                    decrease_value = numberFormat(decrease_value);
                }else{
                    decrease_value = numberFormat(parseInt(decrease_value));
                }
                $('#price_decrease_value').html('$'+decrease_value);
            }
        }else{
            $("#"+el_id+"_value").html(el_val+' Min');
            if($('#virtual_dutch_bidding_start_date').val() != ""){
                convert_insider_auction_date();
            }

        }
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

function state_list_update(){
    country_id = $("#country").val();
    csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    if (country_id){
        $.ajax({
            url: '/admin/state-list/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: {country_id: country_id, 'csrfmiddlewaretoken': csrf_token},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    state_lists = response.state_lists;
                    var option_html = "";
                    $('#city').empty();
                    $('#city').append("<option value=''>Select</option>");
                    $.each( state_lists, function( key, value ) {
                        $('#state').append("<option value="+value.id+" data-short-code="+value.iso_name+">"+value.state_name+"</option>");
                    });
                    $('#state').trigger("chosen:updated");
                }

            }
        });
    }else{
        $('#state').empty().append("<option value=''>Select</option>");
        $('#state').trigger("chosen:updated");
    }

}

$("#project_country").change(function(){
    $("#state").empty().append("<option value=''>Select</option>");
    $("#address_one").val("");
    $("#postal_code").val("");
    $("#city").val("");
    state_list_update();
});

/**
 * Floor plans js ends
 */

function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isDisplayed = content.style.display === 'block';
    content.style.display = isDisplayed ? 'none' : 'block';
}

function addMoreSection(button, project_type_id) {
    const sectionContainer = button.previousElementSibling;
    const uniqueId = Date.now(); // Generate unique ID once

    const newSection = document.createElement('div');
    newSection.className = 'section';
    newSection.innerHTML = `
        
            <div class="row">
                <input type="hidden" name="project_type_id[]" value="${project_type_id}">
                <div class="col-md-6 col-sm-6">
                    <div class="form-group">
                        <label for="floor_heading_${uniqueId}">Floor Heading </label>
                        <input type="text" required class="form-control" name="floor_heading[]" id="floor_heading_${uniqueId}" placeholder="Floor heading" value="">
                    </div>
                </div>

                <div class="col-md-6 col-sm-6">
                    <div class="form-group">
                        <label for="floor_bed_rooms_${uniqueId}">Bedrooms </label>
                        <input type="number" onkeypress="return event.charCode >= 48 && event.charCode <= 57" required class="form-control" name="floor_bed_rooms[]" id="floor_bed_rooms_${uniqueId}" placeholder="Bedrooms" value="">
                    </div>
                </div>

                <div class="col-md-6 col-sm-6">
                    <div class="form-group">
                        <label for="floor_available_units_${uniqueId}">Available units </label>
                        <input type="number" onkeypress="return event.charCode >= 48 && event.charCode <= 57" required class="form-control" name="floor_available_units[]" id="floor_available_units_${uniqueId}" placeholder="Available units" value="">
                    </div>
                </div>

                <div class="col-md-6 col-sm-6">
                    <div class="form-group">
                        <label for="floor_bedroom_desc_${uniqueId}">Floor Description </label>
                        <input type="text" required class="form-control" name="floor_bedroom_desc[]" id="floor_bedroom_desc_${uniqueId}" placeholder="Floor Description" value="">
                    </div>
                </div>

                <div class="col-md-12 col-sm-12">
                    <div class="form-group">
                        <label for="floor_area_${uniqueId}">Area Square feet </label>
                        <input type="number" onkeypress="return event.charCode >= 48 && event.charCode <= 57" required class="form-control" name="floor_area[]" id="floor_area_${uniqueId}" placeholder="Floor Area (Sqft)" value="">
                    </div>
                </div>

                <div class="col-md-12 col-sm-12 upload-fav pt10 pb0">
                    <div class="item">
                        <div class="dropzone" id="uploadFloorPlanImgFrm_${uniqueId}">
                            <input type="hidden" name="floor_plan_img_id[]" id="floor_plan_img_id_${uniqueId}" value="">
                            <input type="hidden" name="floor_plan_img_name[]" id="floor_plan_img_name_${uniqueId}" value="">
                            <div class="dz-default dz-message" data-dz-message="">
                                <div class="block">
                                    <button type="button" class="btn btn-primary"><i class="fas fa-upload" aria-hidden="true" role="presentation"></i> Upload Photo</button>
                                </div>
                                <div class="block">or</div>
                                <div class="block">
                                    <h6>
                                        Drag & Drop Docs
                                        <span>Supported Files: png, jpg, jpeg</span>
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div class="item floorPlanImageDiv" id="floorPlanImageDiv_${uniqueId}" style="display:none;">
                      <div class="artical-icon floor-plan-section">
                        <figure>
                          <img class="floorPlanImageId" id="floorPlanImageId_${uniqueId}" alt="floor plan" width="211" height="113">
                        </figure>
                        <a href="javascript:void(0)" class="confirm_image_delete" data-image-id="" data-image-name="" data-image-section="" data-count=""><i class="fas fa-trash-alt" aria-hidden="true" role="presentation"></i></a>
                      </div>
                    </div>
                </div>
            </div>
        
        <button type="button" class="remove-section" onclick="removeSection(this)"><i class="fa-solid fa-minus"></i></button>
    `;

    sectionContainer.appendChild(newSection);

    // Initialize the new Dropzone with unique ID
    const elementId = `uploadFloorPlanImgFrm_${uniqueId}`;
    const floorPlanImageParams = {
        url: '/admin/save-images/',
        field_name: 'floor_plan_image',
        file_accepted: '.png, .jpg, .jpeg',
        element: elementId,
        upload_multiple: false,
        max_files: 1,
        call_function: function (response) {
            set_floor_plan_details(response, elementId,'add_more');
        }
    };

    try {
        initdrozone(floorPlanImageParams);
    } catch (ex) {
        console.error('Error initializing Dropzone:', ex);
    }
    updateRemoveButtons(sectionContainer);
}

function validateSection(section) {
    let isValid = true;
    $(section)
        .find("input[required]")
        .each(function () {
            if (!$(this).val().trim()) {
                isValid = false;
                $(this).addClass("is-invalid");
                $(this).next(".error-message").remove();
                $(this).after('<span class="error-message text-danger">This field is required.</span>');
            } else {
                $(this).removeClass("is-invalid");
                $(this).next(".error-message").remove();
            }
        });
    return isValid;
}

$(document).on("input", "input[required]", function () {
    validateSection($(this).closest(".section"));
});

function removeSection(button) {
    const section = button.parentElement;
    const sectionContainer = section.parentElement;
    section.remove();
    updateRemoveButtons(sectionContainer);
}

function updateRemoveButtons(sectionContainer) {
    const sections = sectionContainer.querySelectorAll('.section');
    sections.forEach(section => {
        const removeButton = section.querySelector('.remove-section');
        if (sections.length > 1) {
            removeButton.classList.remove('hidden');
        } else {
            removeButton.classList.add('hidden');
        }
    });
}

document.querySelectorAll('.section-container').forEach(updateRemoveButtons);

/**
 * Floor plans JS ends
 */

// jQuery for toggling the Add Facility form and handling submission
$('#add-facility-btn').on('click', function () {
    const $form = $('#add-facility-form');
    $form.toggle();
});

$('#submit-facility-btn').on('click', function () {
    const newFacilityName = $('#new-facility-name').val().trim();

    if (newFacilityName === '') {
        alert('Please enter a facility name.');
        return;
    }

    // Send the new facility to the server using an AJAX request
    $.ajax({
        url: "{% url 'add_facility' %}",
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
        },
        data: JSON.stringify({ name: newFacilityName }),
        success: function (data) {
            if (data.success) {
                alert('Facility added successfully!');
                location.reload(); // Reload the page to show the new facility
            } else {
                alert(data.error || 'An error occurred.');
            }
        }
    });
});

function change_project_status(project_id,element){
    var status_id = $('option:selected',element).val();
    var status_name = $('option:selected',element).text();
    var project_id = project_id;
    data = {project_id: project_id, status_id : status_id, status_name: status_name};

    $.ajax({
        url: '/admin/change-project-status/',
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
                var project_id = response.project_id.toString();
                var status_id = response.status_id;
                var status_name = response.status_name;
                var badge_class='badge-success';
                if(status_id == 2 || status_id == 4){
                    badge_class = 'badge-danger';
                }
                $('#change_status_'+project_id).hide();
                $('#display_status_'+project_id).html('<span class="badge '+badge_class+'" style="cursor:pointer;">'+status_name+'</span>').show();
                window.setTimeout(function () {
                    $.growl.notice({title: "Project ", message: response.msg, size: 'large'});
                }, 2000);
            }else{
                window.setTimeout(function () {
                    $.growl.error({title: "Project ", message: response.msg, size: 'large'});
                }, 2000);
            }
        }
    });
}


function change_apporval_status(project_id, element){
    var approval_id = $('option:selected',element).val();
    var approval_name = $('option:selected',element).text();
    var project_id = project_id;
    data = {project_id: project_id, approval_id : approval_id, approval_name: approval_name};
    $.ajax({
        url: '/admin/change-project-approval-status/',
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
                var project_id = response.project_id.toString();
                var approval_id = response.approval_id;
                var approval_name = response.approval_name;
                var badge_class='badge-success';
                if(approval_id != 1){
                    badge_class = 'badge-warning';
                }
                $('#change_approval_'+project_id).hide();
                $('#approval_status_'+project_id).html('<span class="badge '+badge_class+'" style="cursor:pointer;">'+approval_name+'</span>').show();
                custom_response = {
                    // 'user_id': response.data.user_id,
                    'user_id': encryptUserId(String(response.data.user_id), encryptionKey),
                };
                customCallBackFunc(update_notification_socket, [custom_response]);
                window.setTimeout(function () {
                    $.growl.notice({title: "Project ", message: response.msg, size: 'large'});
                }, 2000);
            }else{
                window.setTimeout(function () {
                    $.growl.error({title: "Project ", message: response.msg, size: 'large'});
                }, 2000);
            }
        }
    });
}

function update_notification_socket(response){
    socket.emit("getNotifications", {"user_id": response.user_id});
}



//-----------Projects csv download--------
function project_csv_download(){
    var search = $('#proj_search').val();
    var currpage = $('#proj_listing_pagination_list .active a').text();
    if($('#proj_num_record').val() != ""){
        recordPerpage = $('#proj_num_record').val();
    }
    var status = $('#proj_status').val();
    var proj_filter_status = $('#proj_filter_status').val();
    var filter_project_type = $('#filter_project_type').val();
    var filter_developer = $('#filter_developer').val();

    $('.overlay').show();
    fetch('/admin/projects-csv-download/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', // This is important for Django to identify it as an AJAX request
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
                    search: search,
                    perpage: recordPerpage,
                    status: status,
                    page: currpage,
                    proj_filter_status: proj_filter_status,
                    filter_project_type: filter_project_type,
                    filter_developer: filter_developer
                })
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error('Network response was not ok.');
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'project.csv';;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        $('.overlay').hide();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
