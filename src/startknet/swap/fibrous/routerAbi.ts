export const routerAbi =[
    {
        "name": "Swap",
        "size": 5,
        "type": "struct",
        "members": [
            {
                "name": "token_in",
                "type": "felt",
                "offset": 0
            },
            {
                "name": "token_out",
                "type": "felt",
                "offset": 1
            },
            {
                "name": "rate",
                "type": "felt",
                "offset": 2
            },
            {
                "name": "protocol",
                "type": "felt",
                "offset": 3
            },
            {
                "name": "pool_address",
                "type": "felt",
                "offset": 4
            }
        ]
    },
    {
        "name": "SwapParams",
        "size": 7,
        "type": "struct",
        "members": [
            {
                "name": "token_in",
                "type": "felt",
                "offset": 0
            },
            {
                "name": "token_out",
                "type": "felt",
                "offset": 1
            },
            {
                "name": "amount",
                "type": "Uint256",
                "offset": 2
            },
            {
                "name": "min_received",
                "type": "Uint256",
                "offset": 4
            },
            {
                "name": "destination",
                "type": "felt",
                "offset": 6
            }
        ]
    },
    {
        "name": "Uint256",
        "size": 2,
        "type": "struct",
        "members": [
            {
                "name": "low",
                "type": "felt",
                "offset": 0
            },
            {
                "name": "high",
                "type": "felt",
                "offset": 1
            }
        ]
    },
    {
        "data": [
            {
                "name": "previousOwner",
                "type": "felt"
            },
            {
                "name": "newOwner",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "name": "constructor",
        "type": "constructor",
        "inputs": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "stark_rocks_address",
                "type": "felt"
            },
            {
                "name": "direct_swap_fee",
                "type": "felt"
            },
            {
                "name": "router_fee",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "get_owner",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "owner",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "get_swap_handler",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "swap_handler",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "get_direct_swap_fee",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "direct_swap_fee",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "get_router_fee",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "router_fee",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "get_stark_rocks_address",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "stark_rocks_address",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "set_swap_handler",
        "type": "function",
        "inputs": [
            {
                "name": "new_handler",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "set_direct_swap_fee",
        "type": "function",
        "inputs": [
            {
                "name": "new_direct_swap_fee",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "set_router_fee",
        "type": "function",
        "inputs": [
            {
                "name": "new_router_fee",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "set_stark_rocks_address",
        "type": "function",
        "inputs": [
            {
                "name": "new_address",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "swap",
        "type": "function",
        "inputs": [
            {
                "name": "swaps_len",
                "type": "felt"
            },
            {
                "name": "swaps",
                "type": "Swap*"
            },
            {
                "name": "params",
                "type": "SwapParams"
            }
        ],
        "outputs": []
    },
    {
        "name": "claim",
        "type": "function",
        "inputs": [
            {
                "name": "token",
                "type": "felt"
            },
            {
                "name": "destination",
                "type": "felt"
            }
        ],
        "outputs": []
    }
];