var express = require('express');
var router = express.Router();
const ethers =  require('ethers')
const helper = require('../helper/helper')
const Web3   =  require('web3');
const Web3Client = new Web3('https://kovan.infura.io/v3/5ff17bb55b904f18bb2d50940b2ce369') //testnet
let remixContract = '0x9e2289aDbD490158a462E3c93d12d1410478Caa5' //remix id contract address
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

router.post('/sendTokenToContractAddress', async (req, res) => {
	if(req.body.walletAddress && req.body.numTokens  && req.body.senderPrivateKey){
		let contractAddress = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD'//await helper.getContractAddress(req.body.symbol)
        if(contractAddress){
            let contract = await helper.getContractAddressInstanse(contractAddress)
			let response = await helper.countNonceAndData(req.body.walletAddress, req.body.numTokens, remixContract, contract)
			let nonce = response.nonce;
            let data  = response.data;            
            let gaseLimit = await helper.calculateGassLimit(req.body.walletAddress, nonce, contractAddress, data)
            console.log('gaseLimit', gaseLimit)
            let balance = await helper.getWalletAddressBalance(req.body.walletAddress, contractAddress,contract)
            console.log('balance of wallet are =====', balance)

            if( balance <  req.body.numTokens ){
                let response = {
                    message  :   `Insufficient balance!!!`
                }
                res.status(404).send(response);
            }else{
        
                let trasctionData = await helper.transferTokenToOtherWallets(gaseLimit, data, req.body.walletAddress, nonce, req.body.senderPrivateKey, contractAddress, Web3Client)
                res.status(200).send(trasctionData);
            }
		}else{
            let response = {
                message  :   'Contract address is not available against this symbol!!!'
            }
            res.status(404).send(response);
        } 
	}else{
	
		let response = {
			message  :   'Payload missing!!!!!!'
		}
		res.status(404).send(response);
	}
})

router.post('/flashLoan', async (req, res) => {
	if(req.body.loanAmount && req.body.walletAddress && req.body.senderPrivateKey){
		let loanAmount = req.body.loanAmount
		let convertedNumTokens = Web3Client.utils.toWei('1', 'ether');
		let contractAddress = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD'
		let contract = await helper.getFlashLoanContractAddressInstanse(contractAddress);
		const data = contract.methods.flashloan(contractAddress, loanAmount ).encodeABI();
		// const estimate = await Web3Client.eth.estimateGas(transaction);
		console.log('as',data);

		const estimatePrice = 1//(1 / 10 ** 8);
		const data1 = contract.methods.executeOperation(contractAddress, convertedNumTokens, estimatePrice, data).encodeABI();
		console.log('executeOperation', data1);
	}else{
		let response = {
			message  :   'payload Missing!!!'
		}
		res.status(404).send(response);
	}
})


router.post('/getBalance', async(req, res) => {
    if(req.body.symbol && req.body.walletAddress){
        let contractAddress = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD';//await helper.getContractAddress(req.body.symbol)
        if(contractAddress.length > 0){
            let balance = await helper.getWalletAddressBalance(req.body.walletAddress, contractAddress)

            let response = {
                balance  :   balance
            }
            res.status(200).send(response);
        }else{

            let response = {
                message  :   'Payload missing!!!!!!'
            }
            res.status(404).send(response);
        }
    }else{

        let response = {
            message  :   'Payload missing!!!!!!'
        }
        res.status(404).send(response);
    }
})

module.exports = router;