const _keys = {
    '*': value => [
        'sum',
        [
            'multiply',
            value
        ]
    ],

    '+': value => [
        'sum',
        [
            'add',
            value
        ]
    ],

    '-': value => [
        'sum',
        [
            'subtract',
            value
        ]
    ],

    '/': value => [
        'sum',
        [
            'divide',
            value
        ]
    ],

    b: value => [
        [
            'bestOf',
            value
        ],
        'sum'
    ],

    w: value => [
        [
            'worstOf',
            value
        ],
        'sum'
    ]
};

export default _keys;
