import React, { useEffect, useState } from 'react';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircle, faEnvelope, faBell, faCoins, faGem } from '@fortawesome/free-solid-svg-icons';

const HomeTop = (props) => {

    const handleOpenModalProfile = () => {
        if (!props.showModalCreateRoom && !props.showModalBag && !props.showModal) {
            props.setShowModalProfile(true);
        }
    };

    return (
        <div className="top-container">
        <div className="info-container">
            <img src={props.me?.avatar?props.me.avatar.data:userAvt} alt="avatar" id="avatar" onClick={handleOpenModalProfile}/>

            <div className="username-container">
                <p id="username-title">{props.me?.username}</p>
            </div>
        </div>
        <div className="money-container">
            <div className="coin-container">
                <i className="fa-solid fa-coins "></i>
            <FontAwesomeIcon icon={faCoins} className="money-icon"/>
                <p className="money coin">{props.me?.money}</p>
            </div>
            {/* <div className="diamond-container">
            <FontAwesomeIcon icon={faGem} className="gem-icon"/>
                <p className="money gem">999,999</p>
            </div> */}
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