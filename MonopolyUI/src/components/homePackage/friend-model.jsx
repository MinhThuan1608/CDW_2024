import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Styles from '../../assert/style/friend-modal.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faUserAlt, faUserClock, faUsersLine } from '@fortawesome/free-solid-svg-icons';
import { GetAllRoom, JoinRoom } from '../../api_caller/room';
import { SocketContext } from '../../App';
import { AddFriend, GetFriendRequest, GetFriends, RemoveFriend, RemoveFriendRequest, RequestAddFriend, SearchUser } from '../../api_caller/user';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { tab } from '@testing-library/user-event/dist/tab';
import { toast } from 'react-toastify';


const FriendModal = (props) => {

    const [friends, setFriends] = useState([])
    const [filterKey, setFilterKey] = useState('')
    const [tabSelected, setTabSelected] = useState(1)
    const [userSearched, setUserSearched] = useState(null)

    useEffect(() => {
        if (tabSelected === 1)
            GetFriends().then(res => setFriends(res))
    }, [tabSelected])

    const handleCloseModal = () => {
        props.setShowModalFriend(false);
    };

    var timeOutSearchId;
    const searchUser = (e) => {
        clearTimeout(timeOutSearchId)
        timeOutSearchId = setTimeout(async () => {
            const user = await SearchUser(e.target.value)
            setUserSearched(user)

        }, 1000)
    }

    const sendAddFriendRequest = async (userId) => {
        const res = await RequestAddFriend(userId)
        if (!res) toast.error("Có lỗi gì đó xảy ra!")
        else
            switch (res) {
                case 'REQUESTED':
                    toast.success('Gửi lời mời thành công')
                    break
                case 'ADDED':
                    toast('Kết bạn thành công')
                    break;
                case 'RE_REQUEST':
                    toast.error('Bạn đã gửi lời mời kết bạn rồi! Ngta ghost bạn đếy :))')
                    break;
            }
    }

    const addFriend = async (requestId) => {
        const res = await AddFriend(requestId)
        if (res) {
            props.setFriendRequests(props.friendRequests.filter(r => r.id !== requestId))
            toast.success("Kết bạn thành công!")
        } else toast.error("Có lỗi xảy ra!")
    }

    const removeRequest = async (requestId) => {
        const res = await RemoveFriendRequest(requestId)
        if (res)
            props.setFriendRequests(props.friendRequests.filter(r => r.id !== requestId))
        else toast.error("Có lỗi xảy ra!")
    }

    const removeFriend = async (userId) => {
        const res = await RemoveFriend(userId)
        if (res) {
            setFriends(friends.filter(f => f.user.id !== userId))
            toast.success("Xóa bạn thành công!")
        }
        else toast.error("Có lỗi xảy ra!")
    }

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial', height: 'auto' }}
        >
            {props.showModalFriend && (
                <Modal.Dialog>
                    <Modal.Header className={Styles.modalHeader}>
                        <div className={Styles.tabsContainer}>
                            <p className={`${Styles.tabsButton} ${tabSelected === 1 ? Styles.active : ''}`} onClick={() => setTabSelected(1)}>Bạn bè</p>
                            <p className={`${Styles.tabsButton} ${tabSelected === 2 ? Styles.active : ''}`} onClick={() => setTabSelected(2)}>Yêu cầu</p>
                            <p className={`${Styles.tabsButton} ${tabSelected === 3 ? Styles.active : ''}`} onClick={() => setTabSelected(3)}>Tìm kiếm</p>
                        </div>
                        <button type="button" className={`btn-close ${Styles.btnClose}`} data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                    </Modal.Header>

                    <Modal.Body className={Styles.modalBody}>
                        {tabSelected === 1 || tabSelected === 3 ?
                            <div className={Styles.filterFriendContainer}>
                                <p>Tìm kiếm:</p>
                                <FloatingLabel className="mb-3 search-room-input" controlId="floatingInput"
                                    label="Nhập username">
                                    <Form.Control type="text" placeholder="" onChange={tabSelected === 1 ? e => setFilterKey(e.target.value) : searchUser} />
                                </FloatingLabel>
                            </div> : <></>}
                        <div className={Styles.listUser}>
                            {tabSelected === 1 ?
                                friends.filter(f => !filterKey || f.user.username.indexOf(filterKey) !== -1).map((friend, index) =>
                                    <div className={Styles.friendCard} key={index}>
                                        <div className={Styles.userCard}>
                                            <img src={friend.user?.avatar ? friend.user.avatar.data : userAvt} alt='user-avt' className="img-frame-player-onl" />
                                            <div className='online-status'></div>
                                            <div className='user-card-name-container'>
                                                <span className='user-card-name'>{friend.user?.username}</span>
                                            </div>
                                        </div>
                                        <button className={Styles.deleteBtn} onClick={() => removeFriend(friend.user?.id)}>Xóa</button>
                                    </div>)
                                : tabSelected === 2 ?
                                    props.friendRequests.map((request, index) =>
                                        <div className={Styles.friendCard} key={index}>
                                            <div className={Styles.userCard}>
                                                <img src={request.sender?.avatar ? request.sender.avatar.data : userAvt} alt='user-avt' className="img-frame-player-onl" />
                                                <div className='online-status'></div>
                                                <div className='user-card-name-container'>
                                                    <span className='user-card-name'>{request.sender?.username}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <button className={Styles.deleteBtn} onClick={() => removeRequest(request.id)}>Xóa</button>
                                                <button className={Styles.acceptBtn} onClick={() => addFriend(request.id)}>Chấp nhận</button>
                                            </div>
                                        </div>)
                                    : userSearched ?
                                        <div className={Styles.friendCard} >
                                            <div className={Styles.userCard}>
                                                <img src={userSearched.avatar ? userSearched.avatar.data : userAvt} alt='user-avt' className="img-frame-player-onl" />
                                                <div className='online-status'></div>
                                                <div className='user-card-name-container'>
                                                    <span className='user-card-name'>{userSearched.username}</span>
                                                </div>
                                            </div>
                                            <button className={`${Styles.acceptBtn} ${friends.some(f => f.user.id === userSearched.id) ? Styles.disable : ''}`}
                                                onClick={friends.some(f => f.user.id === userSearched.id) ? null : () => sendAddFriendRequest(userSearched.id)}>
                                                {friends.some(f => f.user.id === userSearched.id) ? "✓ Bạn bè" : "Kết bạn"}</button>
                                        </div> : <p className={Styles.noResultP}>Không tìm thấy kết quả</p>}
                        </div>
                    </Modal.Body>

                </Modal.Dialog>
            )}

        </div>
    );
}
export default FriendModal;