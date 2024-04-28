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
                'sentAs' : 'storage-class',
                'withPrefix': true
        },
        'ObjectLockEnabeld': {
            'location' : 'header',
                'sentAs' : 'bucket-object-lock-enabled',
                'withPrefix': true
        },
        'IESLocation':{
            'location' : 'header',
                'sentAs' : 'ies-location',
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
                'sentAs' : 'az-redundancy',
                'withPrefix': true
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
        "MultiEnterprise": {"location": "header", 'sentAs': "epid", 'withPrefix': true},
        "Location": {
            "location": "xml",
                "sentAs": "Location"
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