export const PolicyABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amo",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "sys",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "mem",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "acc",
        "type": "uint256"
      }
    ],
    "name": "CreateMember",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "sys",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "mem",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "acc",
        "type": "uint256"
      }
    ],
    "name": "CreateSystem",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "sys",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "mem",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "acc",
        "type": "uint256"
      }
    ],
    "name": "DeleteMember",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "sys",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "mem",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "acc",
        "type": "uint256"
      }
    ],
    "name": "DeleteSystem",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "sys",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "mem",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "acc",
            "type": "uint256"
          }
        ],
        "internalType": "struct Triple.Record",
        "name": "rec",
        "type": "tuple"
      }
    ],
    "name": "createRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "sys",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "mem",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "acc",
            "type": "uint256"
          }
        ],
        "internalType": "struct Triple.Record",
        "name": "rec",
        "type": "tuple"
      }
    ],
    "name": "deleteRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "searchAmount",
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
    "name": "searchBlocks",
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
        "name": "cur",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "blo",
        "type": "uint256"
      }
    ],
    "name": "searchRecord",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "sys",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "mem",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "acc",
            "type": "uint256"
          }
        ],
        "internalType": "struct Triple.Record[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
