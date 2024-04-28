/**
 * Copyright 2019 Huawei Technologies Co.,Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 *
 */

export const CreateSfsBucket = {
    'httpMethod' : 'PUT',
    'data' : {
        'xmlRoot' : 'CreateBucketConfiguration'
    },
    'parameters' : {
        'ApiPath': {
            'location': 'uri',
        },
        'ACL' : {
            'location' : 'header',
            'sentAs' : 'acl',
            'withPrefix': true
        },
        'StorageType':{
            'location' : 'header',
            'sentAs' : 'x-default-storage-class'
        },
        'IESLocation':{
            'location' : 'header',
            'sentAs' : 'ies-location',
            'withPrefix': true
        },
        'ObjectLockEnabeld': {
            'location' : 'header',
            'sentAs' : 'bucket-object-lock-enabled',
            'withPrefix': true
        },
        'FileInterface':{
            'location' : 'header',
            'sentAs' : 'fs-file-interface',
            'withPrefix': true
        },
        'Type':{
            'location' : 'header',
            'sentAs': 'bucket-type',
            'withPrefix': true
        },
        'MultiAz':{
            'location' : 'header',
            'sentAs' : 'x-obs-az-redundancy'
        },
        'Redundancy':{
            'location' : 'header',
            'sentAs' : 'bucket-redundancy',
            'withPrefix': true
        },
        'IsFusionAllowUpgrade':{
            'location' : 'header',
            'sentAs' : 'fusion-allow-upgrade',
            'withPrefix': true
        },
        'IsFusionAllowAlternative':{
            'location' : 'header',
            'sentAs' : 'fusion-allow-alternative',
            'withPrefix': true
        },
        'Cluster': {
            'location' : 'header',
            'sentAs' : 'location-clustergroup-id',
            'withPrefix': true
        },
        'GrantFullControl':{
            'location' : 'header',
            'sentAs' : 'grant-full-control',
            'withPrefix': true
        },
        'GrantRead':{
            'location' : 'header',
            'sentAs' : 'grant-read',
            'withPrefix': true
        },
        'GrantReadACP':{
            'location' : 'header',
            'sentAs' : 'grant-read-acp',
            'withPrefix': true
        },
        'GrantWrite':{
            'location' : 'header',
            'sentAs' : 'grant-write',
            'withPrefix': true
        },
        'GrantWriteACP':{
            'location' : 'header',
            'sentAs' : 'grant-write-acp',
            'withPrefix': true
        },
        'ClusterType': {
            'location' : 'header',
            'sentAs' : 'cluster-type',
            'withPrefix': true
        },
        "MultiEnterprise": {"location": "header", 'sentAs': "epid",'withPrefix': true},
        "Location": {
            "location": "xml",
            "sentAs": "LocationConstraint"
        }
    }
};
export const DeleteSfsBucket = {
    'httpMethod' : 'DELETE',
        'parameters' : {
        'ApiPath': {
            'location': 'uri',
        },
    },
};
export const ListSfsBuckets = {
    'httpMethod' : 'GET',
        "parameters": {
        "Type":{
            'sentAs': "x-obs-bucket-type",
                "location":"header"
        },
        'ApiPath': {
            'location': 'uri',
        },
        "Location": {
            "sentAs": "location",
                "location":"header",
                "withPrefix": true
        }
    }
};
export const ListSfsBucketsOutput = {
    'data' : {
        'type' : 'xml',
            'xmlRoot' : 'ListAllMyBucketsResult'
    },
    'parameters': {
        Buckets: {
            location: "xml",
                sentAs: "Bucket",
                type: "array",
                wrapper : 'Buckets',
                items: {
                type: "object",
                    location: "xml",
                    sentAs: "Bucket",
                    parameters: {
                    Name: {
                        sentAs: "Name"
                    },
                    CreationDate: {
                        sentAs: "CreationDate"
                    },
                    Location: {
                        sentAs: "Location"
                    },
                    ClusterType: {
                        sentAs: "ClusterType"
                    },
                    IESLocation: {
                        sentAs: "IESLocation"
                    }
                }
            }
        },
        'Owner': {
            'type' : 'object',
                'location' : 'xml',
                'sentAs' : 'Owner',
                'parameters' : {
                'ID' : {
                    'sentAs' : 'ID'
                },
                'DisplayName' : {
                    'sentAs' : 'DisplayName'
                }
            }
        }
    }
};
export const SetSFSAcl = {
    'httpMethod' : 'PUT',
        'urlPath' : 'sfsacl',
        'parameters' : {
        'Bucket' : {
            'required' : true,
                'location' : 'uri',
        },
        'Policy' : {
            'required' : true,
                'location' : 'body',
        },
    },
};
export const GetSFSAcl = {
    'httpMethod' : 'GET',
        'urlPath' : 'sfsacl',
        'parameters' : {
        'Bucket' : {
            'required' : true,
                'location' : 'uri',
        },
    },
};
export const GetSFSAclOutput = {
    'data' : {
        'type' : 'body',
    },
    'parameters' : {
        'Policy' : {
            'location' : 'body',
        },
    },
};
export const DeleteSFSAcl = {
    'httpMethod' : 'DELETE',
        'urlPath' : 'sfsacl',
        'parameters' : {
        'Bucket' : {
            'required' : true,
                'location' : 'uri',
        },
    },
};
export const getSFSPermissionAcl = {
    'httpMethod': "GET",
        'parameters': {
        'ApiPath': {
            'location': "uri",
        },
    },
};
export const getSFSPermissionAclOutput = {
    'data': {
        'type': 'body'
    },
    'parameters': {
        'PermissionGroup': {
            'location': "body",
        },
    },
};
export const updateSFSPermissionAcl = {
    'httpMethod': "PUT",
        'parameters': {
        'ApiPath': {
            'location': "uri",
        },
        'Params': {
            'location': "body",
        },
    },
};
export const deleteSFSPermissionAcl = {
    'httpMethod': "DELETE",
        'parameters': {
        'ApiPath': {
            'location': "uri",
        },
    },
};
export const getSFSPermissionGroupList = {
    'httpMethod': "GET",
        'parameters': {
        'ApiPath': {
            'location': "uri",
        },
        'Limit': {
            'location': "urlPath",
                'sentAs': "limit",
        },
        'Offset': {
            'location': "urlPath",
                'sentAs': "offset",
        },
    },
};
export const getSFSPermissionGroupListOutput = {
    'data': {
        'type': "body",
    },
    'parameters': {
        'PermissionGroups': {
            'location': "body",
        },
    },
};
export const setSFSPermissionGroup = {
    'httpMethod': "POST",
        'parameters': {
        'ApiPath': {
            'location': "uri",
        },
        'Params': {
            'location': "body",
        },
    },
};
export const updateSFSPermissionGroup = {
    'httpMethod': "PUT",
        'parameters': {
        'ApiPath': {
            'location': "uri",
        },
        'Params': {
            'location': "body",
        },
    },
};
export const getSFSPermissionGroup = {
    'httpMethod': "GET",
        'parameters': {
        'ApiPath': {
            'location': "uri",
        },
    },
};
export const getSFSPermissionGroupOutput = {
    'data': {
        'type': "body",
    },
    'parameters': {
        'PermissionGroup': {
            'location': "body",
        },
    },
};
export const deleteSFSPermissionGroup = {
    'httpMethod': "DELETE",
        'parameters': {
        'ApiPath': {
            'location': "uri",
        },
    },
};
