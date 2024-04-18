import React, { useEffect, useState } from 'react';
import { GetProduct } from '../../api_caller/shop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../gameBoard/help';

const ModalShop = ({ showModalShop, setShowModalShop }) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const [listProduct, setListProduct] = useState([]);
    const [productDetail, setProductDetail] = useState({});

    const handleCloseModal = () => {
        setShowModalShop(false);
    };
    // 
    const showDetailItem = (id) => {
        setProductDetail(listProduct.find(item => item.id === id));
    };

    useEffect(() => {
        const getProductShop = async () => {
            const products = await GetProduct();
            setListProduct(products)

        }
        if (listProduct.length === 0) getProductShop();
        return () => { }
    }, [])

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial', height: 'auto' }}
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
                                <div key={index} className={`item-container ${productDetail.id === item.id ? 'chosen' : ''}`} >
                                    <img src={item.urlImage} alt="item" className="item-image" onClick={() => showDetailItem(item.id)} />
                                    {/* <p className="item-quantity">{item.price}</p> */}
                                </div>
                            ))}
                        </div>
                        <div className="modal-right-container">
                            {Object.keys(productDetail).length !== 0 && listProduct &&
                                (
                                    <>
                                        <div className="sort-info-chosen-item-container">
                                            <div className="item-image-review-container">
                                                <img src={productDetail.urlImage} alt="item" id="item-image-review" />
                                            </div>
                                            <div className="chosen-item-info-container">
                                                <p className="chosen-item-name">{Object.keys(productDetail).length === 0 ? listProduct[0].name : productDetail.name}</p>
                                                <p className="chosen-item-quantity">
                                                    Giá: <span id="quantity">{formatCurrency(productDetail.price)}</span>
                                                    <FontAwesomeIcon icon={faCoins} className="money-icon" />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="item-description-container">
                                            <p className="description">{productDetail.description}</p>
                                        </div>
                                        <div className="item-action-button-container">
                                            <button className="item-action-button use-button">Mua</button>
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
    );
}
export default ModalShop;