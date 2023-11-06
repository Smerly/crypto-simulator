import { AssetsWrapper } from "./Assets.style"
import { useSelector } from 'react-redux'
import EachAsset from "./EachAsset"
import { useEffect, useState } from "react"
import { getAllCoinsWithImages } from "helpers/getCoin"


function Assets() {
    const [allCoins, setAllCoins] = useState([])
    const purchasedCurrencies = useSelector((state) => state.portfolio.currencies)

    useEffect(() => {
        getAllCoinsWithImages().then((res) => setAllCoins(res))
    }, [])

    return (
        <AssetsWrapper>
            {purchasedCurrencies.map((each) => {
                return <EachAsset key={each.id} asset={each} allCoins={allCoins} /> 
            })}
        </AssetsWrapper>
    )
}

export default Assets
