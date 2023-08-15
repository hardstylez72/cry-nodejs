export const abi = [
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
        "name": "constructor",
        "type": "constructor",
        "inputs": [
            {
                "name": "factory",
                "type": "felt"
            },
            {
                "name": "pairClass",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "factory",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "factory",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "quote",
        "type": "function",
        "inputs": [
            {
                "name": "amountA",
                "type": "Uint256"
            },
            {
                "name": "reserveA",
                "type": "felt"
            },
            {
                "name": "reserveB",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "amountB",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "getAmountOut",
        "type": "function",
        "inputs": [
            {
                "name": "amountIn",
                "type": "Uint256"
            },
            {
                "name": "reserveIn",
                "type": "felt"
            },
            {
                "name": "reserveOut",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "amountOut",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "getAmountIn",
        "type": "function",
        "inputs": [
            {
                "name": "amountOut",
                "type": "Uint256"
            },
            {
                "name": "reserveIn",
                "type": "felt"
            },
            {
                "name": "reserveOut",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "amountIn",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "getAmountsOut",
        "type": "function",
        "inputs": [
            {
                "name": "amountIn",
                "type": "Uint256"
            },
            {
                "name": "path_len",
                "type": "felt"
            },
            {
                "name": "path",
                "type": "felt*"
            }
        ],
        "outputs": [
            {
                "name": "amounts_len",
                "type": "felt"
            },
            {
                "name": "amounts",
                "type": "Uint256*"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "getAmountsIn",
        "type": "function",
        "inputs": [
            {
                "name": "amountOut",
                "type": "Uint256"
            },
            {
                "name": "path_len",
                "type": "felt"
            },
            {
                "name": "path",
                "type": "felt*"
            }
        ],
        "outputs": [
            {
                "name": "amounts_len",
                "type": "felt"
            },
            {
                "name": "amounts",
                "type": "Uint256*"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "addLiquidity",
        "type": "function",
        "inputs": [
            {
                "name": "tokenA",
                "type": "felt"
            },
            {
                "name": "tokenB",
                "type": "felt"
            },
            {
                "name": "amountADesired",
                "type": "Uint256"
            },
            {
                "name": "amountBDesired",
                "type": "Uint256"
            },
            {
                "name": "amountAMin",
                "type": "Uint256"
            },
            {
                "name": "amountBMin",
                "type": "Uint256"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "deadline",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "amountA",
                "type": "Uint256"
            },
            {
                "name": "amountB",
                "type": "Uint256"
            },
            {
                "name": "liquidity",
                "type": "Uint256"
            }
        ]
    },
    {
        "name": "removeLiquidity",
        "type": "function",
        "inputs": [
            {
                "name": "tokenA",
                "type": "felt"
            },
            {
                "name": "tokenB",
                "type": "felt"
            },
            {
                "name": "liquidity",
                "type": "Uint256"
            },
            {
                "name": "amountAMin",
                "type": "Uint256"
            },
            {
                "name": "amountBMin",
                "type": "Uint256"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "deadline",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "amountA",
                "type": "Uint256"
            },
            {
                "name": "amountB",
                "type": "Uint256"
            }
        ]
    },
    {
        "name": "swapExactTokensForTokens",
        "type": "function",
        "inputs": [
            {
                "name": "amountIn",
                "type": "Uint256"
            },
            {
                "name": "amountOutMin",
                "type": "Uint256"
            },
            {
                "name": "path_len",
                "type": "felt"
            },
            {
                "name": "path",
                "type": "felt*"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "deadline",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "amounts_len",
                "type": "felt"
            },
            {
                "name": "amounts",
                "type": "Uint256*"
            }
        ]
    },
    {
        "name": "swapTokensForExactTokens",
        "type": "function",
        "inputs": [
            {
                "name": "amountOut",
                "type": "Uint256"
            },
            {
                "name": "amountInMax",
                "type": "Uint256"
            },
            {
                "name": "path_len",
                "type": "felt"
            },
            {
                "name": "path",
                "type": "felt*"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "deadline",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "amounts_len",
                "type": "felt"
            },
            {
                "name": "amounts",
                "type": "Uint256*"
            }
        ]
    },
    {
        "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        "type": "function",
        "inputs": [
            {
                "name": "amountIn",
                "type": "Uint256"
            },
            {
                "name": "amountOutMin",
                "type": "Uint256"
            },
            {
                "name": "path_len",
                "type": "felt"
            },
            {
                "name": "path",
                "type": "felt*"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "deadline",
                "type": "felt"
            }
        ],
        "outputs": []
    }
];