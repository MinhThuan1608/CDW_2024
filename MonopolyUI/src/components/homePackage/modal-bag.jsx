import React, { useCallback, useEffect, useState } from 'react';

// import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import dice from '../../assert/images/icon/dice.png';
import meo from '../../assert/images/avatar/meo.jpg';
import schoolbag from '../../assert/images/icon/school-bag.png';
import { ChangeUserName, GetBag, IsUsernameValid } from '../../api_caller/user';
import { toast } from 'react-toastify';


const ModalBag = (props) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const [listItem, setListItem] = useState([]);
    const [itemDetail, setItemDetail] = useState({});
    const [isChangeNameCard, setIsChangeNameCard] = useState(false);

    const errorMessageText = document.querySelector('.error-message')

    const [isLoading, setLoading] = useState(false)

    const [username, setUsername] = useState(props.me.username)
    const [valid, setValid] = useState(false)

    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseModal = () => {
        props.setShowModalBag(false);
    };
    // 
    const showDetailItem = (id) => {
        if (listItem)
            setItemDetail(listItem.find(item => item.id === id));

    };
    // 
    useEffect(() => {
        const getBag = async () => {
            const bag = await GetBag(user.id);
            if (bag) {
                setListItem(bag)
            }
        }
        if (listItem.length === 0) getBag();
        return () => { }

    }, [])

    const handleShowChangeNameDiv = () => {
        if (!isChangeNameCard)
            setIsChangeNameCard(true)
        else setIsChangeNameCard(false)
        setErrorMessage('')
    }
    const handleChangeUsername = async (event) => {
        var newUsername = event.target.value;
        setUsername(newUsername);
        validateUsername(newUsername);
    }
    const adjectives = ['Red', 'Brave', 'Wise', 'Mighty', 'Swift', 'Gentle', 'Fierce'];
    const nouns = ['Dragon', 'Knight', 'Wizard', 'Sorcerer', 'Warrior', 'Archer', 'Thief'];
    const generateRandomName = () => {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const random = Math.floor(Math.random() * 100000);
        var randomName = randomAdjective + randomNoun + random;
        setUsername(randomName)
        validateUsername(randomName)
    }

    const validateUsername = async (uname) => {
        console.log(uname)
        // const errorMessage = document.querySelector('.error-message')
        if (uname) {
            const isUsernameValid = await IsUsernameValid(uname);
            if (isUsernameValid) {
                setErrorMessage('')
                setValid(true)
            } else {
                setErrorMessage('Tên này đã được sử dụng bởi người chơi khác')
                setValid(false)
            }
        } else {
            setErrorMessage('Username không được bỏ trống')
            setValid(false)
        }
    }
    const changeName = async () => {
        setLoading(true)
        validateUsername(username)
        if (valid) {
            const response = await ChangeUserName(username);
            console.log(response)
            if (response.data.id) {
                sessionStorage.setItem('user', JSON.stringify(response.data))
                props.setMe(response.data)
                toast.success('Đổi tên thành công!')
                window.location.reload()
            } else {
                setErrorMessage(response.message)
            }

        }
        setLoading(false)

    }

    return (
        <div
            className="modal show"
            style={{
                display: 'block', position: 'initial', height: 'auto', transition: 'top 0.5s ease',
                animation: 'bounceIn 0.5s ease forwards'
            }}
        >
            {props.showModalBag && (
                <div className='modal-content'>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Túi đồ</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                    </div>
                    {listItem.length > 0 && (<div className="modal-body-bag modal-height">
                        <div className="modal-left-container">
                            {listItem.map((item, index) => (
                                <div key={index} className={`item-container ${itemDetail.id === item.id ? 'chosen' : ''}`} >
                                    <img src={item.product.urlImage} alt="item" className="item-image" onClick={() => showDetailItem(item.id)} />
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
                                                <img src={itemDetail.product.urlImage} alt="item" id="item-image-review" />
                                            </div>
                                            <div className="chosen-item-info-container">
                                                <p className="chosen-item-name">{itemDetail.product.name}</p>
                                                <p className="chosen-item-quantity">Số lượng: <span id="quantity">{itemDetail.quantity}</span></p>
                                            </div>
                                        </div>
                                        <div className="item-description-container">
                                            <p className="description">{itemDetail.product.description}</p>
                                            {/*đổi tên  */}
                                            {!isChangeNameCard && itemDetail.product.id === '2' && (
                                                <>
                                                    <div className="change-name-profile-container">
                                                        <div className='input-and-dice' style={{ width: '70%' }}>
                                                            <input type="text" value={username ? username : props.me.username} name="username" maxLength={20} placeholder={props.me.username} onChange={handleChangeUsername} />
                                                            <img src={dice} title="Tạo ngẫu nhiên" alt="random" className="dice" onClick={generateRandomName} />
                                                        </div>
                                                        <button className='profile-btn' onClick={changeName}>Đổi tên</button>
                                                    </div>
                                                    <p style={{color: 'red', fontStyle: 'italic'}}>{errorMessage}</p>
                                                </>
                                            )}
                                        </div>

                                        <div className="item-action-button-container">
                                            <button className="item-action-button sell-button">Bán</button>
                                            <button className="item-action-button use-button" onClick={handleShowChangeNameDiv}>Sử dụng</button>
                                        </div>
                                    </>
                                ) || (
                                    <>
                                        <div className="item-action-button-container empty">
                                            Nhấn vào vật phẩm để xem chi tiết nhé!
                                        </div>

                                    </>

                                )}


                        </div>

                    </div>
                    ) || (
                            <div className="modal-body-bag modal-height empty">
                                <img src={schoolbag} alt="" className='empty-bag' />
                                <p className='empty-title'>Túi đồ trống !!!</p>
                            </div>
                        )}

                </div>
            )}
        </div>
    );
}
export default ModalBag;