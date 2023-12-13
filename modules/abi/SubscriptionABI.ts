export const SubscriptionABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ownadd",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "feeadd",
        "type": "address"
      }
    ],
    "name": "SetFeeAdd",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "feeamn",
        "type": "uint256"
      }
    ],
    "name": "SetFeeAmn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "subamn",
        "type": "uint256"
      }
    ],
    "name": "SetSubAmn",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "getCreFnd",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFeeAdd",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFeeAmn",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSubAmn",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "subrcvr",
        "type": "uint64"
      }
    ],
    "name": "getSubCre",
    "outputs": [
      {
        "internalType": "address[3]",
        "name": "",
        "type": "address[3]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "subrcvr",
        "type": "uint64"
      }
    ],
    "name": "getSubUni",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "feeadd",
        "type": "address"
      }
    ],
    "name": "setFeeAdd",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "feeamn",
        "type": "uint256"
      }
    ],
    "name": "setFeeAmn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subamn",
        "type": "uint256"
      }
    ],
    "name": "setSubAmn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "subrcvr",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "creaone",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "unixsec",
        "type": "uint64"
      }
    ],
    "name": "subOne",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "subrcvr",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "creaone",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "amntone",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "creatwo",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "amnttwo",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "creathr",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "amntthr",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "unixsec",
        "type": "uint64"
      }
    ],
    "name": "subThr",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "subrcvr",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "creaone",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "amntone",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "creatwo",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "amnttwo",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "unixsec",
        "type": "uint64"
      }
    ],
    "name": "subTwo",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];
