const ethers      =   require('ethers');
const Web3   =  require('web3');
const Web3Client = new Web3('https://kovan.infura.io/v3/5ff17bb55b904f18bb2d50940b2ce369') //testnet
let contractAddress = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD'
let abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_reserve",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_params",
				"type": "bytes"
			}
		],
		"name": "executeOperation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_asset",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "flashloan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addressProvider",
				"type": "address"
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
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_assetAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LogWithdraw",
		"type": "event"
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_assetAddress",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "addressesProvider",
		"outputs": [
			{
				"internalType": "contract ILendingPoolAddressesProviderV1",
				"name": "",
				"type": "address"
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
		"name": "Owner_Of_This_Contract",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
//ERC20 ABI
var USDTABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "delegate",
                "type": "address"
            }
        ],
        "name": "allowance",
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
                "internalType": "address",
                "name": "delegate",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "numTokens",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "tokenOwner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
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
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "numTokens",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "numTokens",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
module.exports = {

    getContractAddressInstanse : (contractAddress) => {
        return new Promise ( resolve  => {
            let contract = new Web3Client.eth.Contract(
                USDTABI, //abi
                contractAddress //contract address
            );
            resolve(contract)
        })
    },


    getFlashLoanContractAddressInstanse : (contractAddress) => {
        return new Promise ( resolve  => {
            let contract = new Web3Client.eth.Contract(
                abi,
                contractAddress //contract address
            );
            resolve(contract)
        })
    },


    countNonceAndData : ( walletAddress, numTokens, remixContract, contract) => {
        return new Promise(async(resolve) => {

            //convert token to wei
            let convertedNumTokens = Web3Client.utils.toWei(numTokens.toString(), 'ether');
            // console.log('contract',contract)
            // make data for transfer
            const data = contract.methods.transfer(remixContract, convertedNumTokens).encodeABI();
            //make raw transaction 

            // console.log('data', data)
            // Determine the nonce
            const count = await Web3Client.eth.getTransactionCount(walletAddress)
            // How many tokens do I have before sending?
            const nonce = Web3Client.utils.toHex(count);

            // var gaseLimit = await getGasLimit(walletAddress, nonce, data, process.env.SWERRI_TOKEN_ADDRESS)
            // const estimatePrice = (gaseLimit / 10 ** 9);
            let returnObject = {
                nonce : nonce,
                data  : data

            }
            resolve(returnObject)
        })
    },


    calculateGassLimit : (senderWalletAddress, nonce, contractAddress, data) => {
        return new Promise(async(resolve) => {

            var gaseLimit = await Web3Client.eth.estimateGas({
                "from": senderWalletAddress,
                "nonce": nonce,
                "to": contractAddress,
                "data": data
            });
            const gassFeeEstimate =  gaseLimit * 50
            resolve(gassFeeEstimate);
        })
    }, 


    getWalletAddressBalance : (walletAddress, contract) => {
        return new Promise(async(resolve) => {
            try {
                let balance = await contract.methods.balanceOf(walletAddress).call();
                var decimals = await contract.methods.decimals().call();
                balance = (balance / (10 ** decimals));
                resolve(balance)
            }catch(error){
                console.log(error)
                resolve(false)
            }
        })
    },


    transferTokenToOtherWallets : (gaseLimit, data, walletAddress, nonce, senderPrivateKey, contractAddress) => {
        return new Promise(async(resolve) => {    
            try {
                const gasLimit = Web3Client.utils.toHex(gaseLimit);
                const gasPrice =Web3Client.utils.toHex(10 * 1e9);
                const value    = Web3Client.utils.toHex(Web3Client.utils.toWei('0', 'wei'));
                var chainId = 42;
                var rawTransaction = {
                    "from": walletAddress,
                    "nonce": nonce,
                    "gasPrice": gasPrice,
                    "gasLimit": gasLimit,
                    "to": contractAddress,
                    "value": value,
                    "data": data,
                    "chainId": chainId
                };
                const signedTx = await Web3Client.eth.accounts.signTransaction(rawTransaction, senderPrivateKey);
                let recipt     = await Web3Client.eth.sendSignedTransaction(signedTx.rawTransaction);

                console.log('reponseObject', recipt.transactionHash )
                console.log('status',  recipt.status)

                resolve({status : recipt.status, hash : recipt.transactionHash})
            } catch (error) {
                console.log("🚀 ~ file: ether.controller.js ~ line 79 ~ transferTokenToOtherWal ~ error", error)
                resolve({message : error})
            }
        })
    },
}