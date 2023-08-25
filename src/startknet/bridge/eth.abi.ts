
export const ethBridgeAbi = [
    {
        "type":"function",
        "name":"deposit",
        "inputs": [
            {"name":"amount","type":"uint256"},
            {"name":"l2Recipient","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"withdraw",
        "inputs": [
            {"name":"amount","type":"uint256"},
            {"name":"recipient","type":"address"}
        ]
    },
]