

export async function getCoin(coin) {
    const desiredCoin = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`)
    const temp = await desiredCoin.json()
    return temp
}

export async function getAllCoins() {
    const desiredCoin = await fetch(`https://api.coingecko.com/api/v3/coins/list`)
    return await desiredCoin.json()
}

export async function getAllCoinsWithImages() {
    const coins = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`)
    return await coins.json()
}

export async function getCoinChartData(coin) {
    const desiredCoin = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=180&interval=daily`)
    return await desiredCoin.json()
}

export async function getGlobalData() {
    const desiredCoin = await fetch(`https://api.coingecko.com/api/v3/global`)
    return await desiredCoin.json()
}