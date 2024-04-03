import React from 'react';
import { useState } from 'react';
import SelectRoomModal from './select-room-modal';
import CreateRoomModal from './create-room-modal';
import ModalBag from './modal-bag';


const HomeMiddle = ({showModal,setShowModal, showModalCreateRoom ,setShowModalCreateRoom, showModalBag, setShowModalBag}) => {
    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
 
    return (
        <div className="middle-container">
            {showModal && (<SelectRoomModal showModal={showModal} setShowModal={setShowModal} 
            showJoinRoomModal={showJoinRoomModal} setShowJoinRoomModal={setShowJoinRoomModal}/>)}
            {showModalCreateRoom && (<CreateRoomModal showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom}/>)}
            {showModalBag && (<ModalBag showModalBag={showModalBag} setShowModalBag={setShowModalBag}/>)}
            
        </div>
    );
}
export default HomeMiddle;