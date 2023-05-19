export const CDNNotifyConfiguration = {
    'location': 'xml',
    'sentAs': 'Domain',
    'type': 'array',
    'items': {
        'type': 'object',
        'parameters': {
            'Name': {
                'type': 'string',
                'sentAs': 'Name'
            },
            'Action': {
                'type': 'string',
                'sentAs': 'Action'
            },
            'Status': {
                'type': 'string',
                'sentAs': 'Status'
            },
            'Agency': {
                'type': 'string',
                'sentAs': 'Agency'
            },
            'Filter': {
                'type': 'object',
                'sentAs': 'Filter',
                'parameters': {
                    'Object': {
                        'type': 'object',
                        'sentAs': 'Object',
                        'parameters': {
                            'FilterRule': {
                                'type': 'array',
                                'sentAs': 'FilterRule',
                                'items': {
                                    'type': 'object',
                                    'parameters': {
                                        'Name': {
                                            'type': 'string',
                                            'sentAs': 'Name'
                                        },
                                        'Value': {
                                            'type': 'string',
                                            'sentAs': 'Value'
                                        },
                                    }
                                }
                            }
                        }
                    }

                }
            },
            'Events': {
                'type': 'array',
                'items': {
                    'type': 'adapter',
                },
                'sentAs': 'Event'

            }
        }
    }
};


export const ObjectEncryptionRule = {
    'SseKms' :{
        'location' : 'header',
        'sentAs' : 'server-side-encryption',
        'withPrefix' : true,
        'type' : 'adapter'
    },
    'SseMode' :{
        'location' : 'header',
        'sentAs' : 'server-side-encryption',
        'withPrefix' : true,
        'type' : 'adapter'
    },
    'SseAlgorithm': {
        'location' : 'header',
        'sentAs' : 'server-side-data-encryption',
        'withPrefix' : true,
    },
    'SseKmsKey' :{
        'location' : 'header',
        'sentAs' : 'server-side-encryption-kms-key-id',
        'withPrefix' : true,
    },
    'SseKmsProjectId' :{
        'location' : 'header',
        'sentAs': 'sse-kms-key-project-id',
        'withPrefix' : true,
    },
    'SseC' :{
        'location' : 'header',
        'sentAs' : 'server-side-encryption-customer-algorithm',
        'withPrefix' : true,
    },
    'SseCKey' :{
        'location' : 'header',
        'sentAs' : 'server-side-encryption-customer-key',
        'type' : 'password',
        'withPrefix' : true,
    },
    'SseCKeyMd5' :{
        'location' : 'header',
        'sentAs' : 'server-side-encryption-customer-key-MD5',
        'withPrefix' : true
    }
}

export const CreateAuditPolicy = {
    'httpMethod' : 'POST',
    'parameters' : {
        'ApiPath': {
            'location': 'uri'
        },
        'CreateReviewTask': {
            'required' : true,
            'location': 'body'
        }
    }
}

export const CreateAuditPolicyOutput = {
    'data' : {
        'type' : 'body'
    },
    'parameters' : {
        'CreateReviewTask' : {
            'location' : 'body'
        }
    }
}
export const GetAuditPolicy = {
    'httpMethod' : 'GET',
    'parameters' : {
        'ApiPath': {
            'location': 'uri'
        }
    }
}
export const GetAuditPolicyOutput = {
    'data' : {
        'type' : 'body'
    },
    'parameters' : {
        'result' : {
            'location' : 'body'
        }
    }
}
export const PutAuditPolicy = {
    'httpMethod' : 'PUT',
    'parameters' : {
        'ApiPath': {
            'location': 'uri'
        },
        'CreateReviewTask': {
            'required' : true,
            'location': 'body'
        }
    }
}
export const PutAuditPolicyOutPut = {
    'data' : {
        'type' : 'body'
    },
    'parameters' : {
        'CreateReviewTask' : {
            'location' : 'body'
        }
    }
}
export const DeleteAuditPolicy = {
    'httpMethod' : 'DELETE',
    'parameters' : {
        'ApiPath': {
            'location': 'uri'
        },
        'Other_parameter': {
            'location' : 'uri',
            'sentAs': 'task_name'
        }
    }
}
export const GetAuditResult = {
    'httpMethod' : 'GET',
    'parameters' : {
        'ApiPath': {
            'location': 'uri'
        },
        'Type': {
            'location': 'urlPath',
            'sentAs' : 'type'
        },
        'Limit': {
            'type' : 'number',
            'location' : 'urlPath',
            'sentAs' : 'limit'
        },
        'Offset': {
            'type' : 'number',
            'location' : 'urlPath',
            'sentAs' : 'offset'
        }
    }
}
export const GetAuditResultOutput = {
    'data' : {
        'type' : 'body'
    },
    'parameters' : {
        'result' : {
            'location' : 'body'
        }
    }
}


export const lifecycleRule = {
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
            'Filter': {
                'type': 'object',
                'sentAs': 'Filter',
                'parameters': {
                    // 即使array中仅有一条记录也可以使用And属性
                    'And': {
                        'type': 'object',
                        'sentAs': 'And',
                        'parameters': {
                            'Prefix': {
                                'sentAs': 'Prefix'
                            },
                            'Tag': {
                                'type': 'array',
                                'sentAs': 'Tag',
                                'items': {
                                    'type': 'object',
                                    'location': 'xml',
                                    'sentAs': 'Tag',
                                    'parameters': {
                                        'Key': {
                                            'sentAs': 'Key'
                                        },
                                        'Value': {
                                            'sentAs': 'Value'
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            },
			'Transitions' : {
				'type' : 'array',
				'sentAs' : 'Transition',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'StorageClass' :{
							'sentAs' : 'StorageClass',
							'type' : 'adapter'
						},
						'Date' : {
							'sentAs' : 'Date',
						},
						'Days' : {
							'type' : 'number',
							'sentAs' : 'Days'
						}
					}
				}
			},
			'Expiration' : {
				'type' : 'object',
				'sentAs' : 'Expiration',
				'parameters' : {
					'Date' : {
						'sentAs' : 'Date',
					},
					'Days' : {
						'type' : 'number',
						'sentAs' : 'Days'
					},
				},
			},
            'AbortIncompleteMultipartUpload' : {
                'type' : 'object',
                'sentAs' : 'AbortIncompleteMultipartUpload',
                'parameters' : {
                    'DaysAfterInitiation' : {
                        'type' : 'number',
                        'sentAs' : 'DaysAfterInitiation',
                    },
                },
            },
			'NoncurrentVersionTransitions' :{
				'type' : 'array',
				'sentAs' : 'NoncurrentVersionTransition',
				'items' : {
					'type' : 'object',
					'parameters' : {
						'StorageClass' :{
							'sentAs' : 'StorageClass',
							'type' : 'adapter'
						},
						'NoncurrentDays' : {
							'type' : 'number',
							'sentAs' : 'NoncurrentDays'
						}
					}
				}
			},
			'NoncurrentVersionExpiration' : {
				'type' : 'object',
				'sentAs' : 'NoncurrentVersionExpiration',
				'parameters' : {
					'NoncurrentDays' : {
						'type' : 'number',
						'sentAs' : 'NoncurrentDays',
					},
				},
			}
		},
	},
};
export const ObjectLock = {
	'location' : 'xml',
	'type': 'object',
	'parameters': {
		'DefaultRetention': {
			'type': 'object',
			'sentAs': 'DefaultRetention',
			'parameters': {
				'Days': {
					'sentAs': 'Days'
				},
				'Years': {
					'sentAs': 'Years'
				},
				'Mode': {
					'sentAs': 'Mode'
				}
			}
		}
		
	}
}