export const routerAbi = [
    {
        "name": "core::bool",
        "type": "enum",
        "variants": [
            {
                "name": "False",
                "type": "()"
            },
            {
                "name": "True",
                "type": "()"
            }
        ]
    },
    {
        "name": "ekubo::types::i129::i129",
        "type": "struct",
        "members": [
            {
                "name": "mag",
                "type": "core::integer::u128"
            },
            {
                "name": "sign",
                "type": "core::bool"
            }
        ]
    },
    {
        "name": "ekubo::router::TokenAmount",
        "type": "struct",
        "members": [
            {
                "name": "token",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "amount",
                "type": "ekubo::types::i129::i129"
            }
        ]
    },
    {
        "name": "ekubo::types::keys::PoolKey",
        "type": "struct",
        "members": [
            {
                "name": "token0",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "token1",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "fee",
                "type": "core::integer::u128"
            },
            {
                "name": "tick_spacing",
                "type": "core::integer::u128"
            },
            {
                "name": "extension",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ]
    },
    {
        "name": "core::integer::u256",
        "type": "struct",
        "members": [
            {
                "name": "low",
                "type": "core::integer::u128"
            },
            {
                "name": "high",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "name": "ekubo::router::RouteNode",
        "type": "struct",
        "members": [
            {
                "name": "pool_key",
                "type": "ekubo::types::keys::PoolKey"
            },
            {
                "name": "sqrt_ratio_limit",
                "type": "core::integer::u256"
            },
            {
                "name": "skip_ahead",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "name": "ekubo::router::Swap",
        "type": "struct",
        "members": [
            {
                "name": "token_amount",
                "type": "ekubo::router::TokenAmount"
            },
            {
                "name": "route",
                "type": "core::array::Array::<ekubo::router::RouteNode>"
            },
            {
                "name": "calculated_amount_threshold",
                "type": "core::integer::u128"
            },
            {
                "name": "recipient",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ]
    },
    {
        "name": "ekubo::router::IRouter",
        "type": "interface",
        "items": [
            {
                "name": "execute",
                "type": "function",
                "inputs": [
                    {
                        "name": "swap",
                        "type": "ekubo::router::Swap"
                    }
                ],
                "outputs": [
                    {
                        "type": "ekubo::router::TokenAmount"
                    }
                ],
                "state_mutability": "external"
            },
            {
                "name": "clear",
                "type": "function",
                "inputs": [
                    {
                        "name": "token",
                        "type": "core::starknet::contract_address::ContractAddress"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::integer::u256"
                    }
                ],
                "state_mutability": "external"
            }
        ]
    }
];


