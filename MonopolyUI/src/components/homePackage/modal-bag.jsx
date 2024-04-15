import React, { useCallback, useEffect, useState } from 'react';

// import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import dice from '../../assert/images/icon/dice.png';
import meo from '../../assert/images/avatar/meo.jpg';
import schoolbag from '../../assert/images/icon/school-bag.png';
import { GetBag, IsUsernameValid } from '../../api_caller/user';


const ModalBag = ({ showModalBag, setShowModalBag }) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const [listItem, setListItem] = useState([]);
    const [itemDetail, setItemDetail] = useState({});
    const handleCloseModal = () => {
        setShowModalBag(false);
    };
    // 
    const showDetailItem = (id) => {
        if (listItem)
            setItemDetail(listItem.find(item => item.id === id));

    };
    // 
    useEffect(() => {
        const getBag = async () => {
            const bag = await GetBag(user.username);
            if (bag) {
                setListItem(bag.product)
            }
        }
        if (listItem.length === 0) getBag();
        return () => { }

    }, [])

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial', height: 'auto' }}
        >
            {showModalBag && (
                <div className='modal-content'>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Túi đồ</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                    </div>
                    {listItem.length > 0 && (<div className="modal-body-bag modal-height">
                        <div className="modal-left-container">
                            {listItem.map((item, index) => (
                                <div key={index} className={`item-container ${itemDetail.id === item.id ? 'chosen' : ''}`} >
                                    <img src={item.urlImage} alt="item" className="item-image" onClick={() => showDetailItem(item.id)} />
                                    <p className="item-quantity">{item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        <div className="modal-right-container">
                            {Object.keys(itemDetail).length !== 0 && listItem &&
                                (
                                    <>
                                        <div className="sort-info-chosen-item-container">
                                            <div className="item-image-review-container">
                                                <img src={Object.keys(itemDetail).length === 0 ? listItem[0].urlImage : itemDetail.urlImage} alt="item" id="item-image-review" />
                                            </div>
                                            <div className="chosen-item-info-container">
                                                <p className="chosen-item-name">{Object.keys(itemDetail).length === 0 ? listItem[0].name : itemDetail.name}</p>
                                                <p className="chosen-item-quantity">Số lượng: <span id="quantity">{Object.keys(itemDetail).length === 0 ? listItem[0].quantity : itemDetail.quantity}</span></p>
                                            </div>
                                        </div>
                                        <div className="item-description-container">
                                            <p className="description">{Object.keys(itemDetail).length === 0 ? listItem[0].description : itemDetail.description}</p>
                                        </div>
                                        <div className="item-action-button-container">
                                            <button className="item-action-button sell-button">Bán</button>
                                            <button className="item-action-button use-button">Sử dụng</button>
                                        </div>
                                    </>
                                ) || (
                                    <div className="item-action-button-container empty">
                                        Nhấn vào vật phẩm để xem chi tiết nhé!
                                    </div>
                                )}
                        </div>
                    </div>
                    ) || (
                            <div className="modal-body-bag modal-height empty">
                                <img src={schoolbag} alt="" className='empty-bag'/>
                               <p className='empty-title'>Túi đồ trống !!!</p>
                            </div>
                        )}

                </div>
            )}
        </div>
    );
}
export default ModalBag;