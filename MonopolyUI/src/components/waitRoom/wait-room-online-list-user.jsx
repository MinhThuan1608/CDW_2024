import React from 'react';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';


const WaitRoomOnlineUser = (props) => {
    const listUser = [
        {img: userAvt, name: 'thuy', status: 1},
        {img: userAvt, name: 'thuan', status: 1},
        {img: userAvt, name: 'thuan', status: 1},
        {img: userAvt, name: 'thuan', status: 1},
        {img: userAvt, name: 'thuan', status: 1},
        {img: userAvt, name: 'thuan', status: 1},
        {img: userAvt, name: 'thuan', status: 1},
    ]
    return (
        <div className="online-part">
        <p className="title-chat">Online</p>
        <div className="userList force-overflow scrollbar">
            {listUser.map((user, index) => (
                <div className='user-card' key={index}>
                    <img src={user.img} alt='user-avt' className="img-frame-player-onl"/>
                    <div className='online-status'></div>
                    <span className='user-card-name'>{user.name}</span>
                    <div className="join">Mời</div>
                </div>
            ))}

        </div>

    </div>
    );
}
export default WaitRoomOnlineUser;