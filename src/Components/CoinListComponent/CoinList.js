import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect, useState } from 'react'
import { Coins, CoinsWrapper, EachCoinWrapper, CoinTitle, CoinHeader, CoinName, EachCoinMap } from 'Components/CoinListComponent/CoinList.style'
import { getAllCoinsWithImages } from 'helpers/getCoin'
import EachCoin from './EachCoin'
import { useSelector } from 'react-redux'
import { handleAwaitPrim } from 'utils/handleAwait'
import { render } from '@testing-library/react'


function CoinList () {
    const [coins, setCoins] = useState([])
    const [renderedCoin, setRenderedCoin] = useState([])
    const [loadCounter, setLoadCounter] = useState(0)
    const currencyType = useSelector((state) => state.persist.currency)

    // This is for features later down the road
    const updateCoinSort = (sortType) => {
        setRenderedCoin([...renderedCoin].sort((a, b) => {
            return b[sortType] - a[sortType]
        }))
    }

    // Case for load counter change
    useEffect(() => {
        getAllCoinsWithImages(currencyType.currency, loadCounter).then((res) => {
            setCoins([...coins, ...res])
        }).catch((err) => {
            return err
        })
    }, [loadCounter])

    // Case for 
    useEffect(() => {
        getAllCoinsWithImages(currencyType.currency, loadCounter).then((res) => {
            setCoins([])
            setCoins(res)
        }).catch((err) => {
            return err
        })
    }, [currencyType.currency])

    const getMoreData = () => {
        setRenderedCoin([...renderedCoin, ...coins.slice(renderedCoin.length, renderedCoin.length + 5)])
    }

    const addToLoadCounter = () => {
        setLoadCounter(loadCounter + 1)
    }

    return (
        <Coins>
            <InfiniteScroll
                dataLength={coins.length}
                hasMore={true}
                next={addToLoadCounter}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                pullDownToRefreshContent={
                    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                }
                releaseToRefreshContent={
                    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                }
                >
                
                {/* Legend Header */}

                <EachCoinMap>
                    <EachCoinWrapper>
                        <CoinHeader>#</CoinHeader>
                        <CoinName>Name</CoinName>
                        <CoinHeader className='ml-20'>Price</CoinHeader>
                        <CoinHeader>1h%</CoinHeader>
                        <CoinHeader>24h%</CoinHeader>
                        <CoinHeader>7h%</CoinHeader>
                        <CoinHeader className='m-16'>24h Volume/Market Cap</CoinHeader>
                        <CoinHeader className='mr-16'>Circulating/Total Supply</CoinHeader>
                        <CoinHeader>Last 7d</CoinHeader>
                    </EachCoinWrapper>
                </EachCoinMap>
                
                {coins.map((eachCoin, i) => {
                return (
                    <EachCoinMap className='overflow-x-scroll'>
                        <EachCoin eachCoin={eachCoin} index={i+1} />
                    </EachCoinMap>
                )
            })}
            </InfiniteScroll>
        </Coins>
    )
}

export default CoinList