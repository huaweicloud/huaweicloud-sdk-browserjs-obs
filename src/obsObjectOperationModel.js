const owner = {
    'type' : 'object',
    'location' : 'xml',
    'sentAs' : 'Owner',
    'parameters' : {
        'ID' : {
            'sentAs' : 'ID'
        }
    }
};
const commonPrefixes = {
    'type' : 'array',
    'location' : 'xml',
    'sentAs' : 'CommonPrefixes',
    'items' : {
        'type' : 'object',
        'parameters' : {
            'Prefix' : {
                'decode' : true,
                'sentAs' : 'Prefix',
            },
            'MTime': {
                'sentAs': 'MTime',
            },
            'InodeNo': {
                'sentAs': 'InodeNo',
            }
        }
    }
};
export const ListObjects = {
    'httpMethod' : 'GET',
        'parameters' : {
        'Bucket' : {
            'required' : true,
                'location' : 'uri',
        },
        'Prefix' : {
            'location' : 'urlPath',
                'sentAs' : 'prefix',
        },
        'Marker' : {
            'location' : 'urlPath',
                'sentAs' : 'marker',
        },
        'MaxKeys' : {
            'type' : 'number',
                'location' : 'urlPath',
                'sentAs' : 'max-keys',
        },
        'Delimiter' : {
            'location' : 'urlPath',
                'sentAs' : 'delimiter',
        },
        'EncodingType' : {
            'location' : 'urlPath',
                'sentAs' : 'encoding-type'
        },
    },
};
export const ListObjectsOutput = {
    'data' : {
        'type' : 'xml',
            'xmlRoot' : 'ListBucketResult',
    },
    'parameters' : {
        'Location' : {
            'location' : 'header',
                'sentAs' : 'bucket-location',
                'withPrefix' : true
        },
        'Bucket' : {
            'location' : 'xml',
                'sentAs' : 'Name',
        },
        'Delimiter' : {
            'decode' : true,
                'location' : 'xml',
                'sentAs' : 'Delimiter',
        },
        'IsTruncated' : {
            'location' : 'xml',
                'sentAs' : 'IsTruncated',
        },
        'Prefix' : {
            'decode' : true,
                'location' : 'xml',
                'sentAs' : 'Prefix',
        },
        'Marker' : {
            'decode' : true,
                'location' : 'xml',
                'sentAs' : 'Marker',
        },
        'NextMarker' : {
            'decode' : true,
                'location' : 'xml',
                'sentAs' : 'NextMarker',
        },
        'MaxKeys' : {
            'location' : 'xml',
                'sentAs' : 'MaxKeys',
        },
        'EncodingType' : {
            'location' : 'xml',
                'sentAs' : 'EncodingType',
        },
        'Contents' : {
            'type' : 'array',
                'location' : 'xml',
                'sentAs' : 'Contents',
                'items' : {
                'type' : 'object',
                    'parameters' : {
                    'Key' : {
                        'decode' : true,
                            'sentAs' : 'Key',
                    },
                    'LastModified' : {
                        'sentAs' : 'LastModified',
                    },
                    'ETag' : {
                        'sentAs' : 'ETag',
                    },
                    'Size' : {
                        'sentAs' : 'Size',
                    },
                    'Type' :{
                        'sentAs' : 'Type'
                    },
                    'StorageClass' : {
                        'sentAs' : 'StorageClass',
                    },
                    'Owner' : owner
                },
            },

        },
        'CommonPrefixes' : commonPrefixes
    },
};
export const ListVersions = {
    'httpMethod' : 'GET',
        'urlPath' : 'versions',
        'parameters' : {
        'Bucket' : {
            'required' : true,
                'location' : 'uri',
        },
        'Prefix' : {
            'location' : 'urlPath',
                'sentAs' : 'prefix',
        },
        'KeyMarker' : {
            'location' : 'urlPath',
                'sentAs' : 'key-marker',
        },
        'MaxKeys' : {
            'type' : 'number',
                'location' : 'urlPath',
                'sentAs' : 'max-keys',
        },
        'Delimiter' : {
            'location' : 'urlPath',
                'sentAs' : 'delimiter',
        },
        'VersionIdMarker' : {
            'location' : 'urlPath',
                'sentAs' : 'version-id-marker',
        },
        'EncodingType' : {
            'location' : 'urlPath',
                'sentAs' : 'encoding-type',
        },
    },
};
export const ListVersionsOutput = {
    'data' : {
        'type' : 'xml',
            'xmlRoot' : 'ListVersionsResult',
    },
    'parameters' : {
        'EncodingType' : {
            'location' : 'xml',
                'sentAs' : 'EncodingType',
        },
        'Location' : {
            'location' : 'header',
                'sentAs' : 'bucket-location',
                'withPrefix' : true
        },
        'Bucket' : {
            'location' : 'xml',
                'sentAs' : 'Name',
        },
        'Prefix' : {
            'decode' : true,
                'location' : 'xml',
                'sentAs' : 'Prefix',
        },
        'Delimiter' : {
            'decode' : true,
                'location' : 'xml',
                'sentAs' : 'Delimiter',
        },
        'KeyMarker' : {
            'decode' : true,
                'location' : 'xml',
                'sentAs' : 'KeyMarker',
        },
        'VersionIdMarker' : {
            'location' : 'xml',
                'sentAs' : 'VersionIdMarker',
        },
        'NextKeyMarker' : {
            'decode' : true,
                'location' : 'xml',
                'sentAs' : 'NextKeyMarker',
        },
        'NextVersionIdMarker' : {
            'location' : 'xml',
                'sentAs' : 'NextVersionIdMarker',
        },
        'MaxKeys' : {
            'location' : 'xml',
                'sentAs' : 'MaxKeys',
        },
        'IsTruncated' : {
            'location' : 'xml',
                'sentAs' : 'IsTruncated',
        },
        'Versions' : {
            'type' : 'array',
                'location' : 'xml',
                'sentAs' : 'Version',
                'items' : {
                'type' : 'object',
                    'parameters' : {
                    'Key' : {
                        'decode' : true,
                            'sentAs' : 'Key',
                    },
                    'VersionId' : {
                        'sentAs' : 'VersionId',
                    },
                    'IsLatest' : {
                        'sentAs' : 'IsLatest',
                    },
                    'LastModified' : {
                        'sentAs' : 'LastModified',
                    },
                    'ETag' : {
                        'sentAs' : 'ETag',
                    },
                    'Size' : {
                        'sentAs' : 'Size',
                    },
                    'Type' :{
                        'sentAs' : 'Type'
                    },
                    'Owner' : owner,
                        'StorageClass' : {
                        'sentAs' : 'StorageClass',
                    }
                }
            },
        },
        'DeleteMarkers' : {
            'type' : 'array',
                'location' : 'xml',
                'sentAs' : 'DeleteMarker',
                'items' : {
                'type' : 'object',
                    'parameters' : {
                    'Key' : {
                        'decode' : true,
                            'sentAs' : 'Key',
                    },
                    'VersionId' : {
                        'sentAs' : 'VersionId',
                    },
                    'IsLatest' : {
                        'sentAs' : 'IsLatest',
                    },
                    'LastModified' : {
                        'sentAs' : 'LastModified',
                    },
                    'Owner' : owner
                }
            },
        },
        'CommonPrefixes' : commonPrefixes
    },
};