export const DeleteWorkflow = {
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
};
export const UpdateWorkflow = {
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
};
export const GetWorkflowList = {
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
};
export const GetWorkflowListOutput = {
    'data' : {
        'type' : 'body'
    },
    'parameters' : {
        'workflows' : {
            'location' : 'body'
        }
    }
};
export const GetWorkflowTemplateList = {
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
};
export const GetWorkflowTemplateListOutput = {
    'data' : {
        'type' : 'body'
    },
    'parameters' : {
        'templates' : {
            'location' : 'body'
        }
    }
};
export const GetWorkflowInstanceList = {
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
};
export const GetWorkflowInstanceListOutput = {
    'data' : {
        'type' : 'body'
    },
    'parameters' : {
        'instances' : {
            'location' : 'body'
        }
    }
};