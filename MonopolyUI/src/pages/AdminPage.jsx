import React, { useEffect, useState } from 'react';
import '../assert/style/admin.css';
import SideBar from '../components/adminPackage/sidebar';
import HomeTop from '../components/homePackage/home-top';
import Statistical from '../components/adminPackage/statistical';
import UserManagement from '../components/adminPackage/user-management';
import MatchManagement from '../components/adminPackage/match-management';
import Nav from '../components/adminPackage/navigation';


const AdminPage = (props) => {
    const [showStatistical, setShowStatistical] = useState(true);
    const [showUserBar, setShowUserBar] = useState(false);
    const [showMatchBar, setShowMatchBar] = useState(false);
    return (
        <div className='admin-page-container'>

            <div className="left">
                <SideBar me={props.me} showMatchBar={showMatchBar} setShowMatchBar={setShowMatchBar}
                showStatistical={showStatistical} setShowStatistical={setShowStatistical}
                showUserBar={showUserBar} setShowUserBar={setShowUserBar}/>
            </div>
            <div className="right">
               { (showMatchBar || showUserBar ) &&  <Nav/>}
                {showStatistical && <Statistical />}
                {showUserBar && <UserManagement />}
                {showMatchBar && <MatchManagement />}
            </div>

        </div>
    );
}
export default AdminPage;