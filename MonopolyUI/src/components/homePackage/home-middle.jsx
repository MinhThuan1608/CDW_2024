import React from 'react';
import { useState } from 'react';
import SelectRoomModal from './select-room-modal';
import CreateRoomModal from './create-room-modal';
import ModalBag from './modal-bag';
import EditUserProfileModal from './user-edit-profile-modal';
import ModalShop from './modal-shop';
import FriendModal from './friend-model';
import SettingModal from './setting-modal';


const HomeMiddle = ({ me, setMe, showModal, setShowModal, showModalCreateRoom, setShowModalCreateRoom,
    showModalBag, setShowModalBag, showModalProfile, setShowModalProfile, showModalShop,
     setShowModalShop, showModalFriend, setShowModalFriend, friendRequests, setFriendRequests,showModalSetting, setShowModalSetting , listItem, setListItem }) => {

    const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);

    return (
        <div className="middle-container">
            {showModal && (<SelectRoomModal showModal={showModal} setShowModal={setShowModal}
                showJoinRoomModal={showJoinRoomModal} setShowJoinRoomModal={setShowJoinRoomModal} />)}

            {showModalFriend && (<FriendModal showModalFriend={showModalFriend} setShowModalFriend={setShowModalFriend}
                friendRequests={friendRequests} setFriendRequests={setFriendRequests} me={me} />)}
            {showModalCreateRoom && (<CreateRoomModal showModalCreateRoom={showModalCreateRoom} setShowModalCreateRoom={setShowModalCreateRoom} />)}
            {showModalBag && (<ModalBag me={me} setMe={setMe} showModalBag={showModalBag} setShowModalBag={setShowModalBag} listItem={listItem} setListItem={setListItem} />)}
            {showModalProfile && (<EditUserProfileModal me={me} setMe={setMe} showModalProfile={showModalProfile} setShowModalProfile={setShowModalProfile} />)}
            {showModalShop && (<ModalShop me={me} showModalShop={showModalShop} setShowModalShop={setShowModalShop} />)}
            {showModalSetting && (<SettingModal setShowModalSetting={setShowModalSetting} />)}
        </div>
    );
}
export default HomeMiddle;