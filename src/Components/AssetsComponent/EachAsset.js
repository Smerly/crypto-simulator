import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { formatNumber } from "utils/formatNumber"
import { EachAssetWrapper, AssetImage, CoinLabelBox, AssetName, AssetInfoBoxes, AssetInfoBoxLabel, MarketPriceContainer, YourCoinContainer, MarketPriceBox, YourCoinBox, InfoText, EditAssetButton, DeleteAssetButton } from "./Assets.style"
import { handleAwaitPrim } from "utils/handleAwait"
import { roundToHundredth } from "utils/roundToHundredth"
import { formatDateSlash } from 'utils/formatDate'
import { returnArrow, returnGreenOrRedCompare, returnGreenOrRedCondition } from "utils/returnGreenOrRed"
import CoinBar from "./CoinBar"
import { sellCurrency } from "redux/portfolioSlice"
import EditAsset from "./EditAsset/EditAsset"

function EachAsset(props) {
    const dispatch = useDispatch()

    const [currentCoin, setCurrentCoin] = useState('')
    const [historyCoin, setHistoryCoin] = useState('')

    const historyCoinMarket = handleAwaitPrim(historyCoin, 'market_data')
    const historyCoinPrice = handleAwaitPrim(historyCoinMarket, 'current_price')

    const currencyType = useSelector((state) => state.persist.currency.currency )
    
    const { reduxAsset, allCoins, allHistoryCoins } = props
    const { id, amountOfCoin, datePurchased } = reduxAsset

    const amountInCurrency = (amountOfCoin * handleAwaitPrim(historyCoinPrice, `${currencyType}`)).toFixed(2)
    const priceOfEach = handleAwaitPrim(historyCoinPrice, `${currencyType}`)
    const greenOrRed = returnGreenOrRedCondition(handleAwaitPrim(currentCoin, 'price_change_percentage_24h') > 0)
    const currentChange24h = roundToHundredth(handleAwaitPrim(currentCoin, 'price_change_percentage_24h'))
    const arrow = returnArrow(handleAwaitPrim(currentCoin, 'price_change_percentage_24h'), 0)

    const currentPrice = formatNumber(String(handleAwaitPrim(currentCoin, 'current_price')))
    const currentTotalVolume = handleAwaitPrim(currentCoin, 'total_volume')
    const currentMarketCap = handleAwaitPrim(currentCoin, 'market_cap')
    const currentCirculatingSupply = handleAwaitPrim(currentCoin, 'circulating_supply')
    const currentTotalSupply = handleAwaitPrim(currentCoin, 'total_supply')

    const image = handleAwaitPrim(currentCoin, 'image')

    useEffect(() => {
        // Find the one current coin that exists since id is unique, and add it as a state
        setCurrentCoin(allCoins.filter((each) => each.id === id)[0])
    }, [allCoins, reduxAsset])
    

    useEffect(() => {
        // Find the one history coin that exists since id is unique, and add it as a state
        setHistoryCoin(allHistoryCoins.filter((each) => each.id === id)[0])
    }, [allHistoryCoins, reduxAsset])

    const deleteAsset = () => {
        dispatch(sellCurrency(handleAwaitPrim(currentCoin, 'id')))
    }


    return (
        <EachAssetWrapper>
            <CoinLabelBox>
                <AssetImage src={image}/>
                <AssetName>{handleAwaitPrim(currentCoin,'name')}</AssetName>
            </CoinLabelBox>

            <AssetInfoBoxes>

                {/* Market Price Box */}
                
                <MarketPriceContainer>
                    <AssetInfoBoxLabel>
                        Market Price
                        <EditAsset currentCoin={currentCoin} reduxAsset={reduxAsset} historyCoinPrice={historyCoinPrice} />
                        <DeleteAssetButton onClick={deleteAsset}>
                            Delete
                        </DeleteAssetButton>
                    </AssetInfoBoxLabel>
                    <MarketPriceBox>
                        <InfoText>
                            Price: ${currentPrice}
                            
                        </InfoText>
                        <InfoText>
                            Change 24h:
                            <p className={`ml-1 ${greenOrRed}`}>
                                {currentChange24h}
                            </p>
                            {arrow}
                        </InfoText>
                        <InfoText>
                            Market Cap vs Volume: 
                            <CoinBar fraction={currentTotalVolume} total={currentMarketCap}/>
                        </InfoText>
                        <InfoText>
                            Circulating vs Max:
                            <CoinBar fraction={currentCirculatingSupply} total={currentTotalSupply}/>
                        </InfoText>
                    </MarketPriceBox>
                </MarketPriceContainer>

                {/* Your Coin */}

                <YourCoinContainer>
                    <AssetInfoBoxLabel>
                        Your Coin
                    </AssetInfoBoxLabel>
                    <YourCoinBox>
                        <InfoText>
                            # of Coins: {roundToHundredth(amountOfCoin)} Coins
                        </InfoText>
                        <InfoText>
                            Amount Value: ${formatNumber(String(amountInCurrency))}
                        </InfoText>
                        <InfoText>  
                            Total Price Difference: 
                            <p className={`ml-1 ${returnGreenOrRedCompare(handleAwaitPrim(currentCoin, 'current_price'), priceOfEach)}`}>
                                ${(formatNumber(roundToHundredth(handleAwaitPrim(currentCoin, 'current_price') - priceOfEach * roundToHundredth(amountOfCoin))))}
                                {handleAwaitPrim(currentCoin, 'current_price')} 
                                {priceOfEach}
                                {roundToHundredth(amountOfCoin)}
                            </p> 
                            {returnArrow(handleAwaitPrim(currentCoin, 'current_price'), priceOfEach)}
                        </InfoText>
                        <InfoText>
                            Date Purchased: {formatDateSlash(datePurchased)}
                        </InfoText>
                    </YourCoinBox>
                </YourCoinContainer>

            </AssetInfoBoxes>
        </EachAssetWrapper>
    )
}

export default EachAsset