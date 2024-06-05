import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import userAvt from '../../assert/images/avatar/meo.jpg';
import { faChartLine, faChessBoard, faUsers } from '@fortawesome/free-solid-svg-icons';

const SideBar = (props) => {
    const [activeTab, setActiveTab] = useState('1');

    const handleTabSide1 = () => {
        props.setShowStatistical(true)
        props.setShowUserBar(false)
        props.setShowMatchBar(false)
        setActiveTab('1')
    }
    const handleTabSide2 = () => {
        props.setShowUserBar(true)
        props.setShowStatistical(false)
        props.setShowMatchBar(false)
        setActiveTab('2')
    }
    const handleTabSide3 = () => {
        props.setShowMatchBar(true)
        props.setShowStatistical(false)
        props.setShowUserBar(false)
        setActiveTab('3')
    }

    return (
        <div className="admin-sidebar">
            {/* <FontAwesomeIcon icon={faClose} className='sidebar-btn-close' /> */}
            <div className='top-sidebar'>
                <img src={userAvt} alt="avatar" className="admin-avatar" />

                <div className="admin-username">
                    <p>{props.me?.username}</p>
                    <p>{props.me?.role}</p>
                </div>
            </div>
            <div className="bottom-sidebar">
                <ul className="admin-sidebar-menu">
                    <li className={`admin-tab ${activeTab === '1' ? 'active' : ''}`} onClick={handleTabSide1}>
                        <FontAwesomeIcon icon={faChartLine} className="setting-icon admin-icon-tab" id="notification" />
                        <div>Thống kê</div>
                    </li>
                    <li className={`admin-tab ${activeTab === '2' ? 'active' : ''}`} onClick={handleTabSide2}>
                        <FontAwesomeIcon icon={faUsers} className="setting-icon admin-icon-tab" id="notification" />
                        <div>Quản lý người dùng</div>
                    </li>
                    <li className={`admin-tab ${activeTab === '3' ? 'active' : ''}`} onClick={handleTabSide3}>
                        <FontAwesomeIcon icon={faChessBoard} className="setting-icon admin-icon-tab" id="notification" />
                        <div>Quản lý trận đấu</div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default SideBar;