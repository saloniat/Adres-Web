function set_property_deed_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_deed_id = $('#property_deed_id').val();
    var property_deed_name = $('#property_deed_name').val();
    var property_id = $('#property_id').val();
    var count = parseInt($('#propertyDeedList li').length);
    if(response.status == 200){
        $('#custom_property_deed_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var j = 0
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                const ext = item.ext;
                // var j = parseInt(j) + 1;
                // console.log(j);
                var image_count = parseInt($("#propertyDeedList li").length) + 1; 
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
                if(item.file_name != "" && ext != ".pdf"){
                    var img_src = azure_blob_url+item.upload_to+"/"+item.file_name;
                    var img_tag = '<figure><img class="slide-fixed" src="/static/admin/images/transparent.png" alt=""><img class="slide-img" src="'+img_src+'" alt=""></figure>';
                }else if(item.file_name != "" && ext == ".pdf"){
                    var img_src = "/static/admin/images/pdf_image.svg";
                    var pdf_path = azure_blob_url+item.upload_to+"/"+item.file_name;
                    var img_tag = '<figure><a href="'+pdf_path+'" target="_blank"><img class="slide-fixed" src="/static/admin/images/transparent.png" alt=""><img class="slide-img" src="'+img_src+'" alt=""></a></figure>';
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
                // $('#propertyDeedList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><textarea id="photo_description_'+image_count+'" name="photo_description_'+image_count+'" rows="4" cols="20">Photo Description</textarea><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                // $('#propertyDeedList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
                $('#propertyDeedList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a>'+img_tag+'<figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
            });
            image_name = image_name+','+property_deed_name;
            upload_id = upload_id+','+property_deed_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_deed_name').val(actual_image);
            $('#property_deed_id').val(actual_id);
            $('#PropertyDeedDiv').show();
            reindex_prop_deed_list();
        }
    }
}


function reindex_prop_deed_list(){
    var img_id_list = [];
    var img_name_list = [];
    var str_img_id = '';
    var str_img_name = '';
    $('#propertyDeedList li').each(function(index){
        var rel_id = $(this).find('a').attr('data-image-id');
        var rel_name = $(this).find('a').attr('data-image-name');
        img_id_list.push(rel_id);
        img_name_list.push(rel_name);
    });
    str_img_id = img_id_list.toString();
    str_img_name = img_name_list.toString();
    $('#property_deed_id').val(str_img_id);
    $('#property_deed_name').val(str_img_name);
}


function set_property_floor_plan_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_upload_id = $('#property_floor_plan_id').val();
    var property_upload_name = $('#property_floor_plan_name').val();
    var property_id = $('#property_id').val();
    var count = parseInt($('#propertyFloorPlanList li').length);
    if(response.status == 200){
        $('#custom_property_floor_plan_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var j = 0
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                const ext = item.ext;
                // var j = parseInt(j) + 1;
                // console.log(j);
                var image_count = parseInt($("#propertyFloorPLanList li").length) + 1; 
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
                // if(item.file_name != "" && ext != ".pdf"){
                //     // var img_src = azure_blob_url+"property_image/"+item.file_name;
                //     var img_src = azure_blob_url+item.upload_to+"/"+item.file_name;
                    
                // }else if(item.file_name != "" && ext == ".pdf"){
                //     var img_src = "/static/admin/images/pdf_image.svg";
                // }
                if(item.file_name != "" && ext != ".pdf"){
                    var img_src = azure_blob_url+item.upload_to+"/"+item.file_name;
                    var img_tag = '<figure><img class="slide-fixed" src="/static/admin/images/transparent.png" alt=""><img class="slide-img" src="'+img_src+'" alt=""></figure>';
                }else if(item.file_name != "" && ext == ".pdf"){
                    var img_src = "/static/admin/images/pdf_image.svg";
                    var pdf_path = azure_blob_url+item.upload_to+"/"+item.file_name;
                    var img_tag = '<figure><a href="'+pdf_path+'" target="_blank"><img class="slide-fixed" src="/static/admin/images/transparent.png" alt=""><img class="slide-img" src="'+img_src+'" alt=""></a></figure>';
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
                // $('#propertyFloorPlanList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><textarea id="photo_description_'+image_count+'" name="photo_description_'+image_count+'" rows="4" cols="20">Photo Description</textarea><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                // $('#propertyFloorPlanList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
                $('#propertyFloorPlanList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a>'+img_tag+'<figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
            });
            image_name = image_name+','+property_upload_name;
            upload_id = upload_id+','+property_upload_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_floor_plan_name').val(actual_image);
            $('#property_floor_plan_id').val(actual_id);
            $('#PropertyFloorPlanDiv').show();
            reindex_prop_floor_plan_list();
        }
    }
}


function reindex_prop_floor_plan_list(){
    var img_id_list = [];
    var img_name_list = [];
    var str_img_id = '';
    var str_img_name = '';
    $('#propertyFloorPlanList li').each(function(index){
        var rel_id = $(this).find('a').attr('data-image-id');
        var rel_name = $(this).find('a').attr('data-image-name');
        img_id_list.push(rel_id);
        img_name_list.push(rel_name);
    });
    str_img_id = img_id_list.toString();
    str_img_name = img_name_list.toString();
    $('#property_floor_plan_id').val(str_img_id);
    $('#property_floor_plan_name').val(str_img_name);
}


function set_property_cover_image_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_upload_id = $('#property_cover_image_id').val();
    var property_upload_name = $('#property_cover_image_name').val();
    var property_id = $('#property_id').val();
    var count = parseInt($('#propertyCoverImageList li').length);
    if(response.status == 200){
        $('#custom_property_cover_image_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var j = 0
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                const ext = item.ext;
                // var j = parseInt(j) + 1;
                // console.log(j);
                var image_count = parseInt($("#propertyCoverImageList li").length) + 1; 
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
                // if(item.file_name != "" && ext != ".pdf"){
                //     // var img_src = azure_blob_url+"property_image/"+item.file_name;
                //     var img_src = azure_blob_url+item.upload_to+"/"+item.file_name;
                    
                // }else if(item.file_name != "" && ext == ".pdf"){
                //     var img_src = "/static/admin/images/pdf_image.svg";
                // }
                if(item.file_name != "" && ext != ".pdf"){
                    var img_src = azure_blob_url+item.upload_to+"/"+item.file_name;
                    var img_tag = '<figure><img class="slide-fixed" src="/static/admin/images/transparent.png" alt=""><img class="slide-img" src="'+img_src+'" alt=""></figure>';
                }else if(item.file_name != "" && ext == ".pdf"){
                    var img_src = "/static/admin/images/pdf_image.svg";
                    var pdf_path = azure_blob_url+item.upload_to+"/"+item.file_name;
                    var img_tag = '<figure><a href="'+pdf_path+'" target="_blank"><img class="slide-fixed" src="/static/admin/images/transparent.png" alt=""><img class="slide-img" src="'+img_src+'" alt=""></a></figure>';
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
                // $('#propertyCoverImageList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><textarea id="photo_description_'+image_count+'" name="photo_description_'+image_count+'" rows="4" cols="20">Photo Description</textarea><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                // $('#propertyCoverImageList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
                $('#propertyCoverImageList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a>'+img_tag+'<figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
            });
            image_name = image_name+','+property_upload_name;
            upload_id = upload_id+','+property_upload_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_cover_image_name').val(actual_image);
            $('#property_cover_image_id').val(actual_id);
            $('#PropertyCoverImageDiv').show();
            reindex_prop_cover_image_list();
        }
    }
}


function reindex_prop_cover_image_list(){
    var img_id_list = [];
    var img_name_list = [];
    var str_img_id = '';
    var str_img_name = '';
    $('#propertyCoverImageList li').each(function(index){
        var rel_id = $(this).find('a').attr('data-image-id');
        var rel_name = $(this).find('a').attr('data-image-name');
        img_id_list.push(rel_id);
        img_name_list.push(rel_name);
    });
    str_img_id = img_id_list.toString();
    str_img_name = img_name_list.toString();
    $('#property_cover_image_id').val(str_img_id);
    $('#property_cover_image_name').val(str_img_name);
}


function set_property_image_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_upload_id = $('#property_image_id').val();
    var property_upload_name = $('#property_image_name').val();
    var property_id = $('#property_id').val();
    var count = parseInt($('#propertyImageList li').length);
    if(response.status == 200){
        $('#custom_property_image_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var j = 0
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                const ext = item.ext;
                // var j = parseInt(j) + 1;
                // console.log(j);
                var image_count = parseInt($("#propertyImageList li").length) + 1; 
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
                // if(item.file_name != "" && ext != ".pdf"){
                //     // var img_src = azure_blob_url+"property_image/"+item.file_name;
                //     var img_src = azure_blob_url+item.upload_to+"/"+item.file_name;
                    
                // }else if(item.file_name != "" && ext == ".pdf"){
                //     var img_src = "/static/admin/images/pdf_image.svg";
                // }
                if(item.file_name != "" && ext != ".pdf"){
                    var img_src = azure_blob_url+item.upload_to+"/"+item.file_name;
                    var img_tag = '<figure><img class="slide-fixed" src="/static/admin/images/transparent.png" alt=""><img class="slide-img" src="'+img_src+'" alt=""></figure>';
                }else if(item.file_name != "" && ext == ".pdf"){
                    var img_src = "/static/admin/images/pdf_image.svg";
                    var pdf_path = azure_blob_url+item.upload_to+"/"+item.file_name;
                    var img_tag = '<figure><a href="'+pdf_path+'" target="_blank"><img class="slide-fixed" src="/static/admin/images/transparent.png" alt=""><img class="slide-img" src="'+img_src+'" alt=""></a></figure>';
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
                // $('#propertyImageList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><textarea id="photo_description_'+image_count+'" name="photo_description_'+image_count+'" rows="4" cols="20">Photo Description</textarea><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                // $('#propertyImageList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
                $('#propertyImageList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a>'+img_tag+'<figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
            });
            image_name = image_name+','+property_upload_name;
            upload_id = upload_id+','+property_upload_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_image_name').val(actual_image);
            $('#property_image_id').val(actual_id);
            $('#PropertyImageDiv').show();
            reindex_prop_image_list();
        }
    }
}


function reindex_prop_image_list(){
    var img_id_list = [];
    var img_name_list = [];
    var str_img_id = '';
    var str_img_name = '';
    $('#propertyImageList li').each(function(index){
        var rel_id = $(this).find('a').attr('data-image-id');
        var rel_name = $(this).find('a').attr('data-image-name');
        img_id_list.push(rel_id);
        img_name_list.push(rel_name);
    });
    str_img_id = img_id_list.toString();
    str_img_name = img_name_list.toString();
    $('#property_image_id').val(str_img_id);
    $('#property_image_name').val(str_img_name);
}

function set_property_video_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_upload_id = $('#property_video_id').val();
    var property_upload_name = $('#property_video_name').val();
    var property_id = $('#property_id').val();
    var count = parseInt($('#propertyVideoList li').length);
    if(response.status == 200){
        $('#custom_property_video_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var j = 0
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                // var j = parseInt(j) + 1;
                // console.log(j);
                var image_count = parseInt($("#propertyVideoList li").length) + 1; 
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
                    // var img_src = azure_blob_url+"property_image/"+item.file_name;
                    var img_src = azure_blob_url+item.upload_to+"/"+item.file_name;
                    
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
                // $('#propertyVideoList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><video width="190" height="135" controls><source src="'+img_src+'" type="video/mp4"></video><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><textarea id="photo_description_'+image_count+'" name="photo_description_'+image_count+'" rows="4" cols="20">Photo Description</textarea><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                $('#propertyVideoList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><video width="190" height="135" controls><source src="'+img_src+'" type="video/mp4"></video><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
            });
            image_name = image_name+','+property_upload_name;
            upload_id = upload_id+','+property_upload_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_video_name').val(actual_image);
            $('#property_video_id').val(actual_id);
            $('#PropertyVideoDiv').show();
            reindex_prop_video_list();
        }
    }
}


function reindex_prop_video_list(){
    var img_id_list = [];
    var img_name_list = [];
    var str_img_id = '';
    var str_img_name = '';
    $('#propertyCoverImageList li').each(function(index){
        var rel_id = $(this).find('a').attr('data-image-id');
        var rel_name = $(this).find('a').attr('data-image-name');
        img_id_list.push(rel_id);
        img_name_list.push(rel_name);
    });
    str_img_id = img_id_list.toString();
    str_img_name = img_name_list.toString();
    $('#property_cover_image_id').val(str_img_id);
    $('#property_cover_image_name').val(str_img_name);
}