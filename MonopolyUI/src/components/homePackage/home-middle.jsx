import React from 'react';
import { useState } from 'react';
import SelectRoomModal from './select-room-modal';
import CreateRoomModal from './create-room-modal';
import ModalBag from './modal-bag';
import EditUserProfileModal from './user-edit-profile-modal';
import ModalShop from './modal-shop';


const HomeMiddle = ({showModal,setShowModal, showModalCreateRoom ,setShowModalCreateRoom, 
    showModalBag, setShowModalBag, showModalProfile, setShowModalProfile, showModalShop, setShowModalShop}) => {


    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
 
    return (
        <div className="middle-container">
            {showModal && (<SelectRoomModal showModal={showModal} setShowModal={setShowModal} 
            showJoinRoomModal={showJoinRoomModal} setShowJoinRoomModal={setShowJoinRoomModal}/>)}

            {showModalCreateRoom && (<CreateRoomModal showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom}/>)}
            {showModalBag && (<ModalBag showModalBag={showModalBag} setShowModalBag={setShowModalBag}/>)}
            {showModalProfile && (<EditUserProfileModal showModalProfile={showModalProfile} setShowModalProfile={setShowModalProfile}/>)}
            {showModalShop && (<ModalShop showModalShop={showModalShop} setShowModalShop={setShowModalShop}/>)}
            
        </div>
    );
}
export default HomeMiddle;