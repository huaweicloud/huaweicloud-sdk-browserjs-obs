import {
	CDNNotifyConfiguration, 
	ObjectEncryptionRule, 
	CreateAuditPolicy, 
	CreateAuditPolicyOutput,
	GetAuditPolicy,
	GetAuditPolicyOutput,
	PutAuditPolicy,
	PutAuditPolicyOutPut,
	DeleteAuditPolicy,
	GetAuditResult,
	GetAuditResultOutput,
	lifecycleRule,
	ObjectLock,
} from './sharedModel';


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

const initiator = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'Initiator',
	'parameters' : {
		'ID' : {
			'sentAs' : 'ID',
		},
	},
};

const BackToSourceRules = {
	'sentAs' : 'BackToSourceRule',
	'required' : true,
	'location' : 'xml',
	'type': "array",
	'items': {
		'type': "object",
		'parameters': {
			'ID': {
				'sentAs': "ID"
			},
			'Condition': {
				'sentAs': "Condition",
				'type': "object",
				'parameters':{
					'ObjectKeyPrefixEquals': {
						'sentAs': 'ObjectKeyPrefixEquals'
					},
					'HttpErrorCodeReturnedEquals': {
						'sentAs': 'HttpErrorCodeReturnedEquals'
					}
				},
			},
			'Redirect': {
				'sentAs': "Redirect",
				'type': "object",
				'parameters': {
					'HttpRedirectCode': {
						'sentAs': 'HttpRedirectCode'
					},
					'SourceEndpoint': {
						'sentAs': 'SourceEndpoint'
					},
					'SourceBucketName': {
						'sentAs': 'SourceBucketName'
					},
					'ReplaceKeyWith': {
						'sentAs': 'ReplaceKeyWith'
					},
					'StaticUri': {
						'sentAs': 'StaticUri'
					},
					'ReplaceKeyPrefixWith': {
						'sentAs': 'ReplaceKeyPrefixWith'
					},
					'MigrationConfiguration': {
						'sentAs': 'MigrationConfiguration',
						'type': 'object',
						'parameters': {
							'Agency': {
								'sentAs': 'Agency',
							},
							'LogBucketName': {
								'sentAs': 'LogBucketName',
							},
							'PrivateBucketConfiguration': {
								'sentAs': 'PrivateBucketConfiguration',
								'type': 'object',
								'parameters': {
									'SourceStorageProvider': {
										'sentAs': 'SourceStorageProvider'
									},
									'SourceBucketAK': {
										'sentAs': 'SourceBucketAK'
									},
									'SourceBucketSK': {
										'sentAs': 'SourceBucketSK'
									},
									'SourceBucketZone': {
										'sentAs': 'SourceBucketZone'
									}
								}
							}
						}
					}
				}
			}
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

const grants = {
		'type' : 'array',
		'location' : 'xml',
		'wrapper' : 'AccessControlList',
		'sentAs' : 'Grant',
		'items' : {
			'type' : 'object',
			'parameters' : {
				'Grantee' : {
					'type' : 'object',
					'sentAs' : 'Grantee',
					'parameters' : {
						'Type' : {
							'type' : 'ignore',
						},
						'ID' : {
							'sentAs' : 'ID',
						  'notAllowEmpty' : true,
						},
						'URI' : {
							'sentAs' :  'Canned',
							'type' : 'adapter',
						  'notAllowEmpty' : true,
						}
					},
				},
				'Permission' : {
					'sentAs' : 'Permission',
				},
				'Delivered' :{
					'sentAs' : 'Delivered',
				}
			},
		},
	};

const loggingEnabled = {
		'type' : 'object',
		'location' : 'xml',
		'sentAs' : 'LoggingEnabled',
		'parameters' : {
			'TargetBucket' : {
				'sentAs' : 'TargetBucket',
			},
			'TargetPrefix' : {
				'sentAs' : 'TargetPrefix',
			},
			'TargetGrants' : {
				'type' : 'array',
				'wrapper' : 'TargetGrants',
				'sentAs' : 'Grant',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Grantee' : {
							'type' : 'object',
							'sentAs' : 'Grantee',
							'parameters' : {
								'Type' : {
									'type' : 'ignore',
								},
								'ID' : {
									'sentAs' : 'ID',
								},
								'URI' : {
									'sentAs' :  'Canned',
									'type' : 'adapter'
								}
							},
						},
						'Permission' : {
							'sentAs' : 'Permission',
						},
					},
				},
			},
		},
	};


const redirectAllRequestsTo = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'RedirectAllRequestsTo',
	'parameters' : {
		'HostName' : {
			'sentAs' : 'HostName',
		},
		'Protocol' : {
			'sentAs' : 'Protocol',
		},
	}
};

const routingRules = {
		'type' : 'array',
		'wrapper' : 'RoutingRules',
		'location' : 'xml',
		'sentAs' : 'RoutingRule',
		'items' : {
			'type' : 'object',
			'parameters' : {
				'Condition' : {
					'type' : 'object',
					'sentAs' : 'Condition',
					'parameters' : {
						'HttpErrorCodeReturnedEquals' : {
							'sentAs' : 'HttpErrorCodeReturnedEquals',
						},
						'KeyPrefixEquals' : {
							'sentAs' : 'KeyPrefixEquals',
						},
					},
				},
				'Redirect' : {
					'type' : 'object',
					'sentAs' : 'Redirect',
					'parameters' : {
						'HostName' : {
							'sentAs' : 'HostName',
						},
						'HttpRedirectCode' : {
							'sentAs' : 'HttpRedirectCode',
						},
						'Protocol' : {
							'sentAs' : 'Protocol',
						},
						'ReplaceKeyPrefixWith' : {
							'sentAs' : 'ReplaceKeyPrefixWith',
						},
						'ReplaceKeyWith' : {
							'sentAs' : 'ReplaceKeyWith',
						}
					}
				},
			},
		},
};

const indexDocument = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'IndexDocument',
	'parameters' : {
		'Suffix' : {
			'sentAs' : 'Suffix',
		},
	}
};

const errorDocument = {
	'type' : 'object',
	'location' : 'xml',
	'sentAs' : 'ErrorDocument',
	'parameters' : {
		'Key' : {
			'sentAs' : 'Key',
		},
	}
};

const corsRule = {
	'required' : true,
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'CORSRule',
	'items' : {
		'type' : 'object',
		'parameters' : {
			'ID' : {
				'sentAs' : 'ID',
			},
			'AllowedMethod' : {
				'type' : 'array',
				'sentAs' : 'AllowedMethod',
				'items' : {
					'type' : 'string',
				},
			},
			'AllowedOrigin' : {
				'type' : 'array',
				'sentAs' : 'AllowedOrigin',
				'items' : {
					'type' : 'string',
				},
			},
			'AllowedHeader' : {
				'type' : 'array',
				'sentAs' : 'AllowedHeader',
				'items' : {
					'type' : 'string',
				},
			},
			'MaxAgeSeconds' : {
				'type' : 'number',
				'sentAs' : 'MaxAgeSeconds',
			},
			'ExposeHeader' : {
				'type' : 'array',
				'sentAs' : 'ExposeHeader',
				'items' : {
					'type' : 'string',
				},
			},
		},
	},
};

const functionGraphConfiguration = {
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'FunctionGraphConfiguration',
	'items' : {
		'type' : 'object',
		'location' : 'xml',
		'parameters' : {
			'ID' : {
				'sentAs' : 'Id'
			},
			'Filter' : {
				'type' : 'object',
				'parameters' : {
					'FilterRules' : {
						'wrapper' : 'Object',
						'type' : 'array',
						'sentAs' : 'FilterRule',
						'items' : {
							'type' : 'object',
							'parameters' : {
								'Name' : {},
								'Value' : {}
							}
						}
					}
				}
			},
			'FunctionGraph' : {},

			'Event' : {
				'type' : 'array',
				'items' : {
					'type' : 'adapter',
				}
			}
		}
	}
};

const topicConfiguration = {
		'type' : 'array',
		'location' : 'xml',
		'sentAs' : 'TopicConfiguration',
		'items' : {
			'type' : 'object',
			'location' : 'xml',
			'parameters' : {
				'ID' : {
					'sentAs' : 'Id'
				},
				'Filter' : {
					'type' : 'object',
					'parameters' : {
						'FilterRules' : {
							'wrapper' : 'Object',
							'type' : 'array',
							'sentAs' : 'FilterRule',
							'items' : {
								'type' : 'object',
								'parameters' : {
									'Name' : {},
									'Value' : {}
								}
							}
						}
					}
				},
				'Topic' : {},

				'Event' : {
					'type' : 'array',
					'items' : {
						'type' : 'adapter'
					}
				}
			}
		}
};

const functionStageConfiguration = {
	'type' : 'array',
	'location' : 'xml',
	'sentAs' : 'FunctionStageConfiguration',
	'items' : {
		'type' : 'object',
		'location' : 'xml',
		'parameters' : {
			'ID' : {
				'sentAs' : 'Id'
			},
			'Filter' : {
				'type' : 'object',
				'parameters' : {
					'FilterRules' : {
						'wrapper' : 'Object',
						'type' : 'array',
						'sentAs' : 'FilterRule',
						'items' : {
							'type' : 'object',
							'parameters' : {
								'Name' : {},
								'Value' : {}
							}
						}
					}
				}
			},
			'FunctionStage' : {},
	
			'Event' : {
				'type' : 'array',
				'items' : {
					'type' : 'adapter',
				}
			}
		}
	}	
};

const tagSet = {
		'required' : true,
		'type' : 'array',
		'location' : 'xml',
		'wrapper' : 'TagSet',
		'sentAs' : 'Tag',
		'items' : {
			'type' : 'object',
			'parameters' : {
				'Key' : {
					'sentAs' : 'Key',
				},
				'Value' : {
					'sentAs' : 'Value',
				}
			}
		}
};
const replicationRules = {
		'required' : true,
		'type' : 'array',
		'location' : 'xml',
		'sentAs' : 'Rule',
		'items' : {
			'type' : 'object',
			'parameters' : {
				'ID' : {
					'sentAs' : 'ID',
				},
				'Prefix' : {
					'sentAs' : 'Prefix',
				},
				'Status' : {
					'sentAs' : 'Status',
				},
				'Destination' :{
					'type' : 'object',
					'sentAs' : 'Destination',
					'parameters' :{
						'Bucket' : {
							'sentAs' : 'Bucket',
							'type' : 'adapter'
						},
						'StorageClass' :{
							'sentAs' : 'StorageClass',
							'type' : 'adapter'
						},
						'DeleteData' :{
							'sentAs' : 'DeleteData',
							'type' : 'string'
						}
					}
				},
				'HistoricalObjectReplication': {
					'sentAs': 'HistoricalObjectReplication'
				}
			},
		}
	};
	const bucketEncryptionRule = {
		'type': 'object',
		'location': 'xml',
		'sentAs': 'Rule',
		'parameters': {
			'ApplyServerSideEncryptionByDefault': {
				'type': 'object',
				'sentAs': 'ApplyServerSideEncryptionByDefault',
				'parameters': {
					'SSEAlgorithm': {
						'sentAs': 'SSEAlgorithm'
					},
					'KMSMasterKeyID': {
						'sentAs': 'KMSMasterKeyID'
					},
					'ProjectID': {
						'sentAs': 'ProjectID'
					},
					'KMSDataEncryption': {
						'sentAs': 'KMSDataEncryption'
					}
				}
			}
		}
	};


	const InventoryConfiguration = {
		'type': 'object',
		'location': 'xml',
		'sentAs': 'InventoryConfiguration',
		'parameters': {
			'Id': {
				'sentAs': 'Id',

			},
			'IsEnabled': {
				'sentAs': 'IsEnabled',

			},
			'Filter': {
				'type': 'object',
				'sentAs': 'Filter',
				'parameters': {
					'Prefix': {
						'sentAs': 'Prefix'
					}
				}
			},
			'Destination': {
				'type': 'object',
				'sentAs': 'Destination',
				'parameters': {
					'Format': {
						'sentAs': 'Format'
					},
					'Bucket': {
						'sentAs': 'Bucket'
					},
					'Prefix': {
						'sentAs': 'Prefix'
					},
					'Encryption': {
						'type': 'object',
						'sentAs': 'Encryption',
						'parameters': {
							'SSE-KMS': {
								'type': 'object',
								'sentAs': 'SSE-KMS',
								'parameters': {
									'KeyId': {
										'sentAs': 'KeyId',
										'type': 'adapter'
									}
								}
							}
						}
					},
				}
			},
			'Schedule': {
				'type': 'object',
				'sentAs': 'Schedule',
				'parameters': {
					'Frequency': {
						'sentAs': 'Frequency'
					}
				}
			},
			'IncludedObjectVersions': {
				'sentAs': 'IncludedObjectVersions'
			},
			'OptionalFields': {
				'type': 'object',
				'location': 'xml',
				'sentAs': 'OptionalFields',
				'parameters': {
					'Field': {
						'type': 'array',
						'sentAs': 'Field',
						'items': {
							'type': 'string'
						}
					}
				}
			}
		}
	};
	

const operations = {

	'HeadBucket' : {
		'httpMethod' : 'HEAD',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},

	'HeadApiVersion' : {
		'httpMethod' : 'HEAD',
		'urlPath' : 'apiversion',
		'parameters' : {
			'Bucket' : {
				'location' : 'uri',
			},
		},
	},

	'HeadApiVersionOutput' : {
		'parameters' : {
			'ApiVersion' : {
				'location' : 'header',
				'sentAs' : 'x-obs-api'
			}
		}
	},

	'CreateBucket' : {
		'httpMethod' : 'PUT',
		'data' : {
			'xmlRoot' : 'CreateBucketConfiguration'
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
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
	},

	'GetBucketMetadata' : {
		'httpMethod' : 'HEAD',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Origin' : {
				'location' : 'header',
				'sentAs' : 'Origin'
			},

			'RequestHeader' : {
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers'
			}
		},
	},

	'GetBucketMetadataOutput' : {
		'parameters' : {
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true
			},
			'ObsVersion' : {
				'location' : 'header',
				'sentAs' : 'version',
				'withPrefix' : true
			},
			'Location' : {
				'location' : 'header',
				'sentAs' : 'bucket-location',
				'withPrefix' : true
			},
			'FileInterface': {
				'location': 'header',
				'sentAs': 'fs-file-interface',
				'withPrefix' : true
			},
			'Type':{
				'location' : 'header',
				'sentAs': 'bucket-type',
				'withPrefix': true
			},
			'MultiAz': {
				"location": 'header',
				'sentAs': 'az-redundancy',
				'withPrefix' : true
			},
			'Redundancy':{
				'location' : 'header',
				'sentAs' : 'bucket-redundancy',
				'withPrefix': true
			},
			'Cluster': {
				'location' : 'header',
				'sentAs' : 'location-clustergroup-id',
				'withPrefix': true
			},
			'MultiEnterprise': {
				'location': 'header',
				'sentAs': 'epid',
				'withPrefix' : true
			},
			'ClusterType': {
				"location": 'header',
				'sentAs': 'cluster-type',
				'withPrefix' : true
			},
			'IESLocation': {
				'location': 'header',
				'sentAs': 'ies-location',
				'withPrefix': true
			},
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin'
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age'
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers'
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods'
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers'
			}
		}
	},

	'DeleteBucket' : {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	"ListBuckets": {
		'httpMethod' : 'GET',
		"parameters": {
			"Type":{
				'sentAs': "x-obs-bucket-type",
				"location":"header"
			},
            "Location": {
                "sentAs": "location",
                "location":"header",
                "withPrefix": true
            }
		}
	},
	'ListBucketsOutput': {
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
	},

	'ListObjects' : {
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
	},

	'ListObjectsOutput' : {
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
	},

	'ListVersions' : {
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
	},

	'ListVersionsOutput' : {
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
	},

	'PutBackToSource': {
		'httpMethod' : 'PUT',
		'data' : {
			'xmlRoot' : 'BackToSourceConfiguration',
		},
		'urlPath' : 'backtosource',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'BackToSourceRules': BackToSourceRules,
			'ContentMD5': {
				'location' : 'header',
				'sentAs' : 'Content-MD5',
			}
		}
	},

	'DeleteBackToSource' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'backtosource',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},

	'GetBackToSource' : {
		'httpMethod' : 'GET',
		'urlPath' : 'backtosource',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},

	'GetBackToSourceOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'BackToSourceConfiguration',
		},
		'parameters' : {
			'BackToSourceRules' : BackToSourceRules
		},
	},

	'GetBucketLocation' : {
		'httpMethod' : 'GET',
		'urlPath' : 'location',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'GetBucketLocationOutput' : {
		'data' : {
			'type' : 'xml'
		},
		'parameters' : {
			'Location' : {
				'location' : 'xml',
				'sentAs' : 'Location',
			},
		},
	},

	'GetBucketStorageInfo' : {
		'httpMethod' : 'GET',
		'urlPath' : 'storageinfo',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

    'GetBucketStorageInfoOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'GetBucketStorageInfoResult',
		},
		'parameters' : {
			'Size' : {
				'location' : 'xml',
				'sentAs' : 'Size',
			},
			'ObjectNumber' : {
				'location' : 'xml',
				'sentAs' : 'ObjectNumber',
			},
            'StandardSize' : {
				'location' : 'xml',
				'sentAs' : 'StandardSize',
			},
			'StandardObjectNumber' : {
				'location' : 'xml',
				'sentAs' : 'StandardObjectNumber',
			},
            'WarmSize' : {
				'location' : 'xml',
				'sentAs' : 'WarmSize',
			},
			'WarmObjectNumber' : {
				'location' : 'xml',
				'sentAs' : 'WarmObjectNumber',
			},
            'ColdSize' : {
				'location' : 'xml',
				'sentAs' : 'ColdSize',
			},
			'ColdObjectNumber' : {
				'location' : 'xml',
				'sentAs' : 'ColdObjectNumber',
			},
            'DeepArchiveSize' : {
				'location' : 'xml',
				'sentAs' : 'DeepArchiveSize',
			},
			'DeepArchiveObjectNumber' : {
				'location' : 'xml',
				'sentAs' : 'DeepArchiveObjectNumber',
			},
            'HighPerformanceSize' : {
				'location' : 'xml',
				'sentAs' : 'HighPerformanceSize',
			},
			'HighPerformanceObjectNumber' : {
				'location' : 'xml',
				'sentAs' : 'HighPerformanceObjectNumber',
			},
		},
	},

	'SetBucketQuota' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'quota',
		'data' : {
			'xmlRoot' : 'Quota',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'StorageQuota' : {
				'required' : true,
				'location' : 'xml',
				'sentAs' : 'StorageQuota',
			},
		},
	},

	'GetBucketQuota' : {
		'httpMethod' : 'GET',
		'urlPath' : 'quota',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},

		},
	},
	'GetBucketQuotaOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'Quota',
		},
		'parameters' : {
			'StorageQuota' : {
				'location' : 'xml',
				'sentAs' : 'StorageQuota',
			},
		},
	},

	'SetBucketAcl' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'acl',
		'data' : {
			'xmlRoot' : 'AccessControlPolicy',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'Owner' : owner,
			'Grants' : grants
		},
	},

	'GetBucketInventory' : {
		'httpMethod' : 'GET',
		'urlPath' : 'inventory',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketInventoryOutput' : {
		'data': {
			'type': 'xml',
			'xmlRoot': 'ListInventoryConfiguration',

		},
		'parameters': {
			'Rules': {
				'type': 'array',
				'location': 'xml',
				'sentAs': 'InventoryConfiguration',
				'items': {
					'type': 'object',
					'parameters': {
						'Id': {
							'sentAs': 'Id',

						},
						'IsEnabled': {
							'sentAs': 'IsEnabled',

						},
						'Filter': {
							'type': 'object',
							'sentAs': 'Filter',
							'parameters': {
								'Prefix': {
									'sentAs': 'Prefix'
								}
							}
						},
						'Destination': {
							'type': 'object',
							'sentAs': 'Destination',
							'parameters': {
								'Format': {
									'sentAs': 'Format'
								},
								'Bucket': {
									'sentAs': 'Bucket'
								},
								'Prefix': {
									'sentAs': 'Prefix'
								}

							}
						},
						'Schedule': {
							'type': 'object',
							'sentAs': 'Schedule',
							'parameters': {
								'Frequency': {
									'sentAs': 'Frequency'
								}
							}
						},
						'IncludedObjectVersions': {
							'sentAs': 'IncludedObjectVersions'
						},
						'OptionalFields': {
							'type': 'object',
							'location': 'xml',
							'sentAs': 'OptionalFields',
							'parameters': {
								'Field': {
									'type': 'array',
									'sentAs': 'Field',
									'items':{
										'type': 'string'
									}
								}
							}
						},
						'LastExportTime':{
							'sentAs': 'LastExportTime',
						}
					},

				}
			},

		}
	},
	'SetBucketInventory': {
		'httpMethod': 'PUT',
		'urlPath': 'inventory',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri',

			},
			'Id': {
				'location': 'urlPath',
				'sentAs': 'id'
			},
			'InventoryConfiguration': InventoryConfiguration

		},
	},
	'SetBucketInventoryOutput': {
		'data': {
			'type': 'xml',
			'xmlRoot': 'InventoryConfiguration',

		},
		'parameters': {
			'InventoryConfiguration': InventoryConfiguration
		},
	},


	'DeleteBucketInventory': {
		'httpMethod': 'DELETE',
		'urlPath': 'inventory',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			},
			'Id': {
				'location': 'urlPath',
				'sentAs': 'id'
			}
		}
	},
	'DeleteBucketInventoryOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'InventoryConfiguration',
		},
		'parameters' : {
			'InventoryConfiguration' : InventoryConfiguration
		},
	},

	'GetBucketAcl' : {
		'httpMethod' : 'GET',
		'urlPath' : 'acl',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketAclOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'AccessControlPolicy',
		},
		'parameters' : {
			'Owner' : owner,
			'Grants' : grants
		}
	},

	'SetBucketLoggingConfiguration' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'logging',
		'data' : {
			'xmlRoot' : 'BucketLoggingStatus',
			'xmlAllowEmpty' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Agency' :{
				'location' : 'xml',
				'sentAs' : 'Agency',
			},
			'LoggingEnabled' : loggingEnabled,
		},
	},

	'GetBucketLoggingConfiguration' : {
		'httpMethod' : 'GET',
		'urlPath' : 'logging',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketLoggingConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'BucketLoggingStatus',
		},
		'parameters' : {
			'Agency' :{
				'location' : 'xml',
				'sentAs' : 'Agency'
			},
			'LoggingEnabled' : loggingEnabled,
		},
	},

	'SetSFSAcl' : {
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
	},
	'GetSFSAcl' : {
		'httpMethod' : 'GET',
		'urlPath' : 'sfsacl',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetSFSAclOutput' : {
		'data' : {
			'type' : 'body',
		},
		'parameters' : {
			'Policy' : {
				'location' : 'body',
			},
		},
	},
	'DeleteSFSAcl' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'sfsacl',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketPolicy' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'policy',
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
	},
	'GetBucketPolicy' : {
		'httpMethod' : 'GET',
		'urlPath' : 'policy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketPolicyOutput' : {
		'data' : {
			'type' : 'body',
		},
		'parameters' : {
			'Policy' : {
				'location' : 'body',
			},
		},
	},
	'DeleteBucketPolicy' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'policy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketDisPolicy': {
		'httpMethod': 'PUT',
		'urlPath' : 'disPolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'ApiPath': {
				'location': 'uri',
			},
			'Rules' : {
				'required' : true,
				'location' : 'body',
			},
		},
	},

	'GetBucketDisPolicy': {
		'httpMethod': 'GET',
		'urlPath' : 'disPolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'ApiPath': {
				'location': 'uri',
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			}
		}
	},

	'GetBucketDisPolicyOutput' : {
		'data' : {
			'type' : 'body',
		},
		'parameters' : {
			'Rules' : {
				'location' : 'body',
			},
		},
	},

	'DeleteBucketDisPolicy': {
		'httpMethod' : 'DELETE',
		'urlPath' : 'disPolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'ApiPath': {
				'location': 'uri',
			}
		},
	},

	'SetBucketLifecycleConfiguration' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'lifecycle',
		'data' : {
			'xmlRoot' : 'LifecycleConfiguration',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Rules' : lifecycleRule
		},
	},

	'GetBucketLifecycleConfiguration' : {
		'httpMethod' : 'GET',
		'urlPath' : 'lifecycle',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketLifecycleConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'LifecycleConfiguration',
		},
		'parameters' : {
			'Rules' : lifecycleRule
		},
	},
	'DeleteBucketLifecycleConfiguration' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'lifecycle',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketWebsiteConfiguration' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'website',
		'data' : {
			'xmlRoot' : 'WebsiteConfiguration',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'RedirectAllRequestsTo' : redirectAllRequestsTo,
			'IndexDocument' : indexDocument,
			'ErrorDocument' : errorDocument,
			'RoutingRules' : routingRules
		},
	},
	'GetBucketWebsiteConfiguration' : {
		'httpMethod' : 'GET',
		'urlPath' : 'website',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketWebsiteConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'WebsiteConfiguration',
		},
		'parameters' : {
			'RedirectAllRequestsTo' : redirectAllRequestsTo,
			'IndexDocument' : indexDocument,
			'ErrorDocument' : errorDocument,
			'RoutingRules' : routingRules,
		},
	},
	'DeleteBucketWebsiteConfiguration' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'website',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketVersioningConfiguration' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'versioning',
		'data' : {
			'xmlRoot' : 'VersioningConfiguration',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionStatus' : {
				'required' : true,
				'location' : 'xml',
				'sentAs' : 'Status',
			},
		},
	},
	'GetBucketVersioningConfiguration' : {
		'httpMethod' : 'GET',
		'urlPath' : 'versioning',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketVersioningConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'VersioningConfiguration',
		},
		'parameters' : {
			'VersionStatus' : {
				'location' : 'xml',
				'sentAs' : 'Status',
			},
		},
	},

	'SetBucketCors' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'cors',
		'data' : {
			'xmlRoot' : 'CORSConfiguration',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'CorsRules' : corsRule
		},
	},
	'GetBucketCors' : {
		'httpMethod' : 'GET',
		'urlPath' : 'cors',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetBucketCorsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CORSConfiguration',
		},
		'parameters' : {
			'CorsRules' : corsRule
		},
	},
	'DeleteBucketCors' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'cors',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},

	'SetBucketNotification' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'notification',
		'data' : {
			'xmlRoot' : 'NotificationConfiguration',
			'xmlAllowEmpty' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'TopicConfigurations' : topicConfiguration,
			'FunctionGraphConfigurations' : functionGraphConfiguration,
			'FunctionStageConfigurations': functionStageConfiguration
		}
	},

	'GetBucketNotification' : {
		'httpMethod' : 'GET',
		'urlPath' : 'notification',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketNotificationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'NotificationConfiguration',
		},
		'parameters' : {
			'RequestId' : {
				'location' : 'header',
				'sentAs' : 'x-obs-request-id',
			},
			'TopicConfigurations' : topicConfiguration,
			'FunctionGraphConfigurations' : functionGraphConfiguration,
			'FunctionStageConfigurations': functionStageConfiguration
		},
	},
	'GetBucketObjectLockConfiguration': {
		'httpMethod' : 'GET',
		'urlPath' : 'object-lock',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},
	'GetBucketObjectLockConfigurationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ObjectLockConfiguration',
		},
		'parameters' : {
			'Rule' : ObjectLock
		}
	},
	'SetBucketObjectLockConfig' : {
		'httpMethod' : 'PUT',
		'urlPath': 'object-lock',
		'data' : {
			'type' : 'xml',
			'xmlAllowEmpty' : true,
			'xmlRoot' : 'ObjectLockConfiguration',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Rule' : ObjectLock
		}
	},
	'SetBucketTagging' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'tagging',
		'data' : {
			'xmlRoot' : 'Tagging',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Tags' : tagSet
		}
	},

	'DeleteBucketTagging' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'tagging',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketTagging' : {
		'httpMethod' : 'GET',
		'urlPath' : 'tagging',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketTaggingOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'Tagging',
		},
		'parameters' : {
			'Tags' : tagSet
		}
	},

	'SetBucketStoragePolicy' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'storageClass',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'StorageClass' :{
				'required' : true,
				'location' : 'xml',
				'type' : 'adapter',
				'sentAs' : 'StorageClass'
			}
		}
	},

	'GetBucketStoragePolicy' :{
		'httpMethod' : 'GET',
		'urlPath' : 'storageClass',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketStoragePolicyOutput' :{
		'data' : {
			'type' : 'xml',
		},
		'parameters' : {
			'StorageClass' : {
				'location' : 'xml',
				'type' : 'string',
				'sentAs' : 'StorageClass'
			}
		}
	},

	'SetBucketReplication' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'replication',
		'data' : {
			'xmlRoot' : 'ReplicationConfiguration',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Agency' :{
				'location' : 'xml',
				'sentAs' : 'Agency'
			},
			'Rules' : replicationRules
		}
	},

	'GetBucketReplication' : {
		'httpMethod' : 'GET',
		'urlPath' : 'replication',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'GetBucketReplicationOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ReplicationConfiguration',
		},
		'parameters' : {
			'Agency' :{
				'location' : 'xml',
				'sentAs' : 'Agency'
			},
			'Rules' : replicationRules
		}
	},

	'DeleteBucketReplication' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'replication',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		}
	},

	'PutObject' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'ObjectLockMode': {
				'location' : 'header',
				'sentAs' : 'object-lock-mode',
				'withPrefix': true
			},
			'ObjectLockRetainUntailDate': {
				'location' : 'header',
				'sentAs' : 'object-lock-retain-until-date',
				'withPrefix': true
			},
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'ContentMD5' : {
				'location' : 'header',
				'sentAs' : 'Content-MD5',
			},
			'ContentSHA256' : {
				'location' : 'header',
				'sentAs' : 'content-sha256',
				'withPrefix' : true,
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'Offset' : {
				'type' : 'plain'
			},
			'ContentLength' :{
				'location' : 'header',
				'sentAs' : 'Content-Length',
				'type' : 'plain'
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true,
			},
			'CacheControl': {
				'location': 'header',
				'sentAs': 'Cache-Control'
			},
			'ContentDisposition': {
				'location': 'header',
				'sentAs': 'Content-Disposition',
				'encodingSafe': ' ;/?:@&=+$,"'
			},
			'ContentLanguage': {
				'location': 'header',
				'sentAs': 'Content-Language'
			},
			'ContentEncoding': {
				'location': 'header',
				'sentAs': 'Content-Encoding'
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true,
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires',
				'type' : 'number',
				'withPrefix' : true,
			},
			'SuccessActionRedirect':{
				'location' : 'header',
				'sentAs' : 'success-action-redirect'
			},
			...ObjectEncryptionRule,
			'Body' : {
				'location' : 'body',
			},
			'SourceFile' : {
				'type' : 'srcFile',
			},
			'ProgressCallback' : {
				'type' : 'plain'
			}
		},
	},
	'PutObjectOutput' : {
		'parameters' : {
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true,
			},
			'StorageClass' :{
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
			},
			...ObjectEncryptionRule,
		},
	},

	'AppendObject' : {
		'httpMethod' : 'POST',
		'urlPath' : 'append',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'Position' : {
				'location' : 'urlPath',
				'sentAs' : 'position',
				'type' : 'number'
			},
			'ContentMD5' : {
				'location' : 'header',
				'sentAs' : 'Content-MD5',
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'Offset' : {
				'type' : 'plain'
			},
			'ContentLength' :{
				'location' : 'header',
				'sentAs' : 'Content-Length',
				'type' : 'plain'
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true,
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true,
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires',
				'type' : 'number',
				'withPrefix' : true,
			},
			...ObjectEncryptionRule,
			'Body' : {
				'location' : 'body',
			},
			'SourceFile' : {
				'type' : 'srcFile',
			},
			'ProgressCallback' : {
				'type' : 'plain'
			}
		},
	},
	'AppendObjectOutput' : {
		'parameters' : {
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'NextPosition' : {
				'location' : 'header',
				'sentAs' : 'next-append-position',
				'withPrefix' : true,
			},
			'StorageClass' :{
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
			},
			...ObjectEncryptionRule,
		},
	},

	'GetObject' : {
		'httpMethod' : 'GET',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'ResponseCacheControl' : {
				'location' : 'urlPath',
				'sentAs' : 'response-cache-control',
			},
			'ResponseContentDisposition' : {
				'location' : 'urlPath',
				'sentAs' : 'response-content-disposition',
			},
			'ResponseContentEncoding' : {
				'location' : 'urlPath',
				'sentAs' : 'response-content-encoding',
			},
			'ResponseContentLanguage' : {
				'location' : 'urlPath',
				'sentAs' : 'response-content-language',
			},
			'ResponseContentType' : {
				'location' : 'urlPath',
				'sentAs' : 'response-content-type',
			},
			'ResponseExpires' : {
				'location' : 'urlPath',
				'sentAs' : 'response-expires',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'ImageProcess' : {
				'location' : 'urlPath',
				'sentAs' : 'x-image-process',
			},
			'IfMatch' : {
				'location' : 'header',
				'sentAs' : 'If-Match',
			},
			'IfModifiedSince' : {
				'location' : 'header',
				'sentAs' : 'If-Modified-Since',
			},
			'IfNoneMatch' : {
				'location' : 'header',
				'sentAs' : 'If-None-Match',
			},
			'IfUnmodifiedSince' : {
				'location' : 'header',
				'sentAs' : 'If-Unmodified-Since',
			},
			'Range' : {
				'location' : 'header',
				'sentAs' : 'Range',
			},
			'Origin' :{
				'location' : 'header',
				'sentAs' : 'Origin'
			},
			'RequestHeader' : {
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers'
			},
			'SaveByType' :{
				'type' : 'dstFile'
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'ProgressCallback' : {
				'type' : 'plain'
			}
		}
	},
	'GetObjectOutput' : {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'Content' : {
				'location' : 'body',
			},
			'Expiration' : {
				'location' : 'header',
				'sentAs' : 'expiration',
				'withPrefix' : true
			},
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			'CacheControl' : {
				'location' : 'header',
				'sentAs' : 'Cache-Control',
			},
			'ContentDisposition' : {
				'location' : 'header',
				'sentAs' : 'Content-Disposition',
			},
			'ContentEncoding' : {
				'location' : 'header',
				'sentAs' : 'Content-Encoding',
			},
			'ContentLanguage' : {
				'location' : 'header',
				'sentAs' : 'Content-Language',
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type',
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'Expires',
			},
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'ContentLength' : {
				'location' : 'header',
				'sentAs' : 'Content-Length',
			},
			'DeleteMarker' : {
				'location' : 'header',
				'sentAs' : 'delete-marker',
				'withPrefix' : true
			},
			'LastModified' : {
				'location' : 'header',
				'sentAs' : 'Last-Modified',
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true
			},
			'Restore' : {
				'location' : 'header',
				'sentAs' : 'restore',
				'withPrefix' : true
			},
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin'
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age'
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers'
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods'
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers'
			},
			...ObjectEncryptionRule,
			'Metadata' : {
				'location' : 'header',
				'type' : 'object',
				'sentAs' : 'meta-',
				'withPrefix' : true
			}
		},
	},
	'CopyObject' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'CopySource' : {
				'required' : true,
				'location' : 'header',
				'sentAs' : 'copy-source',
				'withPrefix' : true,
				'skipEncoding' : true
			},
			'CopySourceIfMatch' : {
				'location' : 'header',
				'sentAs' : 'copy-source-if-match',
				'withPrefix' : true
			},
			'CopySourceIfModifiedSince' : {
				'location' : 'header',
				'sentAs' : 'copy-source-if-modified-since',
				'withPrefix' : true
			},
			'CopySourceIfNoneMatch' : {
				'location' : 'header',
				'sentAs' : 'copy-source-if-none-match',
				'withPrefix' : true
			},
			'CopySourceIfUnmodifiedSince' : {
				'location' : 'header',
				'sentAs' : 'copy-source-if-unmodified-since',
				'withPrefix' : true
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			'ContentEncoding' : {
				'location' : 'header',
				'sentAs' : 'content-encoding'
			},
			'ContentLanguage' : {
				'location' : 'header',
				'sentAs' : 'content-language'
			},
			'ContentDisposition' : {
				'location' : 'header',
				'sentAs' : 'content-disposition'
			},
			'CacheControl' : {
				'location' : 'header',
				'sentAs' : 'cache-control'
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires'
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true
			},
			'MetadataDirective' : {
				'location' : 'header',
				'sentAs' : 'metadata-directive',
				'withPrefix' : true
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true
			},
			'SuccessActionRedirect':{
				'location' : 'header',
				'sentAs' : 'success-action-redirect'
			},
			...ObjectEncryptionRule,
			'CopySourceSseC' :{
				'location' : 'header',
				'sentAs' : 'copy-source-server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'CopySourceSseCKey' :{
				'location' : 'header',
				'sentAs' : 'copy-source-server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
		},
	},
	'CopyObjectOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CopyObjectResult',
		},
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'CopySourceVersionId' : {
				'location' : 'header',
				'sentAs' : 'copy-source-version-id',
				'withPrefix' : true
			},
			'ETag' : {
				'location' : 'xml',
				'sentAs' : 'ETag',
			},
			'LastModified' : {
				'location' : 'xml',
				'sentAs' : 'LastModified',
			},
			...ObjectEncryptionRule,
		},
	},

	'RestoreObject' : {
		'httpMethod' : 'POST',
		'urlPath' : 'restore',
		'data' : {
			'xmlRoot' : 'RestoreRequest',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'Days' : {
				'location' : 'xml',
				'sentAs' : 'Days'
			},
			'Tier' : {
				'wrapper' : 'RestoreJob',
				'location' : 'xml',
				'sentAs' : 'Tier',
			}
		}
	},

    'GetObjectMetadata': {
        'httpMethod': 'HEAD',
        'parameters': {
            'Bucket': {
                'required': true,
                'location': 'uri'
            },
            'Key': {
                'required': true,
                'location': 'uri'
            },
            'VersionId': {
                'location': 'urlPath',
                'sentAs': 'versionId'
            },
            'Origin': {
                'location': 'header',
                'sentAs': 'Origin'
            },
            'RequestHeader': {
                'location': 'header',
                'sentAs': 'Access-Control-Request-Headers'
            },
            'SseC': {
                'location': 'header',
                'sentAs': 'server-side-encryption-customer-algorithm',
                'withPrefix': true
            },
            'SseCKey': {
                'location': 'header',
                'sentAs': 'server-side-encryption-customer-key',
                'type': 'password',
                'withPrefix': true
            }
        }
    },
    'GetObjectMetadataOutput': {
        'parameters': {
			'ObjectLockMode': {
				'location': 'header',
                'sentAs': 'object-lock-mode',
                'withPrefix': true
			},
			'ObjectLockRetainUntilDate': {
				'location': 'header',
                'sentAs': 'object-lock-retain-until-date',
                'withPrefix': true
			},
            'Expiration': {
                'location': 'header',
                'sentAs': 'expiration',
                'withPrefix': true
            },
            'LastModified': {
                'location': 'header',
                'sentAs': 'Last-Modified'
            },
            'ContentLength': {
                'location': 'header',
                'sentAs': 'Content-Length'
            },
            'ContentType': {
                'location': 'header',
                'sentAs': 'Content-Type'
            },
            'ETag': {
                'location': 'header',
                'sentAs': 'etag'
            },
            'VersionId': {
                'location': 'header',
                'sentAs': 'version-id',
                'withPrefix': true
            },
            'WebsiteRedirectLocation': {
                'location': 'header',
                'sentAs': 'website-redirect-location',
                'withPrefix': true
            },
            'StorageClass': {
                'location': 'header',
                'sentAs': 'storage-class',
                'withPrefix': true
            },
            'Restore': {
                'location': 'header',
                'sentAs': 'restore',
                'withPrefix': true
            },
            'ObjectType': {
                'location': 'header',
                'sentAs': 'x-obs-object-type'
            },
            'NextPosition': {
                'location': 'header',
                'sentAs': 'x-obs-next-append-position'
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
			...ObjectEncryptionRule,
            'Metadata': {
                'location': 'header',
                'type': 'object',
                'sentAs': 'meta-',
                'withPrefix': true
            },
            'ContentLanguage': {
                'location': 'header',
                'sentAs': 'Content-Language'
            },
            'ContentEncoding': {
                'location': 'header',
                'sentAs': 'Content-Encoding'
            },
            'CacheControl': {
                'location': 'header',
				'sentAs': 'Cache-Control'
			},
			'ContentDisposition': {
				'location': 'header',
				'sentAs': 'Content-Disposition'
			},
			'Expires': {
				'location': 'header',
				'sentAs': 'Expires'
			},
			'ReplicationStatus': {
				'location': 'header',
				'sentAs': 'replication-status',
				'withPrefix': true
			}
        }
    },

    'SetObjectMetadata': {
        'httpMethod': 'PUT',
        'urlPath': 'metadata',
        'parameters': {
            'Bucket': {
                'required': true,
                'location': 'uri'
            },
            'Key': {
                'required': true,
                'location': 'uri'
            },
            'VersionId': {
                'location': 'urlPath',
                'sentAs': 'versionId'
            },
            'Origin': {
                'location': 'header',
                'sentAs': 'Origin'
            },
            'RequestHeader': {
                'location': 'header',
                'sentAs': 'Access-Control-Request-Headers'
            },
            'CacheControl': {
                'location': 'header',
                'sentAs': 'Cache-Control'
            },
            'ContentDisposition': {
                'location': 'header',
                'sentAs': 'Content-Disposition',
                'encodingSafe': ' ;/?:@&=+$,"'
            },
            'ContentLanguage': {
                'location': 'header',
                'sentAs': 'Content-Language'
            },
            'ContentEncoding': {
            	'location': 'header',
            	'sentAs': 'Content-Encoding'
            },
            'ContentType': {
                'location': 'header',
                'sentAs': 'Content-Type'
            },
            'Expires': {
                'location': 'header',
                'sentAs': 'Expires'
            },
            'Metadata': {
            	'shape': 'Sy',
				'location': 'header',
				'type': 'object',
            	'sentAs': 'meta-',
                'withPrefix': true
            },
            'MetadataDirective' : {
				'location' : 'header',
				'sentAs' : 'metadata-directive',
				'withPrefix' : true
			},
            'StorageClass': {
                'location': 'header',
                'sentAs': 'storage-class',
                'withPrefix': true
            },
            'WebsiteRedirectLocation': {
                'location': 'header',
                'sentAs': 'website-redirect-location',
                'withPrefix': true
            },
        }
    },
    'SetObjectMetadataOutput': {
        'parameters': {
            'Expires': {
                'location': 'header',
                'sentAs': 'Expires'
            },
            'ContentLength': {
                'location': 'header',
                'sentAs': 'Content-Length'
            },
            'ContentType': {
                'location': 'header',
                'sentAs': 'Content-Type'
            },
            'ContentLanguage': {
                'location': 'header',
                'sentAs': 'Content-Language'
            },
            'CacheControl': {
                'location': 'header',
                'sentAs': 'Cache-Control'
            },
            'ContentDisposition': {
                'location': 'header',
                'sentAs': 'Content-Disposition'
            },
            'WebsiteRedirectLocation': {
                'location': 'header',
                'sentAs': 'website-redirect-location',
                'withPrefix': true
            },
            'StorageClass': {
                'location': 'header',
                'sentAs': 'storage-class',
                'withPrefix': true,
                'type' : 'adapter'
            },
            'Metadata': {
                'location': 'header',
                'type': 'object',
                'sentAs': 'meta-',
                'withPrefix': true
            }
        }
    },


	'SetObjectAcl' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'acl',
		'data' : {
			'xmlRoot' : 'AccessControlPolicy',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'Delivered' :{
				'location' : 'xml',
				'sentAs' : 'Delivered'
			},
			'Owner' : owner,
			'Grants' : grants
		},
	},
	'SetObjectAclOutput' : {
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
		},
	},
	'SetObjectObjectLock' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'retention',
		'data' : {
			'xmlRoot' : 'Retention',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
			'Mode': {
				'sentAs': 'Mode',
				'location': 'xml'
			},
			'RetainUntilDate': {
				'sentAs': 'RetainUntilDate',
				'location': 'xml'
			},
		},
	},
	'GetObjectAcl' : {
		'httpMethod' : 'GET',
		'urlPath' : 'acl',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
		},
	},
	'GetObjectAclOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'AccessControlPolicy',
		},
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'Delivered' :{
				'location' : 'xml',
				'sentAs' : 'Delivered'
			},
			'Owner' : owner,
			'Grants' : grants
		},
	},
	'DeleteObject' : {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'VersionId' : {
				'location' : 'urlPath',
				'sentAs' : 'versionId',
			},
		},
	},
	'DeleteObjectOutput' : {
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'DeleteMarker' : {
				'location' : 'header',
				'sentAs' : 'delete-marker',
				'withPrefix' : true
			},
		},
	},
	'DeleteObjects' : {
		'httpMethod' : 'POST',
		'urlPath' : 'delete',
		'data' : {
			'xmlRoot' : 'Delete',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Quiet' : {
				'location' : 'xml',
				'sentAs' : 'Quiet',
			},
			'EncodingType' : {
				'location' : 'xml',
				'sentAs' : 'EncodingType',
			},
			'Objects' : {
				'required' : true,
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Object',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Key' : {
							'sentAs' : 'Key',
						},
						'VersionId' : {
							'sentAs' : 'VersionId',
						},
					},
				},
			},
		},
	},
	'DeleteObjectsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'DeleteResult',
		},
		'EncodingType' : {
			'location' : 'xml',
			'sentAs' : 'EncodingType',
		},
		'parameters' : {
			'Deleteds' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Deleted',
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
						'DeleteMarker' : {
							'sentAs' : 'DeleteMarker',
						},
						'DeleteMarkerVersionId' : {
							'sentAs' : 'DeleteMarkerVersionId',
						},
					}
				},
			},
			'Errors' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Error',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'Key' : {
							'sentAs' : 'Key',
						},
						'VersionId' : {
							'sentAs' : 'VersionId',
						},
						'Code' : {
							'sentAs' : 'Code',
						},
						'Message' : {
							'sentAs' : 'Message',
						},
					}
				},
			},
		},
	},

	'InitiateMultipartUpload' : {
		'httpMethod' : 'POST',
		'urlPath' : 'uploads',
		'parameters' : {
			'EncodingType' : {
				'location' : 'urlPath',
				'sentAs' : 'encoding-type',
			},
			'ObjectLockMode': {
				'location' : 'header',
				'sentAs' : 'object-lock-mode',
				'withPrefix': true
			},
			'ObjectLockRetainUntailDate': {
				'location' : 'header',
				'sentAs' : 'object-lock-retain-until-date',
				'withPrefix': true
			},
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'ACL' : {
				'location' : 'header',
				'sentAs' : 'acl',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'GrantRead' : {
				'location' : 'header',
				'sentAs' : 'grant-read',
				'withPrefix' : true,
			},
			'GrantReadAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-read-acp',
				'withPrefix' : true,
			},
			'GrantWriteAcp' : {
				'location' : 'header',
				'sentAs' : 'grant-write-acp',
				'withPrefix' : true,
			},
			'GrantFullControl' : {
				'location' : 'header',
				'sentAs' : 'grant-full-control',
				'withPrefix' : true,
			},
			'StorageClass' : {
				'location' : 'header',
				'sentAs' : 'storage-class',
				'withPrefix' : true,
				'type' : 'adapter'
			},
			'Metadata' : {
				'type' : 'object',
				'location' : 'header',
				'sentAs' : 'meta-',
				'withPrefix' : true
			},
			'WebsiteRedirectLocation' : {
				'location' : 'header',
				'sentAs' : 'website-redirect-location',
				'withPrefix' : true
			},
			'Expires' : {
				'location' : 'header',
				'sentAs' : 'expires',
				'type' : 'number',
				'withPrefix' : true
			},
			'ContentType' : {
				'location' : 'header',
				'sentAs' : 'Content-Type'
			},
			...ObjectEncryptionRule,
		},
	},
	'InitiateMultipartUploadOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'InitiateMultipartUploadResult',
		},
		'parameters' : {
			'EncodingType' : {
				'location' : 'xml',
				'sentAs' : 'EncodingType',
			},
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Bucket',
			},
			'Key' : {
				'location' : 'xml',
				'sentAs' : 'Key',
			},
			'UploadId' : {
				'location' : 'xml',
				'sentAs' : 'UploadId',
			},
			ObjectEncryptionRule,
		},
	},
	'ListMultipartUploads' : {
		'httpMethod' : 'GET',
		'urlPath' : 'uploads',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Delimiter' : {
				'location' : 'urlPath',
				'sentAs' : 'delimiter',
			},
			'KeyMarker' : {
				'location' : 'urlPath',
				'sentAs' : 'key-marker',
			},
			'MaxUploads' : {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'max-uploads',
			},
			'Prefix' : {
				'location' : 'urlPath',
				'sentAs' : 'prefix',
			},
			'UploadIdMarker' : {
				'location' : 'urlPath',
				'sentAs' : 'upload-id-marker',
			},
			'EncodingType' : {
				'location' : 'urlPath',
				'sentAs' : 'encoding-type',
			}
		},
	},
	'ListMultipartUploadsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ListMultipartUploadsResult',
		},
		'parameters' : {
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Bucket',
			},
			'KeyMarker' : {
				'decode' : true,
				'location' : 'xml',
				'sentAs' : 'KeyMarker',
			},
			'UploadIdMarker' : {
				'location' : 'xml',
				'sentAs' : 'UploadIdMarker',
			},
			'NextKeyMarker' : {
				'decode' : true,
				'location' : 'xml',
				'sentAs' : 'NextKeyMarker',
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
			'NextUploadIdMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextUploadIdMarker',
			},
			'MaxUploads' : {
				'location' : 'xml',
				'sentAs' : 'MaxUploads',
			},
			'IsTruncated' : {
				'location' : 'xml',
				'sentAs' : 'IsTruncated',
			},
			'EncodingType' : {
				'location' : 'xml',
				'sentAs' : 'EncodingType'
			},
			'Uploads' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Upload',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'UploadId' : {
							'sentAs' : 'UploadId',
						},
						'Key' : {
							'decode' : true,
							'sentAs' : 'Key',
						},
						'Initiated' : {
							'sentAs' : 'Initiated',
						},
						'StorageClass' : {
							'sentAs' : 'StorageClass',
						},
						'Owner' : owner,
						'Initiator' : initiator
					},
				},
			},
			'CommonPrefixes' : commonPrefixes
		},
	},
	'UploadPart' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'PartNumber' : {
				'required' : true,
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'partNumber',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'ContentMD5' : {
				'location' : 'header',
				'sentAs' : 'Content-MD5',
			},
			'ContentSHA256' : {
				'location' : 'header',
				'sentAs' : 'content-sha256',
				'withPrefix' : true,
			},
			'Body' : {
				'location' : 'body',
			},
			'SourceFile' : {
				'type' : 'srcFile',
			},
			'Offset' : {
				'type' : 'plain'
			},
			'PartSize' : {
				'type' : 'plain'
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseKmsProjectId' :{
				'location' : 'header',
				'sentAs': 'sse-kms-key-project-id',
				'withPrefix' : true,
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'ProgressCallback' : {
				'type' : 'plain'
			},
		},
	},
	'UploadPartOutput' : {
		'parameters' : {
			'ETag' : {
				'location' : 'header',
				'sentAs' : 'etag',
			},
			...ObjectEncryptionRule,
		},
	},
	'ListParts' : {
		'httpMethod' : 'GET',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'MaxParts' : {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'max-parts',
			},
			'PartNumberMarker' : {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'part-number-marker',
			},
			'EncodingType' : {
				'location' : 'urlPath',
				'sentAs' : 'encoding-type',
			}
		},
	},
	'ListPartsOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ListPartsResult',
		},
		'parameters' : {
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Bucket',
			},
			'Key' : {
				'decode' : true,
				'location' : 'xml',
				'sentAs' : 'Key',
			},
			'UploadId' : {
				'location' : 'xml',
				'sentAs' : 'UploadId',
			},
			'PartNumberMarker' : {
				'location' : 'xml',
				'sentAs' : 'PartNumberMarker',
			},
			'NextPartNumberMarker' : {
				'location' : 'xml',
				'sentAs' : 'NextPartNumberMarker',
			},
			'MaxParts' : {
				'location' : 'xml',
				'sentAs' : 'MaxParts',
			},
			'IsTruncated' : {
				'location' : 'xml',
				'sentAs' : 'IsTruncated',
			},
			'StorageClass' : {
				'location' : 'xml',
				'sentAs' : 'StorageClass',
			},
			'EncodingType' : {
				'location' : 'urlPath',
				'sentAs' : 'EncodingType',
			},
			'Initiator':initiator,
			'Owner' : owner,
			'Parts' : {
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Part',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'PartNumber' : {
							'sentAs' : 'PartNumber',
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
					},
				},
			}
		},
	},
	'CopyPart' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'PartNumber' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'partNumber',
				'type' : 'number',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'CopySource' : {
				'required' : true,
				'location' : 'header',
				'sentAs' : 'copy-source',
				'skipEncoding' : true,
				'withPrefix' : true
			},
			'CopySourceRange' : {
				'location' : 'header',
				'sentAs' : 'copy-source-range',
				'withPrefix' : true
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			},
			'CopySourceSseC' :{
				'location' : 'header',
				'sentAs' : 'copy-source-server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'CopySourceSseCKey' :{
				'location' : 'header',
				'sentAs' : 'copy-source-server-side-encryption-customer-key',
				'type' : 'password',
				'withPrefix' : true
			}
		},
	},
	'CopyPartOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CopyPartResult',
		},
		'parameters' : {
			'LastModified' : {
				'location' : 'xml',
				'sentAs' : 'LastModified',
			},
			'ETag' : {
				'location' : 'xml',
				'sentAs' : 'ETag',
			},
			...ObjectEncryptionRule,
		},
	},
	'AbortMultipartUpload' : {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
		},
	},

	'CompleteMultipartUpload' : {
		'httpMethod' : 'POST',
		'data' : {
			'xmlRoot' : 'CompleteMultipartUpload',
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'UploadId' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs' : 'uploadId',
			},
			'EncodingType' : {
				'location' : 'urlPath',
				'sentAs' : 'encoding-type',
			},
			...ObjectEncryptionRule,
			'Parts' : {
				'required' : true,
				'type' : 'array',
				'location' : 'xml',
				'sentAs' : 'Part',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'PartNumber' : {
							'sentAs' : 'PartNumber',
						},
						'ETag' : {
							'sentAs' : 'ETag',
						},
					},
				},
			},
			'Callback' :{
				'location' : 'header',
				'sentAs': 'callback',
				'withPrefix' : true,
				'type': 'callback',
				'parameters': {
					'CallbackUrl' : {
						'required' : true,
					},
					'CallbackBody' : {
						'required' : true,
					},
					'CallbackHost' : {},
					'CallbackBodyType' : {},
				}
			},
		},
	},
	'CompleteMultipartUploadOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CompleteMultipartUploadResult',
		},
		'parameters' : {
			'VersionId' : {
				'location' : 'header',
				'sentAs' : 'version-id',
				'withPrefix' : true
			},
			'Location' : {
				'location' : 'xml',
				'sentAs' : 'Location',
			},
			'EncodingType' : {
				'location' : 'xml',
				'sentAs' : 'EncodingType',
			},
			'Bucket' : {
				'location' : 'xml',
				'sentAs' : 'Bucket',
			},
			'Key' : {
				'decode' : true,
				'location' : 'xml',
				'sentAs' : 'Key',
			},
			'ETag' : {
				'location' : 'xml',
				'sentAs' : 'ETag',
			},
			'SseKms' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption',
				'withPrefix' : true
			},
			'SseKmsKey' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-kms-key-id',
				'withPrefix' : true
			},
			'SseKmsProjectId' :{
				'location' : 'header',
				'sentAs': 'sse-kms-key-project-id',
				'withPrefix' : true,
			},
			'SseC' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-algorithm',
				'withPrefix' : true
			},
			'SseCKeyMd5' :{
				'location' : 'header',
				'sentAs' : 'server-side-encryption-customer-key-MD5',
				'withPrefix' : true
			}
		},
		"CallbackResponse": {
			'location': 'body',
			'sentAs': 'CallbackResponseBody'
		}
	},
	'OptionsBucket' : {
		'httpMethod' : 'OPTIONS',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Origin' : {
				'required' : true,
				'location' : 'header',
				'sentAs' : 'Origin',
			},
			'AccessControlRequestMethods' : {
				'required' : true,
				'type' : 'array',
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Method',
				'items' : {
					'type' : 'string',
				},
			},
			'AccessControlRequestHeaders' : {
				'type' : 'array',
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers',
				'items' : {
					'type' : 'string',
				},
			},
		},
	},
	'OptionsBucketOutput' : {
		'parameters' : {
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin',
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers',
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods',
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers',
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age',
			},
		},
	},
	'OptionsObject' : {
		'httpMethod' : 'OPTIONS',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Key' : {
				'required' : true,
				'location' : 'uri',
			},
			'Origin' : {
				'required' : true,
				'location' : 'header',
				'sentAs' : 'Origin',
			},
			'AccessControlRequestMethods' : {
				'required' : true,
				'type' : 'array',
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Method',
				'items' : {
					'type' : 'string',
				},
			},
			'AccessControlRequestHeaders' : {
				'type' : 'array',
				'location' : 'header',
				'sentAs' : 'Access-Control-Request-Headers',
				'items' : {
					'type' : 'string',
				},
			},
		},
	},
	'OptionsObjectOutput' : {
		'parameters' : {
			'AllowOrigin' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-origin',
			},
			'AllowHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-headers',
			},
			'AllowMethod' : {
				'location' : 'header',
				'sentAs' : 'access-control-allow-methods',
			},
			'ExposeHeader' : {
				'location' : 'header',
				'sentAs' : 'access-control-expose-headers',
			},
			'MaxAgeSeconds' : {
				'location' : 'header',
				'sentAs' : 'access-control-max-age',
			},
		},
	},
	'GetBucketEncryption' : {
		'httpMethod' : 'GET',
		'urlPath' : 'encryption',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},
	'GetBucketEncryptionOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ServerSideEncryptionConfiguration'
		},
		'parameters' : {
			'Rule': bucketEncryptionRule
		}
	},
	'SetBucketEncryption': {
		'httpMethod' : 'PUT',
		'urlPath' : 'encryption',
		'data' : {
			'xmlRoot' : 'ServerSideEncryptionConfiguration'
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Rule' : bucketEncryptionRule
		}
	},
	'SetBucketEncryptionOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ServerSideEncryptionConfiguration'
		},
		'parameters' : {
			'Rule' : bucketEncryptionRule
		}
	},
	'DeleteBucketEncryption': {
		'httpMethod': 'DELETE',
		'urlPath': 'encryption',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			}
		}
	},
	'DeleteBucketEncryptionOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ServerSideEncryptionConfiguration'
		},
		'parameters' : {
			'Rule' : bucketEncryptionRule
		}
	},
	'GetBucketRequesterPay': {
		'httpMethod': 'GET',
		'urlPath': 'requestPayment',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			}
		}
	},
	'GetBucketRequesterPayOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'RequestPaymentConfiguration'
		},
		'parameters' : {
			'Payer' : {
				'location': 'xml',
				'sentAs': 'Payer',
			}
		}
	},
	'SetBucketRequesterPay': {
		'httpMethod' : 'PUT',
		'urlPath': 'requestPayment',
		'data' : {
			'xmlRoot' : 'RequestPaymentConfiguration'
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Payer' : {
				 'location': 'xml',
				 'sentAs': 'Payer'
			}
		}
	},
	'SetBucketRequesterPayOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'RequestPaymentConfiguration'
		},
		'parameters' : {
			'Payer' : {
				'location': 'xml',
				'sentAs': 'Payer',
			}
		}
	},

	'SetMirrorBackToSource': {
		'httpMethod': 'PUT',
		'urlPath': 'mirrorBackToSource',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'ApiPath': {
				'location': 'uri'
			},
			'Rules' : {
				'required' : true,
				'location' : 'body'
			},
		},
	},
	'SetMirrorBackToSourceOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'Rules' : {
				'location' : 'body'
			}
		}
	},
	'GetMirrorBackToSource': {
		'httpMethod': 'GET',
		'urlPath': 'mirrorBackToSource',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'ApiPath': {
				'location': 'uri'
			}
		}
	},
	'GetMirrorBackToSourceOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'Rules' : {
				'location' : 'body'
			}
		}
	},
	'DeleteMirrorBackToSource': {
		'httpMethod' : 'DELETE',
		'urlPath': 'mirrorBackToSource',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'ApiPath': {
				'location': 'uri'
			}
		}
	},
	'GetBucketDirectColdAccess': {
		'httpMethod' : 'GET',
		'urlPath': 'directcoldaccess',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},
	'GetBucketDirectColdAccessOutput' : {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'DirectColdAccessConfiguration'
		},
		'parameters' : {
			'Status' : {
				'location': 'xml',
				'sentAs': 'Status',
			}
		}
	},
	'SetBucketDirectColdAccess': {
		'httpMethod': 'PUT',
		'urlPath': 'directcoldaccess',
		'data': {
			'xmlRoot': 'DirectColdAccessConfiguration',
			'md5' : true
		},
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'Status': {
				'required': true,
				'location': 'xml',
				'sentAs': 'Status'
			}
		}
	},

	'SetBucketDirectColdAccessOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'DirectColdAccessConfiguration'
		},
		'parameters' : {
			'Status': {
				'location': 'xml',
				'sentAs': 'Status'
			}
		}
	},

	'DeleteBucketDirectColdAccess': {
		'httpMethod': 'DELETE',
		'urlPath': 'directcoldaccess',
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			}
		}
	},

	'DeleteBucketDirectColdAccessOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'DirectColdAccessConfiguration'
		},
		'parameters' : {
			'Status': {
				'location': 'xml',
				'sentAs': 'Status'
			}
		}
	},
	'GetBucketCustomDomain': {
		'httpMethod' : 'GET',
		'urlPath': 'customdomain',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},
	'GetBucketCustomDomainOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'ListBucketCustomDomainsResult'
		},
		'parameters' : {
			'Domains' : {
				'location': 'xml',
				'type': 'array',
				'sentAs': 'Domains',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'DomainName' : {
							'sentAs' : 'DomainName',
						},
						'Value' : {
							'sentAs' : 'CreateTime',
						}
					}
				}
			}
		}
	},
	'SetBucketCustomDomain': {
		'httpMethod': 'PUT',
		'parameters': {
			'Bucket': {
				'required' : true,
				'location' : 'uri'
			},
			'DomainName': {
				'location': 'urlPath',
				'sentAs': 'customdomain'
			}
		}
	},
	'DeleteBucketCustomDomain': {
		'httpMethod': 'DELETE',
		'parameters': {
			'Bucket': {
				'required' : true,
				'location' : 'uri'
			},
			'DomainName': {
				'location': 'urlPath',
				'sentAs': 'customdomain'
			}
		}
	},
	'GetCDNNotifyConfiguration': {
		'httpMethod': 'GET',
		'urlPath': 'CDNNotifyConfiguration',
		'parameters': {
			'Bucket': {
				'required' : true,
				'location' : 'uri'
			},
			'NotForwardTag': {
				'type': 'string',
				'sentAs': 'x-obs-not-forward-tag',
				'location': 'header'
			},
		}
	},
	'GetCDNNotifyConfigurationOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'CDNNotifyConfiguration'
		},
		'parameters' : {
			'Domain' : CDNNotifyConfiguration
		}
	},
	'SetCdnNotifyConfiguration': {
		'httpMethod': 'PUT',
		'urlPath': 'CDNNotifyConfiguration',
		'data' : {
			'xmlRoot' : 'CDNNotifyConfiguration',
			'xmlAllowEmpty' : true
		},
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri',

			},
			'NotForwardTag': {
				'type': 'string',
				'sentAs': 'x-obs-not-forward-tag',
				'location': 'header'
			},
			'Domain': CDNNotifyConfiguration
		},
	},
	'GetQuota': {
		'httpMethod': 'GET',
		'urlPath': 'quota',
	},
	'GetQuotaOutput': {
		'data' : {
			'type' : 'xml',
			'xmlRoot' : 'MaxBucketNumber',
		},
		'parameters' : {
			'Size' : {
				'location' : 'xml',
				'sentAs' : 'Number',
			}
		},
	},

	'GetWorkflowTrigger': {
		'httpMethod' : 'GET',
		'urlPath': 'obsworkflowtriggerpolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'ApiPath': {
				'location': 'uri'
			}
		}
	},
	'GetWorkflowTriggerOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'rules' : {
				'location' : 'body'
			}
		}
	},
	'DeleteWorkflowTrigger' : {
		'httpMethod' : 'DELETE',
		'urlPath': 'obsworkflowtriggerpolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'ApiPath': {
				'location': 'uri'
			}
		},
	},
	'CreateWorkflowTrigger' : {
		'httpMethod' : 'PUT',
		'urlPath': 'obsworkflowtriggerpolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
			'ApiPath': {
				'location': 'uri'
			},
			'Rule' : {
				'required' : true,
				'location' : 'body',
			},
		},
	},
	'RestoreFailedWorkflowExecution' : {
		'httpMethod' : 'PUT',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'required' : true,
				'location' : 'uri',
				'sentAs': 'execution_name'
			},
			'GraphName': {
				'required' : true,
				'location' : 'urlPath',
				'sentAs': 'x-workflow-graph-name'
			},
		},
	},
	'CreateTemplate' : {
		'httpMethod' : 'POST',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Template' : {
				'required' : true,
				'location' : 'body',
			}
		},
	},
	'CreateWorkflow' : {
		'httpMethod' : 'POST',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'required' : true,
				'location' : 'uri',
				'sentAs': 'graph_name'
			},
			'Workflow_create': {
				'location' : 'urlPath',
				'sentAs': 'x-workflow-create'
			},
			'Workflow' : {
				'required' : true,
				'location' : 'body',
			}
		}
	},
	CreateAuditPolicy,
	CreateAuditPolicyOutput,
	GetAuditPolicy,
	GetAuditPolicyOutput,
	PutAuditPolicy,
	PutAuditPolicyOutPut,
	DeleteAuditPolicy,
	GetAuditResult,
	GetAuditResultOutput,
	'DeleteWorkflow': {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'location' : 'uri',
				'sentAs': 'graph_name'
			}
		}
	},
	'UpdateWorkflow': {
		'httpMethod' : 'PUT',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'location' : 'uri',
				'sentAs': 'graph_name'
			},
			'Graph_name': {
				'required' : true,
				'location' : 'body'
			}
		}
	},
	'GetWorkflowList': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'location' : 'uri',
				'sentAs': 'graph_name_prefix'
			},
			'XObsLimit': {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-limit'
			},
			'XObsPrefix': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-prefix',
			},
			'XObsStart': {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-start'
			}
		}
	},
	'GetWorkflowListOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'workflows' : {
				'location' : 'body'
			}
		}
	},
	'GetWorkflowTemplateList': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'location' : 'uri',
				'sentAs': 'template_name_prefix'
			},
			'Start': {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-start'
			},
			'Limit': {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-limit'
			},
			'X-workflow-prefix': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-prefix',
			}
		}
	},
	'GetWorkflowTemplateListOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'templates' : {
				'location' : 'body'
			}
		}
	},
	'GetWorkflowInstanceList': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'location' : 'uri',
				'sentAs': 'execution_name_prefix'
			},
			'Start': {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-start'
			},
			'Limit': {
				'type' : 'number',
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-limit'
			},
			'Graph_name': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-graph-name'
			},
			'State': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-execution-state'
			},
			'X-workflow-prefix': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-prefix',
			}
		}
	},
	'GetWorkflowInstanceListOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'instances' : {
				'location' : 'body'
			}
		}
	},
	'DeleteTemplate': {
		'httpMethod': 'DELETE',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'location' : 'uri',
				'sentAs': 'template_name'
			}
		}
	},
	'GetActionTemplates': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'Other_parameter': {
				'location' : 'uri',
				'sentAs': 'template_name_prefix'
			},
			'XObsPrefix': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-prefix',
			},
			'XObsCategory': {
				'type' : 'String',
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-category'
			}
		}
	},
	'GetActionTemplatesOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'actions' : {
				'location' : 'body'
			}
		}
	},
	'GetWorkflowAuthorization': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			}
		}

	},
	'GetWorkflowAuthorizationOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'authorization' : {
				'location' : 'body'
			}
		}
	},
	'OpenWorkflowAuthorization': {
		'httpMethod' : 'POST',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			}
		}
	},
	
	'CreateOnlineDecom' : {
		'httpMethod' : 'PUT',
		'urlPath' : 'obscompresspolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
			'Decom' : {
				'required' : true,
				'location' : 'body',
			},
		},
	},
	'GetOnlineDecom' : {
		'httpMethod' : 'GET',
		'urlPath' : 'obscompresspolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetOnlineDecomOutput' : {
		'data' : {
			'type' : 'body',
		},
		'parameters' : {
			'Decom' : {
				'location' : 'body',
			},
		},
	},
	'DeleteOnlineDecom' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'obscompresspolicy',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri',
			},
		},
	},
	'GetPublicationTemplates': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name_prefix'
			},
			'XObsCategory': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-category'
			},
			'XObsOtatus': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-status',
			},
			'XObsPrefix': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-prefix'
			}
		}
	},
	'GetPublicationTemplatesOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'PublishedTemplates' : {
				'location' : 'body'
			}
		}
	},
	'GetPublicationTemplateDetail': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name'
			}
		}
	},
	'GetPublicationTemplateDetailOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'PublishTemplate' : {
				'location' : 'body'
			}
		}
	},
	'GetWorkflowAgreements': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'XWorkflowType' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs': 'x-workflow-type'
			}
		}

	},
	'GetWorkflowAgreementsOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'authorization' : {
				'location' : 'body'
			}
		}
	},
	'OpenWorkflowAgreements': {
		'httpMethod' : 'POST',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'XWorkflowType' : {
				'required' : true,
				'location' : 'urlPath',
				'sentAs': 'x-workflow-type'
			}
		}
	},
	'CreateMyActionTemplate' : {
		'httpMethod' : 'POST',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name'
			},
			'ActionTemplate' : {
				'required' : true,
				'location' : 'body',
			}
		}
	},
	'CreateMyActionTemplateOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'ActionTemplate' : {
				'location' : 'body'
			}
		}
	},
	'GetMyActionTemplates': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name_prefix'
			},
			'XObsCategory': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-category'
			},
			'XObsOtatus': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-status',
			},
			'XObsPrefix': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-prefix'
			}
		}
	},
	'GetMyActionTemplatesOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'ActionTemplates' : {
				'location' : 'body'
			}
		}
	},
	'GetMyactiontemplateDetail': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name'
			}
		}
	},
	'GetMyactiontemplateDetailOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'ActionTemplate' : {
				'location' : 'body'
			}
		}
	},
	'UpdateMyActionTemplate': {
		'httpMethod' : 'PUT',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name'
			},
			'ActionTemplate' : {
				'required' : true,
				'location' : 'body',
			}
		}
	},
	'UpdateMyActionTemplateOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'ActionTemplate' : {
				'location' : 'body'
			}
		}
	},
	'DeleteMyActionTemplate': {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name'
			}
		}
	},
	'ForbidMyActionTemplate': {
		'httpMethod' : 'DELETE',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name'
			},
			'XObsForbid': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-forbid'
			}
		}
	},
	'UpdatePublicActionTemplate': {
		'httpMethod' : 'PUT',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name'
			},
			'PublicAction' : {
				'required' : true,
				'location' : 'body',
			}
		}
	},
	'GetOmPublicActionTemplates': {
		'httpMethod' : 'GET',
		'parameters' : {
			'ApiPath': {
				'location': 'uri'
			},
			'OtherParameter': {
				'location' : 'uri',
				'sentAs': 'template_name_prefix'
			},
			'XObsCategory': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-category'
			},
			'XObsOtatus': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-status',
			},
			'XObsPrefix': {
				'location' : 'urlPath',
				'sentAs' : 'x-workflow-prefix'
			}
		}
	},
	'GetOmPublicActionTemplatesOutput': {
		'data' : {
			'type' : 'body'
		},
		'parameters' : {
			'Templates' : {
				'location' : 'body'
			}
		}
	},
	
	'SetBucketAlias': {
		'httpMethod': 'PUT',
		'urlPath' : 'obsbucketalias',
		'data': {
			'xmlRoot': 'CreateBucketAlias'
		},
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			},
			'BucketList': {
				'location': 'xml',
				'type': 'object',
				'sentAs': 'BucketList',
				'parameters': {
					'Bucket': {
						'location': 'xml',
						'type': 'array',
						'items': {
							'parameters': {
								'sentAs': 'Bucket'
							}
						}
					}
				}
			}
		}
	},
 
	'GetBucketAlias' : {
		'httpMethod' : 'GET',
		'urlPath' : 'obsalias',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},
 
	'GetBucketAliasOutput' : {
		'data': {
			'type': 'xml',
			'xmlRoot': 'AliasList'
		},
		'parameters': {
			'BucketAlias': {
				'location': 'xml',
				'type': "object",
				'sentAs': 'BucketAlias',
				'parameters': {
					'Alias': {
						'sentAs': 'Alias',
					},
					'BucketList': {
						'sentAs': 'Bucket',
						'location': 'xml',
						'type': 'array',
						'wrapper': 'BucketList',
						'items': {
							'type': 'string',
						}
					}
				},
			}
		}
	},
 
	'DeleteBucketAlias' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'obsbucketalias',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			}
		}
	},
 
	'BindBucketAlias': {
		'httpMethod': 'PUT',
		'urlPath': 'obsalias',
		'data': {
			'xmlRoot': 'AliasList'
		},
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			},
			'Alias': {
				'location' : 'xml',
				'type' : 'string',
				'sentAs': 'Alias',
			},
		}
	},
 
	'BindBucketAliasOutput': {
		'data': {
			'xmlRoot': 'AliasList'
		},
		'parameters': {
			'Bucket': {
				'required': true,
				'location': 'uri'
			},
			'Alias': {
				'location' : 'xml',
				'type' : 'string',
				'sentAs': 'Alias',
			},
		}
	},
	
	'UnbindBucketAlias' : {
		'httpMethod' : 'DELETE',
		'urlPath' : 'obsalias',
		'parameters' : {
			'Bucket' : {
				'required' : true,
				'location' : 'uri'
			},
		}
	},
 
	'ListBucketsAlias': {
		'httpMethod': 'GET',
		'urlPath': 'obsbucketalias',
	},
 
	'ListBucketsAliasOutput': {
		'data': {
			'type': 'xml',
			'xmlRoot': 'ListBucketAliasResult'
		},
		'parameters': {
			'BucketAliasList': {
				'location': 'xml',
				'sentAs': 'BucketAliasList',
				'type': 'object',
				'parameters': {
					'BucketAlias': {
						'location': 'xml',
						'type': 'array',
						'sentAs': 'BucketAlias',
						'items': {
							'type': 'object',
							'parameters': {
								'Alias': {
									'sentAs': 'Alias',
								},
								'CreationDate': {
									'sentAs': 'CreationDate',
								},
								'BucketList': {
									'location': 'xml',
									'type': 'object',
									'sentAs': 'BucketList',
									'parameters': {
										'Bucket': {
											'location': 'xml',
											'type': 'array',
											'items': {
												'parameters': {
													'sentAs': 'Bucket'
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}, 
			'Owner': {
				'location': 'xml',
				'sentAs': 'Owner',
				'type': 'object',
				'parameters': {
					'ID': {
						'sentAs': 'ID',
					}
				}
			}
		}
	},
};

export default operations;