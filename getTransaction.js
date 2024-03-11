const ethers = require('ethers')
const fs = require('fs');
require('dotenv').config();


const v2PairArtifact = require('@uniswap/v2-periphery/build/IUniswapV2Pair.json')

const ETH_USDT_V2 = '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852'
const DAI_MKR_V2 = '0x517f9dd285e75b599234f7221227339478d0fcc8'
const USDC_ETH_V2 = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'


const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

const v2Pair_ETH_USDT_V2 = new ethers.Contract(ETH_USDT_V2, v2PairArtifact.abi, provider)
const v2Pair_DAI_MKR_V2 = new ethers.Contract(DAI_MKR_V2, v2PairArtifact.abi, provider)
const v2Pair_USDC_ETH_V2 = new ethers.Contract(USDC_ETH_V2, v2PairArtifact.abi, provider)


// Define a function to log to console and store in a file
function logAndStore(TOKEN, sender, type, token1_volume, token2_volume,transactionHash, timestamp) {
    const log = {
        TOKEN,
        sender,
        type,
        token1_volume,
        token2_volume,
        transactionHash,
        timestamp
    };
    console.log(log);
    let logs = [];
    try {
        if (fs.existsSync('outputs.json')) {
            logs = JSON.parse(fs.readFileSync('outputs.json', 'utf8')) || [];
        }
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
    }
    logs.push(log);
    fs.writeFileSync('outputs.json', JSON.stringify(logs, null, 2));
}



console.log("Running...")


v2Pair_ETH_USDT_V2.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out,to,event) => {
    const type = amount0In.toString() === '0' ? 'sell' : 'buy';
    const token1_volume = type === 'sell' ? amount0Out.toString() : amount0In.toString();
    const token2_volume = type === 'sell' ? amount1In.toString() : amount1Out.toString();
    const transactionHash = event.log.transactionHash.toString();
    const timestamp = (await provider.getBlock(event.log.blockNumber)).timestamp.toString();
    logAndStore('ETH/USDT', sender, type, token1_volume, token2_volume,transactionHash,timestamp);
});

v2Pair_DAI_MKR_V2.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out,to,event) => {
    const type = amount0In.toString() === '0' ? 'sell' : 'buy';
    const token1_volume = type === 'sell' ? amount0Out.toString() : amount0In.toString();
    const token2_volume = type === 'sell' ? amount1In.toString() : amount1Out.toString();
    const transactionHash = event.log.transactionHash.toString();
    const timestamp = (await provider.getBlock(event.log.blockNumber)).timestamp.toString();
    logAndStore('DAI/MKR', sender, type, token1_volume, token2_volume,transactionHash,timestamp);
});

v2Pair_USDC_ETH_V2.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out,to,event) => {
    const type = amount0In.toString() === '0' ? 'sell' : 'buy';
    const token1_volume = type === 'sell' ? amount0Out.toString() : amount0In.toString();
    const token2_volume = type === 'sell' ? amount1In.toString() : amount1Out.toString();
    const transactionHash = event.log.transactionHash.toString();
    const timestamp = (await provider.getBlock(event.log.blockNumber)).timestamp.toString();
    logAndStore('USDC/ETH', sender, type, token1_volume, token2_volume,transactionHash,timestamp);
});




