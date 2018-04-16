const keys = {
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

    '*': value => [
        'sum',
        [
            'multiply',
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

export default keys;
