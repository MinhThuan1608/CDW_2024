import React, { useEffect } from 'react';
import { useState } from 'react';
import shopImg from '../../assert/images/icon/shops.png';
import schoolBag from '../../assert/images/icon/school-bag.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { GetRoomMeIn, QuickJoinRoom } from '../../api_caller/room';
import { toast } from 'react-toastify';


const HomeBottom = ({ showModal, setShowModal, showModalCreateRoom, setShowModalCreateRoom, showModalBag,
    setShowModalBag, showModalShop, setShowModalShop, showModalFriend, socket, me, listItem, setListItem }) => {
    const [roomMeIn, setRoomMeIn] = useState(null)
   

    useEffect(() => {
        GetRoomMeIn().then(res => {
            if (res) {
                setRoomMeIn(res)
                if (socket)
                    var roomSubscribe = socket.subscribe('/topic/game/room/' + res.id, (message) => {
                        const messResponse = JSON.parse(message.body);
                        console.log(messResponse);
                        switch (messResponse.messageType) {
                            case 'JOIN':
                                toast.warn("Có ai đó vừa vào phòng")
                                break
                            case 'LEAVE':
                                toast.warn("Bạn cùng phòng của bạn không muốn chơi với bạn nữa :)))")
                                break
                            case 'KICK':
                                toast.warn("Bạn đã bị đá ra khỏi phòng :))))")
                                roomSubscribe.unsubscribe()
                                setRoomMeIn(null)
                                break
                            case 'TIME_OUT':
                                toast.warn("Phòng của bạn đã hết hạn")
                                setRoomMeIn(null)
                                break
                            case 'MESSAGE':
                                toast(`Bạn có tin nhắn mới từ ${messResponse.sender.username}: ${messResponse.content}`)
                                break
                            case 'START_GAME':
                                window.location = '/game/' + res.id
                                break
                            default:
                                break
                        }
                    });
            }
        })
    }, [socket])

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

    const handleQuickJoinRoom = async () => {
        const quickRoomid = await QuickJoinRoom();
        if(quickRoomid === null){
        toast.warn("Chưa xác thực mail kìa!!!")
        }else{
            window.location = '/wait-room/' + quickRoomid
        }    

    }
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
                   {listItem.length > 0 &&  <FontAwesomeIcon icon={faCircle} className="dot show" id="bag-dot" />}
                </div>

            </div>
            <div className="action-button-container">
                {roomMeIn?.playing ? (<button className="action-button" id="return-room-button" onClick={handleReturnGame}>TRỞ LẠI GAME</button>) :
                    roomMeIn ? <button className="action-button" id="return-room-button" onClick={handleReturnRoom}>TRỞ LẠI PHÒNG</button> :
                        <>
                            <button className="action-button" onClick={handleQuickJoinRoom}>VÀO NHANH</button>
                            <button className="action-button"  onClick={handleOpenModalCreateRoom} >TẠO PHÒNG</button>
                            <button className="action-button"  onClick={handleOpenModal}>CHỌN PHÒNG</button>
                        </>}
            </div>


        </div>
    );
}
export default HomeBottom;