import React, { useEffect, useState } from 'react';
import { GetAllUsers, GetUserBySearch, LockAccount } from '../../api_caller/admin';
import { faAngleDoubleLeft, faAngleDoubleRight, faArrowDown, faArrowLeft, faArrowRight, faCheck, faCheckCircle, faLock, faUnlock, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from '../loader/loader';

import userAvt from '../../assert/images/avatar/meo.jpg';
import { formatDate, formatDateAndTime } from '../gameBoard/help';
import { toast } from 'react-toastify';

const UserManagement = (props) => {
    const [isLoading, setLoading] = useState(false);

    const getAllUsers = async (username, page) => {
        const dataResponse = await GetUserBySearch(username, page);
        console.log(dataResponse)
        if (dataResponse.userResponse) {
            props.setListUser(dataResponse.userResponse)
            props.setTotalPagesUser(dataResponse.totalPage)
            props.setCurrentPageUser(dataResponse.page)
            setLoading(false)
        }
    }


    useEffect(() => {
        setLoading(true)
        getAllUsers(props.searchValue, 0);
    }, [])

    const handlePrevPage = () => {
        setLoading(true)
        getAllUsers(props.searchValue, props.currentPageUser - 1)
        props.setCurrentPageUser(props.currentPageUser - 1)
    }
    const handleNextPage = () => {
        setLoading(true)
        getAllUsers(props.searchValue, props.currentPageUser + 1)
        props.setCurrentPageUser(props.currentPageUser + 1)
    }
    const handleFirstPage = () => {
        setLoading(true)
        getAllUsers(props.searchValue, 0)
        props.setCurrentPageUser(0)

    }
    const handleEndPage = () => {
        setLoading(true)
        getAllUsers(props.searchValue, props.totalPagesUser - 1)
        props.setCurrentPageUser(props.totalPagesUser - 1)

    }

    const handleLockUser = async (user) => {
        setLoading(true)

        const result = await LockAccount(user.id);

        props.setListUser(prevListUser =>
            prevListUser.map(us =>
                us.id === user.id ? { ...us, nonLocked: !user.nonLocked } : us
            )
        );
        setLoading(false)

    }
    return (
        <div className='admin-tab-content'>
            <p className='user-list-length'>Có:
                <span className='quantity-user'> {props.listUser.length} </span>
                người dùng
            </p>
            {props.listUser.map((user, index) => (
                <div className='ad-user-list-item' key={index}>
                    <div className='ad-user-list-left'>
                        <img src={user.avatar ? user.avatar.data : userAvt} alt="avatar" className="admin-avatar admin-avatar-user" />

                        <div className="admin-username">
                            <p className='user-id'>id: {user.id}</p>
                            <p >{user.username}</p>
                        </div>

                    </div>
                    <div className='ad-user-list-center'>
                        <p className='lastLoginDate'>Last login: {formatDateAndTime(user.lastLoginDate)}</p>
                        <p>
                            {!user.confirmEmail ? <FontAwesomeIcon icon={faWarning} className="admin-icon-warning icon-win" />
                                : <FontAwesomeIcon icon={faCheckCircle} className="admin-icon-check" />}
                            {user.email}
                        </p>

                    </div>
                    <div className='ad-user-list-right'>
                        {user.id !== props.me?.id &&
                            (!user.nonLocked ?
                                <FontAwesomeIcon icon={faLock} className="icon-lose admin-icon icon-lock"
                                    onClick={() => handleLockUser(user)} title='Mở Khoá TK' />
                                :
                                <FontAwesomeIcon icon={faUnlock} className="icon-win admin-icon icon-lock"
                                    onClick={() =>handleLockUser(user)} title='Khoá TK' />
                                // <button className='lock-btn' onClick={() => handleLockUser(user)}>Khoá</button>
                            )
                        }
                    </div>

                </div>
            ))}

            <div className='pageable'>
                {props.currentPageUser !== props.totalPagesUser - 1 && props.totalPagesUser !== 0 && (
                    <>
                        <p className='more-btn' aria-disabled onClick={handleEndPage} title='Đến cuối'>
                            <FontAwesomeIcon icon={faAngleDoubleRight} className="admin-icon" />
                        </p>
                        <p className='more-btn' aria-disabled onClick={handleNextPage} title='Xem thêm'>
                            <FontAwesomeIcon icon={faArrowRight} className="admin-icon" />
                        </p>
                    </>
                )}
                <p className='more-btn'>
                    {props.currentPageUser === 0 && props.totalPagesUser === 0 ? 0 : props.currentPageUser + 1} / {props.totalPagesUser}
                </p>

                {props.currentPageUser !== 0 && (
                    <>
                        <p className='more-btn' onClick={handlePrevPage} title='Quay lại'>
                            <FontAwesomeIcon icon={faArrowLeft} className="admin-icon" />
                        </p>
                        <p className='more-btn' aria-disabled onClick={handleFirstPage} title='Về đầu tiên'>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="admin-icon" />
                        </p>
                    </>
                )}

            </div>
            {isLoading && <Loader isLoading={isLoading} />}
        </div>
    );
};

export default UserManagement;
