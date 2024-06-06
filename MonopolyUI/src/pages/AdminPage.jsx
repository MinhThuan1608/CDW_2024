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

    const [listUser, setListUser] = useState([]);
    const [totalPagesUser, setTotalPagesUser] = useState(0);
    const [currentPageUser, setCurrentPageUser] = useState(0);

    const [listMatch, setListMatch] = useState([]);
    const [totalPagesMatch, setTotalPagesMatch] = useState(0);
    const [currentPageMatch, setCurrentPageMatch] = useState(0);

    const [searchValue, setSearchValue] = useState("");
    return (
        <div className='admin-page-container'>

            <div className="left">
                <SideBar me={props.me} showMatchBar={showMatchBar} setShowMatchBar={setShowMatchBar}
                    showStatistical={showStatistical} setShowStatistical={setShowStatistical}
                    showUserBar={showUserBar} setShowUserBar={setShowUserBar} />
            </div>
            <div className="right">
                {(showMatchBar || showUserBar) && 
                <Nav 
                    searchValue ={searchValue}
                    setSearchValue={setSearchValue}
                    showUserBar={showUserBar}
                    showMatchBar={showMatchBar}
                    listUser={listUser}
                    setListUser={setListUser}
                    listMatch={listMatch}
                    setListMatch={setListMatch}
                    totalPagesUser={totalPagesUser}
                    setTotalPagesUser={setTotalPagesUser}
                    currentPageUser={currentPageUser}
                    setCurrentPageUser={setCurrentPageUser}
                    totalPagesMatch={totalPagesMatch}
                    setTotalPagesMatch={setTotalPagesMatch}
                    currentPageMatch={currentPageMatch}
                    setCurrentPageMatch={setCurrentPageMatch}
                />}
                {showStatistical && <Statistical />}
                {showUserBar && 
                <UserManagement 
                    searchValue ={searchValue}
                    setSearchValue={setSearchValue}
                    listUser={listUser}
                    setListUser={setListUser}
                    totalPagesUser={totalPagesUser}
                    setTotalPagesUser={setTotalPagesUser}
                    currentPageUser={currentPageUser}
                    setCurrentPageUser={setCurrentPageUser}

                />}
                {showMatchBar && 
                <MatchManagement 
                    searchValue ={searchValue}
                    setSearchValue={setSearchValue}
                    listMatch={listMatch}
                    setListMatch={setListMatch}
                    totalPagesMatch={totalPagesMatch}
                    setTotalPagesMatch={setTotalPagesMatch}
                    currentPageMatch={currentPageMatch}
                    setCurrentPageMatch={setCurrentPageMatch}
                />}
            </div>

        </div>
    );
}
export default AdminPage;