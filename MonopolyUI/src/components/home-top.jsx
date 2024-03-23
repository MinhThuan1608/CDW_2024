import React from 'react';
import userAvt from '../assert/images/avatar/user.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircle, faEnvelope, faBell, faCoins, faGem } from '@fortawesome/free-solid-svg-icons';

const HomeTop = () => {
    return (
        <div className="top-container">
        <div className="info-container">
            <img src={userAvt} alt="avatar" id="avatar"/>
            <div className="username-container">
                <p id="username-title">Faker#T1</p>
            </div>
        </div>
        <div className="money-container">
            <div className="coin-container">
                <i className="fa-solid fa-coins "></i>
            <FontAwesomeIcon icon={faCoins} className="money-icon"/>
                <p className="money coin">999,999,999</p>
            </div>
            <div className="diamond-container">
            <FontAwesomeIcon icon={faGem} className="gem-icon"/>
                <p className="money gem">999,999</p>
            </div>
        </div>
        <div className="setting-container">
            <div className="icon-container">
            <FontAwesomeIcon icon={faGear} className="setting-icon" id="setting"/>
            <FontAwesomeIcon icon={faCircle} className="dot" id="setting-dot"/>
            </div>
            <div className="icon-container">
            <FontAwesomeIcon icon={faEnvelope} className="setting-icon" id="letter"/>
            <FontAwesomeIcon icon={faCircle} className="dot show" id="letter-dot"/>
            </div>
            <div className="icon-container">
            <FontAwesomeIcon icon={faBell} className="setting-icon" id="notification"/>
            <FontAwesomeIcon icon={faCircle} className="dot" id="notification-dot"/>
            </div>
        </div>
    </div>
    );
}
export default HomeTop;