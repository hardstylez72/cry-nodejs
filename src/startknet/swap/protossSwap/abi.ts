export const routerAbi = [
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
export const poolAbi = [
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
                "name": "from_",
                "type": "felt"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "Transfer",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "spender",
                "type": "felt"
            },
            {
                "name": "value",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "Approval",
        "type": "event"
    },
    {
        "name": "name",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "name",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "symbol",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "symbol",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "totalSupply",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "totalSupply",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "decimals",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "decimals",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "balanceOf",
        "type": "function",
        "inputs": [
            {
                "name": "account",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "balance",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "allowance",
        "type": "function",
        "inputs": [
            {
                "name": "owner",
                "type": "felt"
            },
            {
                "name": "spender",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "remaining",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "transfer",
        "type": "function",
        "inputs": [
            {
                "name": "recipient",
                "type": "felt"
            },
            {
                "name": "amount",
                "type": "Uint256"
            }
        ],
        "outputs": [
            {
                "name": "success",
                "type": "felt"
            }
        ]
    },
    {
        "name": "transferFrom",
        "type": "function",
        "inputs": [
            {
                "name": "sender",
                "type": "felt"
            },
            {
                "name": "recipient",
                "type": "felt"
            },
            {
                "name": "amount",
                "type": "Uint256"
            }
        ],
        "outputs": [
            {
                "name": "success",
                "type": "felt"
            }
        ]
    },
    {
        "name": "approve",
        "type": "function",
        "inputs": [
            {
                "name": "spender",
                "type": "felt"
            },
            {
                "name": "amount",
                "type": "Uint256"
            }
        ],
        "outputs": [
            {
                "name": "success",
                "type": "felt"
            }
        ]
    },
    {
        "name": "increaseAllowance",
        "type": "function",
        "inputs": [
            {
                "name": "spender",
                "type": "felt"
            },
            {
                "name": "added_value",
                "type": "Uint256"
            }
        ],
        "outputs": [
            {
                "name": "success",
                "type": "felt"
            }
        ]
    },
    {
        "name": "decreaseAllowance",
        "type": "function",
        "inputs": [
            {
                "name": "spender",
                "type": "felt"
            },
            {
                "name": "subtracted_value",
                "type": "Uint256"
            }
        ],
        "outputs": [
            {
                "name": "success",
                "type": "felt"
            }
        ]
    },
    {
        "data": [
            {
                "name": "sender",
                "type": "felt"
            },
            {
                "name": "amount0",
                "type": "Uint256"
            },
            {
                "name": "amount1",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "Mint",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "sender",
                "type": "felt"
            },
            {
                "name": "amount0",
                "type": "Uint256"
            },
            {
                "name": "amount1",
                "type": "Uint256"
            },
            {
                "name": "to",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "Burn",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "sender",
                "type": "felt"
            },
            {
                "name": "amount0In",
                "type": "Uint256"
            },
            {
                "name": "amount1In",
                "type": "Uint256"
            },
            {
                "name": "amount0Out",
                "type": "Uint256"
            },
            {
                "name": "amount1Out",
                "type": "Uint256"
            },
            {
                "name": "to",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "Swap",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "reserve0",
                "type": "felt"
            },
            {
                "name": "reserve1",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "Sync",
        "type": "event"
    },
    {
        "name": "constructor",
        "type": "constructor",
        "inputs": [],
        "outputs": []
    },
    {
        "name": "MINIMUM_LIQUIDITY",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "MINIMUM_LIQUIDITY",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
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
        "name": "token0",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "token0",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "token1",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "token1",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "blockTimestampLast",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "blockTimestampLast",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "price0CumulativeLast",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "price0CumulativeLast",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "price1CumulativeLast",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "price1CumulativeLast",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "kLast",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "kLast",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "getReserves",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "reserve0",
                "type": "felt"
            },
            {
                "name": "reserve1",
                "type": "felt"
            },
            {
                "name": "blockTimestampLast",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "initialize",
        "type": "function",
        "inputs": [
            {
                "name": "token0",
                "type": "felt"
            },
            {
                "name": "token1",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "mint",
        "type": "function",
        "inputs": [
            {
                "name": "to",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "liquidity",
                "type": "Uint256"
            }
        ]
    },
    {
        "name": "burn",
        "type": "function",
        "inputs": [
            {
                "name": "to",
                "type": "felt"
            }
        ],
        "outputs": [
            {
                "name": "amount0",
                "type": "Uint256"
            },
            {
                "name": "amount1",
                "type": "Uint256"
            }
        ]
    },
    {
        "name": "swap",
        "type": "function",
        "inputs": [
            {
                "name": "amount0Out",
                "type": "Uint256"
            },
            {
                "name": "amount1Out",
                "type": "Uint256"
            },
            {
                "name": "to",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "skim",
        "type": "function",
        "inputs": [
            {
                "name": "to",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "sync",
        "type": "function",
        "inputs": [],
        "outputs": []
    }
];