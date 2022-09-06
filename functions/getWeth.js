const { ethers } = require('ethers')
require('dotenv').config()

const ERC20_ABI = require('../abi/abi.json')

// Wallet info
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET
const GOERLI_URL = process.env.GOERLI_URL
const chainId = 5

// provider
const provider = new ethers.providers.JsonRpcProvider(GOERLI_URL)

// Wrapped ether
const name1 = 'Wrapped Ether'
const symbol1 = 'WETH'
const address1 = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const decimals1 = 18

const getWeth = async (connectedWallet) => {
  try {
    const wethContract = new ethers.Contract(address1, ERC20_ABI, provider)
    // Get current user Wrapped eth balance
    const currentBalance = await wethContract.balanceOf(WALLET_ADDRESS)
    const balance = await provider.getBalance(WALLET_ADDRESS)
    console.log(`Current weth balance is: ${currentBalance.toString()}`)
    console.log(balance.toString())

    // const transaction = {
    //   to: address1,
    //   value: balance.toString(),
    //   from: WALLET_ADDRESS,
    // }

    // const tx = await connectedWallet.sendTransaction(transaction)

    // Get current user Wrapped eth balance
    // const currentBalance2 = await wethContract.balanceOf(WALLET_ADDRESS)
    // const balance2 = await provider.getBalance(WALLET_ADDRESS)
    // console.log(`Weth balance is: ${currentBalance2.toString()}`)
    // console.log(`Eth balance is: ${balance2.toString()}`)
  } catch (error) {
    console.log(error.messsage)
  }
}

module.exports = {
  getWeth,
}
