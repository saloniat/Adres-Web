import urllib
import json
import time
import re
import sys, os, logging
import boto3
import datetime
from django.conf import settings
from subdomain.services import call_api_get_method, call_api_post_method
from datetime import date
import tempfile
from django.http import JsonResponse
from packages.context_processors import subdomain_admin_settings
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
import requests

# Initialize BlobServiceClient
blob_service_client = BlobServiceClient.from_connection_string(settings.AZURE_CONNECTION_STRING)

def save_to_s3(file_resource, file_path, container_name=settings.AZURE_CONTAINER_NAME):
    """Function to save uploaded file resource to azure blob

    para1:
       uploaded file resource
    param2:
       file_path: Path within the container to save the file (e.g., 'folder1/folder2').
    param3:
        container_name: The name of the container to upload the file.
    return:
       A dictionary containing the status, error, file_name, and message.
    """

    if file_resource is not None and file_path is not None:
        try:
            upload_file_name = file_resource.name
            upload_file_name = re.sub(r'\s+', '_', upload_file_name)
            times = time.time()
            cloud_filename = file_path + '/' + str(times) + '_' + upload_file_name
            file_name = str(times) + '_' + upload_file_name

            # Get container client and upload the blob
            container_client = blob_service_client.get_container_client(container_name)
            container_client.upload_blob(name=cloud_filename, data=file_resource, overwrite=True)
        except Exception as err:
            return {'status': 403, 'error': 1, 'file_name': '', 'msg': str(err)}
        else:
            return {'status': 200, 'error': 0, 'file_name': file_name, 'msg': 'uploaded'}


def delete_s3_file(file_key, container_name=settings.AZURE_CONTAINER_NAME):
    """Deletes a file from Azure Blob Storage.

    Args:
        file_key: The full path of the file in Azure Blob Storage (including virtual folders).

    Kwargs:
        container_name: The name of the container to delete the file from.

    Returns:
        bool: True if the file was deleted, otherwise false
    """
    try:
        container_client = blob_service_client.get_container_client(container_name)
        container_client.delete_blob(file_key)

        deleted = True

    except Exception as e:
        print(e)
        deleted = False

    return deleted


def save_data_to_s3_bucket(file_resource, bucket_name, listing_id,
                           acl='private', folder_name=''):
    """Function to save a raw CSV file to s3.

    Note: This is different than save_to_s3 since the file is being uploaded
    to a different bucket, and these buckets may have different permissions.

    Args:
        file_resource: CSV uploaded by user
        bucket_name: Name of the bucket to store the file in
        listing_id: Listing where this CSV will belong

    Kwargs:
        acl: access control list of the bucket in s3 (default is private)
        folder_name: Name of the folder where the file should reside.
            Unecessary if the file is supposed to be in the root of the bucket

    Returns:
        The file key of the uploaded file
    """
    if file_resource is not None:
        try:
            upload_file_name = file_resource.name
            upload_file_name = re.sub(r'\s+', '_', upload_file_name)
            timestamp = ''.join(
                x for x in str(datetime.datetime.now()) if x.isalnum())

            cloud_filename = '%s_%s_%s' % (listing_id, timestamp, upload_file_name)
            if folder_name != '':
                cloud_filename = '%s/%s' % (folder_name.rstrip('/'), cloud_filename)

            # Get container client and upload the blob
            container_client = blob_service_client.get_container_client(settings.AZURE_CONTAINER_NAME)
            container_client.upload_blob(name=cloud_filename, data=file_resource, overwrite=True)

        except Exception as err:
            file_key = ''
    else:
        file_key = ''

    return file_key

def check_permission(request, permission_id):
    permission_setting = subdomain_admin_settings(request)
    access_permission_list = permission_setting['access_permission_list']
    if permission_id not in access_permission_list:
        return False
    return True

def get_feature_type(feature):
    feature_type_name = ''

    switcher = {
        'property_type': 'property_type',
        'property_sub_type': 'property_subtype',
        'term_accepted': 'terms_accepted',
        'occupied_by': 'occupied_by',
        'ownership': 'ownership',
        'possession': 'possession',
        'lot_size_unit': 'lot_size',
        'property_style': 'style',
        'property_stories': 'stories',
        'property_heating': 'heating',
        'property_electric': 'electric',
        'property_gas': 'gas',
        'recent_update': 'recent_updates',
        'property_water': 'water',
        'security_feature': 'security_features',
        'property_sewer': 'sewer',
        'tax_exemption': 'tax_exemptions',
        'property_zoning': 'zoning',
        'hoa_amenties': 'amenities',
        'kitchen_features': 'kitchen_features',
        'appliances': 'appliances',
        'property_flooring': 'flooring',
        'property_windows': 'windows',
        'bedroom_features': 'bedroom_features',
        'bathroom_features': 'bathroom_features',
        'other_rooms': 'other_rooms',
        'other_features': 'other_features',
        'master_bedroom_features': 'master_bedroom_features',
        'fire_place_unit': 'fireplace_type',
        'basement_features': 'basement_features',
        'handicap_amenities': 'handicap_amenities',
        'property_construction': 'construction',
        'exterior_features': 'exterior_features',
        'garage_parking': 'garage_parking',
        'roofs': 'roof',
        'out_buildings': 'outbuildings',
        'foundations': 'foundation',
        'fence': 'fence',
        'location_features': 'location_features',
        'road_frontages': 'road_frontage',
        'pools': 'pool',
        'property_faces': 'property_faces',
        'lease_type': 'lease_type',
        'tenant_pays': 'tenant_pays',
        'inclusions': 'inclusions',
        'building_class': 'building_class',
        'interior_features': 'interior_features',
        'mineral_rights': 'mineral_rights',
        'easements': 'easements',
        'survey': 'survey',
        'utilities': 'utilities',
        'improvements': 'improvements',
        'topography': 'topography',
        'wildlife': 'wildlife',
        'fish': 'fish',
        'irrigation_system': 'irrigation_system',
        'recreation': 'recreation',
    }
    feature_type_name = switcher.get(feature,"")

    return feature_type_name

def get_template_theme_path(theme_id):
    directory_path = {
        'template_directory': 'theme-1',
        'template_static_directory': 'Theme-1'
    }
    if theme_id == 1:
        directory_path = {
            'template_directory': 'theme-1',
            'template_static_directory': 'Theme-1'
        }
    elif theme_id == 5:
        directory_path = {
            'template_directory': 'theme-2',
            'template_static_directory': 'Theme-2'
        }
    return directory_path


def check_recaptcha(recaptcha_response):

    recap_url = 'https://www.google.com/recaptcha/api/siteverify'
    values = {
        'secret': settings.GOOGLE_RECAPTCHA_SECRET_KEY,
        'response': recaptcha_response
    }
    recap_data = urllib.parse.urlencode(values).encode()
    req = urllib.request.Request(recap_url, data=recap_data)
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode())
    return result

def format_phone_number(number):
    """Convert a 10 character string into (xxx) xxx-xxxx."""
    try:
        if number is not None:
            first = number[0:3]
            second = number[3:6]
            third = number[6:10]
            return '(' + first + ')' + ' ' + second + '-' + third
        else:
            return ""
    except Exception as exp:
        print(exp)
        return ""

def format_currency(number):
    try:
        if number is not None:
            number = float(number)
            new_number = number-int(number)

            if new_number > 0:
                return "{:.2f}".format(number)
            else:
                return int(number)
        else:
            return ""
    except Exception as exp:
        print(exp)
        return ""
    

def get_property_asset_list(request):
    try:
        asset_list = []
        api_url = settings.API_URL + '/api-settings/property-asset-listing/'
        response = call_api_post_method({}, api_url, request.session['token']['access_token'])
        if "error" in response and response['error'] == 0:
            asset_list = response['data']
        return asset_list
    except Exception as exp:
        return []   


def make_pagination_html(current_page, total_pages, page_type, page_sub_type):
    """This function is used for making pagination.
    param1:
        current_page as integer
    param2:
        total_pages as integer
    """

    pagination_string = ""
    current_page = int(current_page)
    total_pages = int(total_pages)

    if current_page > 1:
        pagination_string = '<li class="page-item"><a class="page-link" role="button" tabindex="9" data="1" data-type="%s" data-sub-type="%s" ' \
                            '>First</a></li>' %\
                            (page_type, page_sub_type)
        pagination_string += '<li class="page-item"><a class="page-link" role="button" tabindex="10" data="%s" data-type="%s" data-sub-type="%s"' \
                             ' ><i class="fa  ' \
                             'fa-angle-double-left" ' \
                             'aria-hidden="true" role="presentation"></i></a></li>' %\
                             (current_page - 1, page_type, page_sub_type)
    else:
        pagination_string = '<li class="page-item disabled"><a class="page-link" role="button" tabindex="11" class="first">First</a></li>' \
                            '<li class="page-item disabled"><a class="page-link" role="button" tabindex="12" aria-label="backward"><i class="fa fa-angle-double-left" ' \
                            'aria-hidden="true" role="presentation"></i><span style="display:none;">Backward</span></a></li>'

    if total_pages <= 10:
        count_limit = 1
        while count_limit <= total_pages:

            if count_limit == current_page:
                pagination_string += '<li class="page-item active"><a class="page-link" role="button" tabindex="13" href="javascript:void(0)"' \
                                     'data-type="%s" data-sub-type="%s" data="%s" ' \
                                     '>%s</a></li>' %\
                                     (page_type,
                                      page_sub_type,
                                      count_limit,
                                      count_limit
                                      )
            else:
                pagination_string += '<li class="page-item"><a class="page-link" role="button" tabindex="14" href="javascript:void(0)" ' \
                                     'data-type="%s" data-sub-type="%s" ' \
                                     'data="%s" >%s</a></li>' %\
                                     (page_type,
                                      page_sub_type,
                                      count_limit,
                                      count_limit
                                      )
            count_limit += 1
    else:
        if current_page > 6:
            count_start = current_page - 5
        else:
            count_start = 1

        if (current_page + 4) <= total_pages:
            if (current_page + 4) <= 10:
                count_limit = 10
            else:
                count_limit = current_page + 4
        else:
            count_limit = total_pages
            if total_pages == current_page:
                count_start = current_page - 9
            elif total_pages - current_page == 1:
                count_start = current_page - 8
            elif total_pages - current_page == 2:
                count_start = current_page - 7
            elif total_pages - current_page == 3:
                count_start = current_page - 6

        while count_start <= count_limit:

            if count_start == current_page:
                pagination_string += '<li class="page-item active"><a class="page-link" role="button" tabindex="15" href="javascript:void(0)"' \
                                     'data-type="%s" data-sub-type="%s" data="%s" ' \
                                     '>%s</a></li>' %\
                                     (
                                         page_type,
                                         page_sub_type,
                                         count_start,
                                         count_start
                                     )
            else:
                pagination_string += '<li class="page-item"><a class="page-link" role="button" tabindex="16" href="javascript:void(0)" ' \
                                     'data-type="%s" data-sub-type="%s" data="%s" >%s</a></li>' % \
                                     (
                                         page_type,
                                         page_sub_type,
                                         count_start,
                                         count_start
                                     )
            count_start += 1

    if current_page == total_pages:
        pagination_string += '<li class="page-item disabled"><a class="page-link" role="button" tabindex="17" aria-label="Forward"><i class="fa fa-angle-double-right" ' \
                             'aria-hidden="true" role="presentation"></i><span style="display:none;">Forward</span></a></li>' \
                             '<li class="page-item disabled"><a class="page-link" role="button" tabindex="18">Last</a></li>'

    else:
        pagination_string += '<li class="page-item"><a class="page-link" role="button" tabindex="19" aria-label="Forward" href="javascript:void(0)"' \
                             'data-type="%s" data-sub-type="%s" data="%s" ' \
                             '><i ' \
                             'class="fa ' \
                             'fa-angle-double-right" ' \
                             'aria-hidden="true" role="presentation">' \
                             '</i><span style="display:none;">Forward</span></a></li>' %\
                             (
                                 page_type,
                                 page_sub_type,
                                 current_page
                                 +
                                 1
                             )
        pagination_string += '<li class="page-item"><a class="page-link" role="button" tabindex="20" href="javascript:void(0)"' \
                             'data-type="%s" data-sub-type="%s" data="%s" ' \
                             '>Last</a></li>' %\
                             (
                                 page_type,
                                 page_sub_type,
                                 total_pages,
                             )

    return pagination_string     


def get_lookup_status_list(request, object_id=None):
    try:
        status_list = []
        param = {}
        if object_id:
            param['object_id'] = object_id
        api_url = settings.API_URL + '/api-settings/lookup-status-listing/'
        response = call_api_post_method(param, api_url, request.session['token']['access_token'])
        if "error" in response and response['error'] == 0:
            status_list = response['data']
        return status_list
    except Exception as exp:
        return []
    

def get_user_type_list(request):
    try:
        user_type_list = []
        api_url = settings.API_URL + '/api-settings/user-type-listing/'
        response = call_api_post_method({'user_id': request.session['user_id']}, api_url, request.session['token']['access_token'])
        if "error" in response and response['error'] == 0:
            user_type_list = response['data']
        return user_type_list
    except Exception as exp:
        return []   


def get_permissions_list(request):
    try:
        permission_list = []
        api_url = settings.API_URL + '/api-settings/permission-listing/'
        response = call_api_post_method({'user_id': request.session['user_id']}, api_url, request.session['token']['access_token'])
        if "error" in response and response['error'] == 0:
            permission_list = response['data']
        return permission_list
    except Exception as exp:
        return []   


def get_event_list(request):
    try:
        event_list = []
        api_url = settings.API_URL + '/api-settings/event-listing/'
        response = call_api_post_method({'user_id': request.session['user_id']}, api_url, request.session['token']['access_token'])
        if "error" in response and response['error'] == 0:
            event_list = response['data']
        return event_list
    except Exception as exp:
        return []    


#  some common api's data
def get_network_domain_list(request):
    try:
        domain_list = []
        api_url = settings.API_URL + '/api-users/network-domain-list/'
        response = call_api_post_method({}, api_url, request.session['token']['access_token'])
        if "error" in response and response['error'] == 0:
            domain_list = response['data']
        return domain_list
    except Exception as exp:
        return []


def get_admin_property_types(request):
    try:
        asset_list = []
        api_url = settings.API_URL + '/api-property/asset-listing/'
        response = call_api_post_method({}, api_url, request.session['token']['access_token'])
        if "error" in response and response['error'] == 0:
            asset_list = response['data']
        return asset_list
    except Exception as exp:
        return []

def get_coordinates(zip_code):
    response = requests.get('https://maps.googleapis.com/maps/api/geocode/json', params = {'address': zip_code, 'key': 'AIzaSyDAtldLm1k7qbg9JSB1Pus2T5LfXp89D50'})
    data = response.json()
    if data['results']:
        location = data['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    return None, None         
