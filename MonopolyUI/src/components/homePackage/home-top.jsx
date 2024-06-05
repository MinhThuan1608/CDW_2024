import React from 'react';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircle, faSignOut, faBell, faCoins, faUserFriends, faUser, faTrophy, faLandMineOn, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../gameBoard/help';
import { useNavigate } from 'react-router-dom';

const HomeTop = (props) => {
    const navigate = useNavigate();

    const handleIconClick = () => {
        navigate('/admin');
    };

    const handleOpenModalProfile = () => {
        if (!props.showModalCreateRoom && !props.showModalBag && !props.showModal && !props.showModalFriend && !props.showModalSetting) {
            props.setShowModalProfile(true);
        }
    };
    const handleLogOut = () => {
        sessionStorage.clear()
        window.location = '/login'
    };

    const handleOpenFriendModal = () => {
        if (!props.showModalCreateRoom && !props.showModalBag && !props.showModal && !props.showModalProfile && !props.showModalSetting) {
            props.setShowModalFriend(true);
        }
    }
    const handleOpenSettingModal = () => {
        if (!props.showModalCreateRoom && !props.showModalBag && !props.showModal && !props.showModalProfile && !props.showModalFriend) {
            props.setShowModalSetting(true);
        }
    }

    return (
        <div className="top-container">
            <div className="info-container">
                <img src={props.me?.avatar ? props.me.avatar.data : userAvt} alt="avatar" id="avatar" onClick={handleOpenModalProfile} />

                <div className="username-container-home ">
                    <p id="username-title">{props.me?.username}</p>
                </div>
            </div>
            <div className="money-container">
                <div className="coin-container">
                    <i className="fa-solid fa-coins "></i>
                    <FontAwesomeIcon icon={faCoins} className="money-icon" />
                    <p className="money coin">{props.me?.money ? formatCurrency(props.me?.money) : props.me?.money}</p>
                </div>
                <div className="coin-container">
                    <i className="fa-solid fa-coins "></i>
                    <FontAwesomeIcon icon={faTrophy} className="money-icon" />
                    <p className="money coin">{props.me?.exp}</p>
                </div>
            </div>
            <div className="setting-container">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faSignOut} className="setting-icon" id="letter" onClick={handleLogOut} />
                    <FontAwesomeIcon icon={faCircle} className="dot" id="setting-dot" />
                </div>
                <div className="icon-container">
                    <FontAwesomeIcon icon={faGear} className="setting-icon" id="setting" onClick={handleOpenSettingModal} />
                    <FontAwesomeIcon icon={faCircle} className="dot" id="setting-dot" />
                </div>
                <div className="icon-container">
                    <FontAwesomeIcon icon={faUserFriends} className="setting-icon" id="letter" onClick={handleOpenFriendModal} />
                    <FontAwesomeIcon icon={faCircle} className={props.friendRequests.length ? "dot show" : "dot"} id="letter-dot" />
                </div>
                {props.me?.role === 'ADMIN' && (
                    <div className="icon-container">
                        <FontAwesomeIcon icon={faUserTie} className="setting-icon" id="notification" onClick={handleIconClick} />
                    </div>
                )
                }
            </div>
        </div>
    );
}
export default HomeTop;