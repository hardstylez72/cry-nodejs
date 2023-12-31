export const nostra_abi = [
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
        "data": [
            {
                "name": "currentOwner",
                "type": "felt"
            },
            {
                "name": "newOwner",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "OwnershipProposed",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "caller",
                "type": "felt"
            },
            {
                "name": "pending_owner",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "OwnershipProposalCancelled",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "asset",
                "type": "felt"
            },
            {
                "name": "index",
                "type": "felt"
            },
            {
                "name": "collateralToken",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "CollateralDataSetCollateralToken",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "asset",
                "type": "felt"
            },
            {
                "name": "newCount",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "CollateralDataSetCollateralTokensCount",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "asset",
                "type": "felt"
            },
            {
                "name": "oldValue",
                "type": "Uint256"
            },
            {
                "name": "newValue",
                "type": "Uint256"
            },
            {
                "name": "startTime",
                "type": "felt"
            },
            {
                "name": "endTime",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "CollateralDataCollateralFactorSet",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "asset",
                "type": "felt"
            },
            {
                "name": "priceOracle",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "CollateralDataSetPriceOracle",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "debtToken",
                "type": "felt"
            },
            {
                "name": "debtTier",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "DebtDataSetDebtTier",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "debtToken",
                "type": "felt"
            },
            {
                "name": "index",
                "type": "felt"
            },
            {
                "name": "collateralToken",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "DebtDataSetWhitelistItems",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "debtToken",
                "type": "felt"
            },
            {
                "name": "newCount",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "DebtDataSetCollateralWhitelistCount",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "debtToken",
                "type": "felt"
            },
            {
                "name": "oldValue",
                "type": "Uint256"
            },
            {
                "name": "newValue",
                "type": "Uint256"
            },
            {
                "name": "startTime",
                "type": "felt"
            },
            {
                "name": "endTime",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "DebtDataDebtFactorSet",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "debtToken",
                "type": "felt"
            },
            {
                "name": "priceOracle",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "DebtDataSetPriceOracle",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "asset",
                "type": "felt"
            },
            {
                "name": "protocolFee",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "LiquidationSettingsSetProtocolFee",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "asset",
                "type": "felt"
            },
            {
                "name": "protocolFeeRecipient",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "LiquidationSettingsSetProtocolFeeRecipient",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "asset",
                "type": "felt"
            },
            {
                "name": "liquidatorFeeBeta",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "LiquidationSettingsSetLiquidatorFeeBeta",
        "type": "event"
    },
    {
        "data": [
            {
                "name": "asset",
                "type": "felt"
            },
            {
                "name": "liquidatorFeeMax",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "LiquidationSettingsSetLiquidatorFeeMax",
        "type": "event"
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
        "data": [
            {
                "name": "user",
                "type": "felt"
            },
            {
                "name": "amount",
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
                "name": "user",
                "type": "felt"
            },
            {
                "name": "amount",
                "type": "Uint256"
            }
        ],
        "keys": [],
        "name": "Burn",
        "type": "event"
    },
    {
        "name": "cdpManager",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "cdpManager",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "underlyingAsset",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "underlyingAsset",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
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
        "name": "getTokenIndex",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "tokenIndex",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "isCollateral",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "res",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "getTotalSupplyCap",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "totalSupplyCap",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "isBurnable",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "isBurnable",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "owner",
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
        "name": "pendingOwner",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "pending_owner",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "getLimitMock",
        "type": "function",
        "inputs": [],
        "outputs": [
            {
                "name": "limitMock",
                "type": "felt"
            }
        ],
        "stateMutability": "view"
    },
    {
        "name": "constructor",
        "type": "constructor",
        "inputs": [
            {
                "name": "name",
                "type": "felt"
            },
            {
                "name": "symbol",
                "type": "felt"
            },
            {
                "name": "cdpManager",
                "type": "felt"
            },
            {
                "name": "underlyingAsset",
                "type": "felt"
            },
            {
                "name": "isCollateral",
                "type": "felt"
            },
            {
                "name": "owner",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "replaceClass",
        "type": "function",
        "inputs": [
            {
                "name": "class_hash",
                "type": "felt"
            }
        ],
        "outputs": []
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
        "name": "uncheckedTransferFrom",
        "type": "function",
        "inputs": [
            {
                "name": "from_",
                "type": "felt"
            },
            {
                "name": "to",
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
                "name": "addedValue",
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
                "name": "subtractedValue",
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
        "name": "approveAll",
        "type": "function",
        "inputs": [
            {
                "name": "callerSubAccount",
                "type": "felt"
            },
            {
                "name": "spender",
                "type": "felt"
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
        "name": "approveFromSubAccount",
        "type": "function",
        "inputs": [
            {
                "name": "callerSubAccount",
                "type": "felt"
            },
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
        "name": "increaseAllowanceFromSubAccount",
        "type": "function",
        "inputs": [
            {
                "name": "callerSubAccount",
                "type": "felt"
            },
            {
                "name": "spender",
                "type": "felt"
            },
            {
                "name": "addedValue",
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
        "name": "decreaseAllowanceFromSubAccount",
        "type": "function",
        "inputs": [
            {
                "name": "callerSubAccount",
                "type": "felt"
            },
            {
                "name": "spender",
                "type": "felt"
            },
            {
                "name": "subtractedValue",
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
        "name": "mint",
        "type": "function",
        "inputs": [
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "amount",
                "type": "Uint256"
            }
        ],
        "outputs": []
    },
    {
        "name": "burn",
        "type": "function",
        "inputs": [
            {
                "name": "burnFrom",
                "type": "felt"
            },
            {
                "name": "to",
                "type": "felt"
            },
            {
                "name": "amount",
                "type": "Uint256"
            }
        ],
        "outputs": [
            {
                "name": "actualAmountBurned",
                "type": "Uint256"
            }
        ]
    },
    {
        "name": "setTotalSupplyCap",
        "type": "function",
        "inputs": [
            {
                "name": "totalSupplyCap",
                "type": "Uint256"
            }
        ],
        "outputs": []
    },
    {
        "name": "setIsBurnable",
        "type": "function",
        "inputs": [
            {
                "name": "isBurnable",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "transferOwnership",
        "type": "function",
        "inputs": [
            {
                "name": "pendingOwner",
                "type": "felt"
            }
        ],
        "outputs": []
    },
    {
        "name": "acceptOwnership",
        "type": "function",
        "inputs": [],
        "outputs": []
    },
    {
        "name": "cancelOwnershipProposal",
        "type": "function",
        "inputs": [],
        "outputs": []
    },
    {
        "name": "setLimitMock",
        "type": "function",
        "inputs": [
            {
                "name": "limitMock",
                "type": "felt"
            }
        ],
        "outputs": []
    }
]