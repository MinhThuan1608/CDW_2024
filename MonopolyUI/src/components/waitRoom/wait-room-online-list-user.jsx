import React, { useEffect, useState } from 'react';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Styles from '../../assert/style/online-list-waitroom.module.css'
import { GetFriends, RequestAddFriend } from '../../api_caller/user';
import { toast } from 'react-toastify';


const WaitRoomOnlineUser = (props) => {

    const [tabSelected, setTabSelected] = useState(1)
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (tabSelected === 1)
            GetFriends().then(res => {
                var listUserConverted = res.map((friend => friend.user))
                listUserConverted.forEach(user => {
                    var userOnl = props.userOnline.find(uo => uo.id === user.id)
                    if (userOnl) user.status = userOnl.status
                    else user.status = "OFFLINE"
                })
                listUserConverted.sort((u1, u2) => {
                    if (u1.status !== 'OFFLINE' && u2.status === 'OFFLINE') return -1
                    if (u1.status === 'OFFLINE' && u2.status !== 'OFFLINE') return 1
                    return 0
                })
                setUsers(listUserConverted)
            })
        else if (tabSelected === 2 && props.userOnline.length > 0){
            var userOnl = [...props.userOnline]
            userOnl.forEach(uo => {
                if (users.find(user => user.id===uo.id)) uo.isFriend = true
                else uo.isFriend = false
            })
            setUsers(userOnl)
        }
            
    }, [tabSelected, props.userOnline])

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
        const res = await RequestAddFriend(userId)
        if (res) {
            switch (res) {
                case 'REQUESTED':
                    toast.success('Gửi lời mời thành công')
                    break;
                case 'ADDED':
                    toast.success('Kết bạn thành công')
                    break;
            }
        }
    }

    return (
        <div className="online-part">
            <div className={Styles.tabsContainer}>
                <p className={`title-chat ${Styles.tab} ${tabSelected === 1 ? Styles.active : ''}`} onClick={() => setTabSelected(1)}>Bạn bè</p>
                <p className={`title-chat ${Styles.tab} ${tabSelected === 2 ? Styles.active : ''}`} onClick={() => setTabSelected(2)}>Online</p>
            </div>
            <div className="userList force-overflow scrollbar">
                {users.map((user, index) =>
                    props.me.id && props.me.id !== user.id ?
                        <div className={`user-card ${Styles.userCard}`} key={index}>
                            <div className={Styles.userCardLeft}>
                                <img src={user.avatar ? user.avatar.data : userAvt} alt='user-avt' className="img-frame-player-onl" />
                                {props.userOnline.find(uo => uo.id === user.id) ? <div className='online-status'></div> : <></>}
                                <div className='user-card-name-container'>
                                    <span className='user-card-name'>{user.username}</span>
                                    {props.userOnline.find(uo => uo.id === user.id) ?
                                        <span className='user-card-status' style={{
                                            color: user.status === 'ONLINE' ? 'green' : user.status === 'IN_ROOM' ? 'orange'
                                                : user.status === 'IN_GAME' ? 'red' : 'grey'
                                        }}>
                                            {user.status === 'IN_ROOM' ? 'Trong phòng chờ'
                                                : user.status === 'IN_GAME' ? 'Đang thi đấu'
                                                    : user.status === 'ONLINE' ? 'Online' : 'Offline'}</span>
                                        : <span className='user-card-status' style={{ color: 'grey' }}>Offline</span>}

                                </div>
                            </div>
                            <div className={`join ${Styles.inviteContainer}`}>
                                {tabSelected === 2 && !user.isFriend ? <FontAwesomeIcon icon={faUserPlus} className="add-friend-button" onClick={() => handleAddFriend(user.id)} /> : <></>}
                                {user.status === 'ONLINE' ? <button className="join-button" onClick={() => handleInviteUser(user.id)}>Mời</button> : <></>}

                            </div>

                        </div> : <div key={index} style={{ display: 'none' }}></div>


                )}

            </div>

        </div>
    );
}
export default WaitRoomOnlineUser;