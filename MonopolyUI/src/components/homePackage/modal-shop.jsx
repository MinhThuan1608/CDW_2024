import React, { useEffect, useState } from 'react';
import { BuyItem, GetProduct } from '../../api_caller/shop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../gameBoard/help';
import { toast } from 'react-toastify';
import Loader from '../loader/loader';

const ModalShop = ({ me, showModalShop, setShowModalShop }) => {
    const [listProduct, setListProduct] = useState([]);
    const [productDetail, setProductDetail] = useState(null);
    const [buyProduct, setBuyProduct] = useState(false)
    const [buyNumber, setBuyNumber] = useState(1)

    const [isLoading, setLoading] = useState(false)

    const handleCloseModal = () => {
        setShowModalShop(false);
    };
    // 
    const showDetailItem = (id) => {
        const productChose = listProduct.find(item => item.id === id)
        setProductDetail(productChose);
        setBuyNumber(1)
    };
    const handleBuyItem = async () => {
        setLoading(true)
        const moneyAfterBuy = await BuyItem(productDetail.id, buyNumber);
        setLoading(false)
        if (moneyAfterBuy === me.money) toast.error('Không mua được vật phẩm vì không đủ tiềnn!');
        else {
            toast.success('Mua thành công!');
            me.money = moneyAfterBuy
        }
    }
    const handleOpenBuyItemDiv = () => {
        setBuyProduct(true)

    }
    const handleCloseBuyItemDiv = () => {
        setBuyProduct(false)
    }
    useEffect(() => {
        const getProductShop = async () => {
            const products = await GetProduct();
            setListProduct(products)
            
        }
        setLoading(true)
        getProductShop();
        setLoading(false)

    }, [])

    return (
        <>
            <div
                className="modal"
                style={{
                    display: 'block', position: 'initial', height: 'auto', transition: 'top 0.5s ease',
                    animation: 'bounceIn 0.5s ease forwards'
                }}
            >
                {showModalShop && (
                    <div className='modal-content'>
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Cửa hàng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body-bag modal-height">
                            <div className="modal-left-container">
                                {listProduct.map((item, index) => (
                                    <div key={index} className={`item-container ${productDetail !== null && productDetail.id === item.id ? 'chosen' : ''}`} >
                                        <img src={item.urlImage} alt="item" className="item-image" onClick={() => showDetailItem(item.id)} />
                                        {/* <p className="item-quantity">{item.price}</p> */}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-right-container">
                                {productDetail !== null &&
                                    (
                                        <>
                                            <div className="sort-info-chosen-item-container">
                                                <div className="item-image-review-container">
                                                    <img src={productDetail.urlImage} alt="item" id="item-image-review" />
                                                </div>
                                                <div className="chosen-item-info-container">
                                                    <p className="chosen-item-name">{productDetail.name}</p>
                                                    <p className="chosen-item-quantity">
                                                        Giá: <span id="quantity">{formatCurrency(productDetail.price)}</span>
                                                        <FontAwesomeIcon icon={faCoins} className="money-icon" />
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="item-description-container">
                                                <p className="description">{productDetail.description}</p>

                                                {buyProduct && (
                                                    <>
                                                        <div className="change-name-profile-container">
                                                            <div style={{ width: '90%', borderTop: '2px solid', paddingTop: '10px', fontSize: '14px' }}>
                                                                <input
                                                                    type="range"
                                                                    min={1}
                                                                    max={100}
                                                                    value={buyNumber}
                                                                    onChange={e => setBuyNumber(e.target.value)}
                                                                />
                                                                <p style={{ margin: 0 }}>Mua:
                                                                    <span style={{ color: '#41B06E', fontSize: '18px' }}> {buyNumber} </span>
                                                                    {productDetail.name}
                                                                </p>
                                                                <p style={{ margin: 0 }}>Số tiền phải trả:
                                                                    <span style={{ color: '#41B06E', fontSize: '18px' }}> {formatCurrency(productDetail.price * buyNumber)} </span>
                                                                    <span> <FontAwesomeIcon icon={faCoins} className="money-icon" /></span>
                                                                </p>
                                                                {/* <button className='profile-btn' onClick={handleBuyItem}>Mua</button> */}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="item-action-button-container">
                                                {buyProduct && <button style={{background: '#ccc'}} className="item-action-button use-button" onClick={handleCloseBuyItemDiv}>Thoát</button>}
                                                <button className="item-action-button use-button" onClick={buyProduct ? handleBuyItem : handleOpenBuyItemDiv}>Mua</button>
                                            </div>
                                        </>
                                    ) || (
                                        <div className="item-action-button-container empty">
                                            Nhấn vào vật phẩm để xem chi tiết nhé!
                                        </div>
                                    )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
            {isLoading && <Loader isLoading={isLoading} />}

        </>
    );
}
export default ModalShop;