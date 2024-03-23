import React from 'react';

import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import dice from '../assert/images/icon/dice.png';
import meo from '../assert/images/avatar/meo.jpg';
import schoolbag from '../assert/images/icon/school-bag.png';


const ModalBag = ({ showModalBag, setShowModalBag }) => {

    // Hàm xử lý khi ấn nút đóng modal
    const handleCloseModal = () => {
        setShowModalBag(false);
    };

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
                    <div className="modal-body modal-height">
                        <div className="modal-left-container">
                            <div className="item-container chosen" title="Basic dices" data-bs-toggle="tooltip" id="">
                                <img src={dice} alt="item" className="item-image" />
                                <p className="item-quantity">1</p>
                            </div>
                            <div className="item-container" title="Basic avatar" data-bs-toggle="tooltip" id="">
                                <img src={meo} alt="item" className="item-image" />
                                <p className="item-quantity">2</p>
                            </div>
                            <div className="item-container " title="School bag" data-bs-toggle="tooltip" id="">
                                <img src={schoolbag} alt="item" className="item-image" />
                                <p className="item-quantity">3</p>
                            </div>
                            <div className="item-container " title="Basic dices" data-bs-toggle="tooltip" id="">
                                <img src={dice} alt="item" className="item-image" />
                                <p className="item-quantity">1</p>
                            </div>
                            <div className="item-container " title="Basic avatar" data-bs-toggle="tooltip" id="">
                                <img src={meo} alt="item" className="item-image" />
                                <p className="item-quantity">2</p>
                            </div>
                            <div className="item-container " title="School bag" data-bs-toggle="tooltip" id="">
                                <img src={schoolbag} alt="item" className="item-image" />
                                <p className="item-quantity">3</p>
                            </div>
                            <div className="item-container " title="Basic dices" data-bs-toggle="tooltip" id="">
                                <img src={dice} alt="item" className="item-image" />
                                <p className="item-quantity">1</p>
                            </div>
                            <div className="item-container " title="Basic avatar" data-bs-toggle="tooltip" id="">
                                <img src={meo} alt="item" className="item-image" />
                                <p className="item-quantity">2</p>
                            </div>
                            <div className="item-container " title="School bag" data-bs-toggle="tooltip" id="">
                                <img src={schoolbag} alt="item" className="item-image" />
                                <p className="item-quantity">3</p>
                            </div>


                        </div>
                        <div className="modal-right-container">
                            <div className="sort-info-chosen-item-container">
                                <div className="item-image-review-container">
                                    <img src={dice} alt="item" id="item-image-review" />
                                </div>
                                <div className="chosen-item-info-container">
                                    <p className="chosen-item-name">This is a item</p>
                                    <p className="chosen-item-quantity">Số lượng: <span id="quantity">10</span></p>
                                </div>
                            </div>
                            <div className="item-description-container">
                                <p className="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia,
                                    quas? Quam, error cum? A repellendus porro, eaque ipsa natus deserunt ab vero sed ut
                                    ullam labore cupiditate quasi eum doloremque! Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Officia consequuntur autem nihil earum explicabo magnam harum quae,
                                    natus quisquam quis culpa itaque officiis, doloremque ullam neque quod. Tempore, nulla
                                    labore?</p>
                            </div>
                            <div className="item-action-button-container">
                                <button className="item-action-button sell-button">Bán</button>
                                <button className="item-action-button use-button">Sử dụng</button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
export default ModalBag;