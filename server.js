const {
  ChainId,
  Token,
  WETH,
  Pair,
  TokenAmount,
  Route,
  Trade,
  TradeType,
} = require('@uniswap/sdk')

const chainId = ChainId.GÖRLI
const name = 'Uniswap Token'
const symbol = 'UNI'
const tokenAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
const decimals = 18

const WRAPPED_ETHER = WETH[chainId]
const UNI = new Token(chainId, tokenAddress, decimals, symbol, name)

const pair = new Pair(
  new TokenAmount(UNI, '1000000000000000000'),
  new TokenAmount(WRAPPED_ETHER, '2000000000000000000')
)

async function main() {
  const route = new Route([pair], WRAPPED_ETHER)
  const trade = new Trade(
    route,
    new TokenAmount(WRAPPED_ETHER, '2000000000000000000'),
    TradeType.EXACT_INPUT
  )
  console.log(trade)
}

main()
