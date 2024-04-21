import React from 'react';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { RequestAddFriend } from '../../api_caller/user';
import { toast } from 'react-toastify';


const WaitRoomOnlineUser = (props) => {

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

    const handleAddFriend = async (userId) => {
        // const res = await RequestAddFriend(userId)
        // if (res) {
        //     switch (res) {
        //         case 'REQUESTED':
        //             toast.success('Gửi lời mời thành công')
        //             break;
        //         case 'ADDED':
        //             toast.success('Kết bạn thành công')
        //             break;
        //     }
        // }
    }

    return (
        <div className="online-part">
            <p className="title-chat">Online</p>
            <div className="userList force-overflow scrollbar">
                {props.userOnline.map((user, index) =>
                    props.me.id && props.me.id !== user.id ?
                        <div className='user-card' key={index}>
                            <img src={user.avatar ? user.avatar.data : userAvt} alt='user-avt' className="img-frame-player-onl" />
                            <div className='online-status'></div>
                            <div className='user-card-name-container'>
                                <span className='user-card-name'>{user.username}</span>
                                <span className='user-card-status' style={{ color: user.status === 'ONLINE' ? 'green' : user.status === 'IN_ROOM' ? 'orange' : 'red' }}>
                                    {user.status === 'IN_ROOM' ? 'Trong phòng chờ' : user.status === 'IN_GAME' ? 'Đang thi đấu' : user.status}</span>
                            </div>
                            <div className="join">
                                <FontAwesomeIcon icon={faUserPlus} className="add-friend-button" onClick={() => handleAddFriend(user.id)} />
                                <button className="join-button" onClick={() => handleInviteUser(user.id)}>Mời</button>
                            </div>

                        </div> : <div key={index} style={{ display: 'none' }}></div>


                )}

            </div>

        </div>
    );
}
export default WaitRoomOnlineUser;