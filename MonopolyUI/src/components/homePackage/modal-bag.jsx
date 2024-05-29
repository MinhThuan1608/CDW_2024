import React, { useContext, useEffect, useState } from 'react';
import dice from '../../assert/images/icon/dice.png';
import schoolbag from '../../assert/images/icon/school-bag.png';
import { ChangeUserName, GetBag, GetFriends, IsUsernameValid } from '../../api_caller/user';
import { toast } from 'react-toastify';
import Loader from '../loader/loader';
import { SaleItem } from '../../api_caller/shop';
import { formatCurrency, generateRandomUsername } from '../gameBoard/help';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { SocketContext } from '../../App';


const ModalBag = (props) => {
    const { socket } = useContext(SocketContext);
    const [listFriend, setListFriend] = useState([]);


    const [itemDetail, setItemDetail] = useState(null);
    const [isChangeNameCard, setIsChangeNameCard] = useState(false);
    const [saleProduct, setSaleProduct] = useState(false);
    const [saleNumber, setSaleNumber] = useState(1);

    const [donateProduct, setDonateProduct] = useState(false);
    const [donateNumber, setDonateNumber] = useState(1);
    const [selectedFriend, setSelectedFriend] = useState(null);



    const [isLoading, setLoading] = useState(false)

    const [username, setUsername] = useState(props.me.username)
    const [valid, setValid] = useState(false)

    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseModal = () => {
        props.setShowModalBag(false);
    };
    // 
    const showDetailItem = (id) => {
        if (props.listItem) {
            const itemChose = props.listItem.find(item => item.id === id)
            setItemDetail(itemChose);
            setSaleNumber(itemChose.quantity)
        }

    };
    // 
    const handleChangeUsername = async (event) => {
        var newUsername = event.target.value;
        setUsername(newUsername);
        validateUsername(newUsername);
    }
    const generateRandomName = () =>{
        const randomName = generateRandomUsername();
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

    const saleItem = async () => {
        setLoading(true)
        const moneyAfterSale = await SaleItem(itemDetail.id, saleNumber)
        setLoading(false)
        if (moneyAfterSale === props.me.money) toast.error('Không bán được vật phẩm vì vật phẩm này không bán được!');
        else {
            toast.success('Bán thành công! Tiền đã vào ví hihi');
            props.me.money = moneyAfterSale
            let remain = itemDetail.quantity - saleNumber
            if (remain > 0){
                itemDetail.quantity = remain
                setItemDetail({...itemDetail, quantity: remain})
            }
            else {
                const updatedList = props.listItem.filter(item => item.id !== itemDetail.id);
                props.setListItem(updatedList);
            }
        }

    }
    const handleShowChangeNameDiv = () => {
        setIsChangeNameCard(true)
        setErrorMessage('')
    }
    const handleShowSaleProductDiv = () => {
        setSaleProduct(true)
    }
    const handleShowDonateProductDiv = () => {
        setDonateProduct(true)
    }
    const handleShowExitDiv = () => {
        if (donateProduct) {
            setDonateProduct(false)
            setSelectedFriend(null)
        }
        if (saleProduct) setSaleProduct(false)
        if (isChangeNameCard) setIsChangeNameCard(false)
    }

    useEffect(() => {
        setLoading(true)
        GetFriends().then(res => {
            setListFriend(res);
        })
        setLoading(false)
    }, [])
    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
    };
    const donateItem = () => {
        if (selectedFriend !== null) {
            socket.publish({
                destination: '/app/donate',
                body: JSON.stringify({
                    receiverId: selectedFriend.user.id,
                    itemId: itemDetail.id,
                    amount: donateNumber
                })
            });
            toast.success('Tặng thành công!');
            let remain = itemDetail.quantity - donateNumber
            if (remain > 0) {
                itemDetail.quantity = remain
                setItemDetail({...itemDetail, quantity: remain})
            } else {
                const updatedList = props.listItem.filter(item => item.id !== itemDetail.id);
                props.setListItem(updatedList);
            }
        } else toast.error('Chưa chọn người nhận kìa má!');
     
    }

    return (
        <>
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
                        {props.listItem.length > 0 && (
                            <div className="modal-body-bag modal-height">
                                <div className="modal-left-container">
                                    {props.listItem.map((item, index) => (
                                        <div key={index} className={`item-container ${itemDetail !== null && itemDetail.id === item.id ? 'chosen' : ''}`} >
                                            <img src={item.product.urlImage} alt="item" className="item-image" onClick={() => showDetailItem(item.id)} />
                                            <p className="item-quantity">{item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-right-container">
                                    {itemDetail !== null &&
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
                                                    {isChangeNameCard && itemDetail.product.id === '2' && (
                                                        <>
                                                            <div className="change-name-profile-container">
                                                                <div className='input-and-dice' style={{ width: '70%' }}>
                                                                    <input type="text" value={username ? username : props.me.username} name="username" maxLength={20} placeholder={props.me.username} onChange={handleChangeUsername} />
                                                                    <img src={dice} title="Tạo ngẫu nhiên" alt="random" className="dice" onClick={generateRandomName} />
                                                                </div>
                                                            </div>
                                                            <p style={{ color: 'red', fontStyle: 'italic' }}>{errorMessage}</p>
                                                        </>
                                                    )}
                                                    {/* bán vật phẩm */}
                                                    {saleProduct && (
                                                        <>
                                                            <div className="change-name-profile-container">
                                                                <div style={{ width: '90%', borderTop: '2px solid', paddingTop: '10px', fontSize: '14px' }}>
                                                                    <input
                                                                        type="range"
                                                                        min={1}
                                                                        max={itemDetail.quantity}
                                                                        value={saleNumber}
                                                                        onChange={e => setSaleNumber(e.target.value)}
                                                                    />
                                                                    <p>Bán:
                                                                        <span style={{ color: '#41B06E', fontSize: '18px' }}> {saleNumber} </span>
                                                                        {itemDetail.product.name}
                                                                    </p>
                                                                    <p>Số tiền nhận được:
                                                                        <span style={{ color: '#41B06E', fontSize: '18px' }}> {formatCurrency(itemDetail.product.price * 0.05 * saleNumber)} </span>
                                                                        <span> <FontAwesomeIcon icon={faCoins} className="money-icon" /></span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <p style={{ color: 'red', fontStyle: 'italic' }}>{errorMessage}</p>
                                                        </>
                                                    )}
                                                    {/* tặng vật phẩm */}
                                                    {donateProduct && (
                                                        <>
                                                            <div className="change-name-profile-container">
                                                                <div style={{ width: '90%', borderTop: '2px solid', paddingTop: '10px', fontSize: '14px' }}>
                                                                    <input
                                                                        type="range"
                                                                        min={1}
                                                                        max={itemDetail.quantity}
                                                                        value={donateNumber}
                                                                        onChange={e => setDonateNumber(e.target.value)}
                                                                    />
                                                                    <div className="gift-list-container">
                                                                        <p>
                                                                            Tặng: <span className="donate-number">{donateNumber}</span> {itemDetail.product.name}
                                                                        </p>
                                                                        <p>Tặng Cho:</p>
                                                                        <ul className="friend-list">
                                                                            {listFriend.map((friend, index) => (
                                                                                <li key={index} className={selectedFriend === friend ? 'selected' : ''} onClick={() => handleFriendClick(friend)}>
                                                                                    {friend.user.username}
                                                                                </li>
                                                                            ))}
                                                                        </ul>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p style={{ color: 'red', fontStyle: 'italic' }}>{errorMessage}</p>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="item-action-button-container">
                                                    {(donateProduct || saleProduct || isChangeNameCard) && <button className="item-action-button exit-button" onClick={handleShowExitDiv}>Thoát</button>}
                                                    {itemDetail.product.saleAble && !donateProduct && !isChangeNameCard && <button className="item-action-button sell-button" onClick={saleProduct ? saleItem : handleShowSaleProductDiv}>Bán</button>}
                                                    {itemDetail.product.useAble && !saleProduct && !donateProduct && <button className="item-action-button use-button" onClick={isChangeNameCard ? changeName : handleShowChangeNameDiv}>{isChangeNameCard ? 'Đổi tên':'Dùng'}</button>}
                                                    {itemDetail.product.donateAble && !saleProduct && !isChangeNameCard && <button className="item-action-button donate-button" onClick={donateProduct ? donateItem : handleShowDonateProductDiv}>Tặng</button>}
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
            {isLoading && <Loader isLoading={isLoading} />}
        </>
    );
}
export default ModalBag;