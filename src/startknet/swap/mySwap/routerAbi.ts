export const routerAbi = [
    {
        "members": [
            {
                "name": "low",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "high",
                "offset": 1,
                "type": "felt"
            }
        ],
        "name": "Uint256",
        "size": 2,
        "type": "struct"
    },
    {
        "members": [
            {
                "name": "name",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "token_a_address",
                "offset": 1,
                "type": "felt"
            },
            {
                "name": "token_a_reserves",
                "offset": 2,
                "type": "Uint256"
            },
            {
                "name": "token_b_address",
                "offset": 4,
                "type": "felt"
            },
            {
                "name": "token_b_reserves",
                "offset": 5,
                "type": "Uint256"
            },
            {
                "name": "fee_percentage",
                "offset": 7,
                "type": "felt"
            },
            {
                "name": "cfmm_type",
                "offset": 8,
                "type": "felt"
            },
            {
                "name": "liq_token",
                "offset": 9,
                "type": "felt"
            }
        ],
        "name": "Pool",
        "size": 10,
        "type": "struct"
    },
    {
        "inputs": [
            {
                "name": "pool_id",
                "type": "felt"
            }
        ],
        "name": "get_pool",
        "outputs": [
            {
                "name": "pool",
                "type": "Pool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {
                "name": "pool_id",
                "type": "felt"
            }
        ],
        "name": "get_total_shares",
        "outputs": [
            {
                "name": "total_shares",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
];