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
        "internalType": "uint256",
        "name": "subrcvr",
        "type": "uint256"
      }
    ],
    "name": "getSubRec",
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
        "internalType": "uint256",
        "name": "subrcvr",
        "type": "uint256"
      }
    ],
    "name": "getSubUni",
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
        "internalType": "uint256",
        "name": "subrcvr",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creaone",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "unixsec",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "subrcvr",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creaone",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amntone",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creatwo",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amnttwo",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creathr",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amntthr",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "unixsec",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "subrcvr",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creaone",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amntone",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creatwo",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amnttwo",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "unixsec",
        "type": "uint256"
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
