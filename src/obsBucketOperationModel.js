/**
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

import {
    BucketEncryptionRule,
    PublicAccessBlockBody,
} from './sharedModel';
export const CreateBucket = {
    'httpMethod': 'PUT',
    'data': {
        'xmlRoot': 'CreateBucketConfiguration'
    },
    'parameters': {
        'Bucket': {
            'required': true,
            'location': 'uri'
        },
        'ACL': {
            'location': 'header',
            'sentAs': 'acl',
            'withPrefix': true
        },
        'StorageType': {
            'location': 'header',
            'sentAs': 'storage-class',
            'withPrefix': true
        },
        'ObjectLockEnabeld': {
            'location': 'header',
            'sentAs': 'bucket-object-lock-enabled',
            'withPrefix': true
        },
        'IESLocation': {
            'location': 'header',
            'sentAs': 'ies-location',
            'withPrefix': true
        },
        'FileInterface': {
            'location': 'header',
            'sentAs': 'fs-file-interface',
            'withPrefix': true
        },
        'Type': {
            'location': 'header',
            'sentAs': 'bucket-type',
            'withPrefix': true
        },
        'MultiAz': {
            'location': 'header',
            'sentAs': 'az-redundancy',
            'withPrefix': true
        },
        'Redundancy': {
            'location': 'header',
            'sentAs': 'bucket-redundancy',
            'withPrefix': true
        },
        'IsFusionAllowUpgrade': {
            'location': 'header',
            'sentAs': 'fusion-allow-upgrade',
            'withPrefix': true
        },
        'IsFusionAllowAlternative': {
            'location': 'header',
            'sentAs': 'fusion-allow-alternative',
            'withPrefix': true
        },
        'Cluster': {
            'location': 'header',
            'sentAs': 'location-clustergroup-id',
            'withPrefix': true
        },
        'GrantFullControl': {
            'location': 'header',
            'sentAs': 'grant-full-control',
            'withPrefix': true
        },
        'GrantFullControlDelivered': {
            'location': 'header',
            'sentAs': 'grant-full-control-delivered',
            'withPrefix': true
        },
        'GrantRead': {
            'location': 'header',
            'sentAs': 'grant-read',
            'withPrefix': true
        },
        'GrantReadDelivered': {
            'location': 'header',
            'sentAs': 'grant-read-delivered',
            'withPrefix': true
        },
        'GrantReadACP': {
            'location': 'header',
            'sentAs': 'grant-read-acp',
            'withPrefix': true
        },
        'GrantWrite': {
            'location': 'header',
            'sentAs': 'grant-write',
            'withPrefix': true
        },
        'GrantWriteACP': {
            'location': 'header',
            'sentAs': 'grant-write-acp',
            'withPrefix': true
        },
        'ClusterType': {
            'location': 'header',
            'sentAs': 'cluster-type',
            'withPrefix': true
        },
        'EdgeLocation': {
            'location': 'header',
            'sentAs': 'edge-location',
            'withPrefix': true
        },
        "MultiEnterprise": { "location": "header", 'sentAs': "epid", 'withPrefix': true },
        "Location": {
            "location": "xml",
            "sentAs": "Location"
        },
        ...BucketEncryptionRule
    }
};
export const GetBucketMetadata = {
    'httpMethod': 'HEAD',
    'parameters': {
        'Bucket': {
            'required': true,
            'location': 'uri',
        },
        'Origin': {
            'location': 'header',
            'sentAs': 'Origin'
        },

        'RequestHeader': {
            'location': 'header',
            'sentAs': 'Access-Control-Request-Headers'
        }
    },
};
export const GetBucketMetadataOutput = {
    'parameters': {
        'StorageClass': {
            'location': 'header',
            'sentAs': 'storage-class',
            'withPrefix': true
        },
        'ObsVersion': {
            'location': 'header',
            'sentAs': 'version',
            'withPrefix': true
        },
        'Location': {
            'location': 'header',
            'sentAs': 'bucket-location',
            'withPrefix': true
        },
        'FileInterface': {
            'location': 'header',
            'sentAs': 'fs-file-interface',
            'withPrefix': true
        },
        'Type': {
            'location': 'header',
            'sentAs': 'bucket-type',
            'withPrefix': true
        },
        'MultiAz': {
            "location": 'header',
            'sentAs': 'az-redundancy',
            'withPrefix': true
        },
        'Redundancy': {
            'location': 'header',
            'sentAs': 'bucket-redundancy',
            'withPrefix': true
        },
        'Cluster': {
            'location': 'header',
            'sentAs': 'location-clustergroup-id',
            'withPrefix': true
        },
        'MultiEnterprise': {
            'location': 'header',
            'sentAs': 'epid',
            'withPrefix': true
        },
        'ClusterType': {
            "location": 'header',
            'sentAs': 'cluster-type',
            'withPrefix': true
        },
        'IESLocation': {
            'location': 'header',
            'sentAs': 'ies-location',
            'withPrefix': true
        },
        'AllowOrigin': {
            'location': 'header',
            'sentAs': 'access-control-allow-origin'
        },
        'MaxAgeSeconds': {
            'location': 'header',
            'sentAs': 'access-control-max-age'
        },
        'ExposeHeader': {
            'location': 'header',
            'sentAs': 'access-control-expose-headers'
        },
        'AllowMethod': {
            'location': 'header',
            'sentAs': 'access-control-allow-methods'
        },
        'AllowHeader': {
            'location': 'header',
            'sentAs': 'access-control-allow-headers'
        },
        'RedundancyClustergroupId': {
            'location': 'header',
            'sentAs': 'redundancy-clustergroup-id',
            'withPrefix': true
        },
        'EdgeLocation': {
            'location': 'header',
            'sentAs': 'edge-location',
            'withPrefix': true
        }
    }
};
export const DeleteBucket = {
    'httpMethod': 'DELETE',
    'parameters': {
        'Bucket': {
            'required': true,
            'location': 'uri',
        },
    },
};
export const ListBuckets = {
    'httpMethod': 'GET',
    "parameters": {
        "Type": {
            'sentAs': "x-obs-bucket-type",
            "location": "header"
        },
        "Location": {
            "sentAs": "location",
            "location": "header",
            "withPrefix": true
        },
        'BucketRegion': {
            'location': 'urlPath',
            'sentAs': 'bucket-region'
        }
    }
};
export const ListBucketsOutput = {
    'data': {
        'type': 'xml',
        'xmlRoot': 'ListAllMyBucketsResult'
    },
    'parameters': {
        Buckets: {
            location: "xml",
            sentAs: "Bucket",
            type: "array",
            wrapper: 'Buckets',
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
                    },
                    BucketType: {
                        sentAs: "BucketType"
                    },
                    EdgeLocation: {
                        sentAs: "EdgeLocation"
                    }
                }
            }
        },
        'Owner': {
            'type': 'object',
            'location': 'xml',
            'sentAs': 'Owner',
            'parameters': {
                'ID': {
                    'sentAs': 'ID'
                },
                'DisplayName': {
                    'sentAs': 'DisplayName'
                }
            }
        }
    }
};
export const PutBucketPublicAccessBlock = {
    'httpMethod': 'PUT',
    'urlPath': 'publicAccessBlock',
    'data': {
        'xmlRoot': 'PublicAccessBlockConfiguration'
    },
    "parameters": {
        'Bucket': {
            'required': true,
            'location': 'uri'
        },
        ...PublicAccessBlockBody
    }
};
export const GetBucketPublicAccessBlock = {
    'httpMethod': 'GET',
    'urlPath': 'publicAccessBlock',
    "parameters": {
        'Bucket': {
            'required': true,
            'location': 'uri'
        },
    }
};
export const GetBucketPublicAccessBlockOutput = {
    'data': {
        'type': 'xml',
        'xmlRoot': 'PublicAccessBlockConfiguration'
    },
    "parameters": {
        ...PublicAccessBlockBody
    }
};
export const DeleteBucketPublicAccessBlock = {
    'httpMethod': 'DELETE',
    'urlPath': 'publicAccessBlock',
    "parameters": {
        'Bucket': {
            'required': true,
            'location': 'uri'
        },
    }
};
export const GetBucketPolicyPublicStatus = {
    'httpMethod': 'GET',
    'urlPath': 'policyStatus',
    "parameters": {
        'Bucket': {
            'required': true,
            'location': 'uri'
        },
    }
};
export const GetBucketPolicyPublicStatusOutput = {
    'data': {
        'type': 'xml',
        'xmlRoot': 'PolicyStatus'
    },
    "parameters": {
        'IsPublic': {
            'location': 'xml',
            'sentAs': 'IsPublic',
        },
    }
};
export const GetBucketPublicStatus = {
    'httpMethod': 'GET',
    'urlPath': 'bucketStatus',
    "parameters": {
        'Bucket': {
            'required': true,
            'location': 'uri'
        },
    }
};
export const GetBucketPublicStatusOutput = {
    'data': {
        'type': 'xml',
        'xmlRoot': 'BucketStatus'
    },
    "parameters": {
        'IsPublic': {
            'location': 'xml',
            'sentAs': 'IsPublic',
        },
    }
};