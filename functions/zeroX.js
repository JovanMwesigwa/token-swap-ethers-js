const { ethers, BigNumber } = require('ethers')
const qs = require('qs')
const axios = require('axios')
const ERC20_ABI = require('../abi/abi.json')

const ZERO_EX_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'
const DAI_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

const zeroX = async () => {
  try {
    // Selling 100 DAI for ETH.
    const params = {
      sellToken: 'DAI',
      buyToken: 'ETH',
      // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
      sellAmount: '100000000000000000000',
      takerAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    }

    const response = await axios.get(
      `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`
    )

    console.log(await response)
  } catch (error) {
    console.log(error.message)
  }
}

zeroX()
