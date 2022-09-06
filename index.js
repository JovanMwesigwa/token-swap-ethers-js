const {
  AlphaRouter,
  SWAP_ROUTER_ADDRESS,
} = require('@uniswap/smart-order-router')
const {
  Token,
  CurrencyAmount,
  TradeType,
  Percent,
} = require('@uniswap/sdk-core')
const { ethers } = require('ethers')
const JSBI = require('jsbi')
require('dotenv').config()

const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
const ERC20_ABI = require('./abi/abi.json')

// Wallet info
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET
const GOERLI_URL = process.env.GOERLI_URL
const chainId = 5

// Initialise the provider
const provider = new ethers.providers.JsonRpcProvider(GOERLI_URL)

const swapRouter = new AlphaRouter({ chainId: chainId, provider: provider })

async function makeSwap(tokenFrom, tokenTo, amount) {
  // Tokens info
  const name1 = tokenFrom.name
  const symbol1 = tokenFrom.symbol
  const address1 = tokenFrom.address
  const decimals1 = 18

  const name2 = tokenTo.name
  const symbol2 = tokenTo.symbol
  const address2 = tokenTo.address
  const decimals2 = 18

  // Get the tokens details
  const TOKEN_FROM = new Token(chainId, address1, decimals1, symbol1, name1)
  const TOKEN_TO = new Token(chainId, address2, decimals2, symbol2, name2)

  // Convert the amount to swap into wei -> uniswap input amounts
  const wei = ethers.utils.parseUnits(amount, decimals1)
  const inputAmount = CurrencyAmount.fromRawAmount(TOKEN_FROM, JSBI.BigInt(wei))

  // Create a route instance that -> returns a quote price...
  const route = await swapRouter.route(
    inputAmount,
    TOKEN_TO,
    TradeType.EXACT_INPUT,
    {
      recepient: WALLET_ADDRESS,
      slippageTolerance: new Percent(25, 100),
      deadline: Math.floor(Date.now() / 1000 + 1800),
    }
  )
  console.log(`Quote Exact In: ${route.quote.toFixed(10)}`)

  // Create a transaction to be broadcasted to the network
  const transaction = {
    data: route.methodParameters.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: route.methodParameters.value.toString(),
    from: WALLET_ADDRESS,
    // gasPrice: route.gasPriceWei.toString(),
    // gasLimit: ethers.utils.hexlify(1000000),
  }

  // Create wallet / signer instance and connect it to the provider
  const wallet = new ethers.Wallet(WALLET_SECRET)
  const connectedWallet = wallet.connect(provider)

  // Grant approval of the swap contract to withdraw the amount to swap from your wallet
  const approvalAmount = ethers.utils.parseUnits('1', 18).toString()
  const contract0 = new ethers.Contract(address1, ERC20_ABI, provider)
  await contract0
    .connect(connectedWallet)
    .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount)

  // Bradcast the transaction to the network
  const tradeTransaction = await connectedWallet.sendTransaction(transaction)

  console.log(tradeTransaction)
}

makeSwap()
