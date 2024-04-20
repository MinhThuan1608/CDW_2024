import React, { useEffect } from 'react';
import { useState } from 'react';
import shopImg from '../../assert/images/icon/shops.png';
import schoolBag from '../../assert/images/icon/school-bag.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { GetRoomMeIn } from '../../api_caller/room';


const HomeBottom = ({ showModal, setShowModal, showModalCreateRoom, setShowModalCreateRoom, showModalBag
    , setShowModalBag, showModalShop, setShowModalShop, showModalFriend }) => {
    const [roomMeIn, setRoomMeIn] = useState(null)

    useEffect(() => {
        GetRoomMeIn().then(res => {
            if (res) setRoomMeIn(res)
        })
    }, [])
    // Hàm xử lý khi ấn vào ô chọn phòng
    const handleOpenModal = () => {
        if (!showModalCreateRoom && !showModalBag && !showModalShop && !showModalFriend) {
            setShowModal(true);
        }
    };
    const handleOpenModalCreateRoom = () => {
        if (!showModal && !showModalBag && !showModalShop && !showModalFriend) {
            setShowModalCreateRoom(true);
        }
    };
    const handleOpenModalBag = () => {
        if (!showModal && !showModalCreateRoom && !showModalShop && !showModalFriend) {
            setShowModalBag(true);
        }
    };
    const handleOpenModalShop = () => {
        if (!showModal && !showModalCreateRoom && !showModalBag && !showModalFriend) {
            setShowModalShop(true);
        }
    };


    const handleReturnRoom = () => {
        window.location = '/wait-room/' + roomMeIn.id
    }

    const handleReturnGame = () => {
        window.location = '/game/' + roomMeIn.id
    }

    return (
        <div className="bottom-container">
            <div className="util-container">
                <div className="shop-container">
                    <img src={shopImg} alt="shop" className="util-icon" id="shop-image"
                        title="Cửa hàng" onClick={handleOpenModalShop} />
                    <FontAwesomeIcon icon={faCircle} className="dot" id="shop-dot" />
                </div>
                <div className="shop-container" data-bs-toggle="tooltip" title="Túi đồ">
                    <img src={schoolBag} alt="bag" className="util-icon" id="bag-image"
                        onClick={handleOpenModalBag} />
                    <FontAwesomeIcon icon={faCircle} className="dot show" id="bag-dot" />
                </div>
                <div className="shop-container" data-bs-toggle="tooltip" title="Túi đồ">
                    <img src={schoolBag} alt="bag" className="util-icon" id="bag-image"
                        onClick={handleOpenModalBag} />
                    <FontAwesomeIcon icon={faCircle} className="dot show" id="bag-dot" />
                </div>
            </div>
            <div className="action-button-container">
                {roomMeIn?.playing ? (<button className="action-button" id="return-room-button" onClick={handleReturnGame}>TRỞ LẠI GAME</button>) :
                    roomMeIn ? <button className="action-button" id="return-room-button" onClick={handleReturnRoom}>TRỞ LẠI PHÒNG</button> :
                        <><button className="action-button" id="create-room-button" onClick={handleOpenModalCreateRoom} >TẠO PHÒNG</button>
                            <button className="action-button" id="choose-room-button" onClick={handleOpenModal}>CHỌN PHÒNG</button></>}
            </div>


        </div>
    );
}
export default HomeBottom;