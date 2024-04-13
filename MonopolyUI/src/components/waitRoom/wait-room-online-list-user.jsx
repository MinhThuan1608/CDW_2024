import React from 'react';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';


const WaitRoomOnlineUser = (props) => {
    const me = JSON.parse(sessionStorage.getItem('user'))

    const handleInviteUser = (id) => {
        props.socket.publish({
            destination: '/app/room/invite',
            body: JSON.stringify({
                receiverId: id,
                roomId: props.roomId,
                roomPass: props.roomPassword,
                inviteMessageType: "INVITE",
            })
        });
    }

    return (
        <div className="online-part">
            <p className="title-chat">Online</p>
            <div className="userList force-overflow scrollbar">
                {props.userOnline.map((user, index) =>
                    me.id !== user.id ?
                        <div className='user-card' key={index}>
                            <img src={user.avatar ? user.avatar.data : userAvt} alt='user-avt' className="img-frame-player-onl" />
                            <div className='online-status'></div>
                            <div className='user-card-name-container'>
                                <span className='user-card-name'>{user.username}</span>
                                <span className='user-card-status' style={{ color: user.status === 'ONLINE' ? 'green' : user.status === 'IN_ROOM' ? 'orange' : 'red' }}>
                                    {user.status === 'IN_ROOM'?'Trong phòng chờ':user.status === 'IN_GAME'?'Đang thi đấu': user.status}</span>
                            </div>
                            <button className="join" onClick={() => handleInviteUser(user.id)}>Mời</button>
                        </div> : <div key={index} style={{ display: 'none' }}></div>


                )}

            </div>

        </div>
    );
}
export default WaitRoomOnlineUser;