import { faBars, faCaretDown, faUpDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const Nav = (props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleIconClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSortOptionClick = (option) => {
        console.log(`Sorting by ${option}`);
        setIsMenuOpen(false);
    };
    return (
        <div className='admin-nav'>
            <div className="nav-search">
                <span>Tìm kiếm:</span>
                <input type="text" placeholder='Tìm gì nhập dô đây...' />
            </div>
            <div className="arrange">
                <p className='arrange-title'>Sắp xếp</p>
                <FontAwesomeIcon
                    icon={faCaretDown}
                    className="setting-icon admin-icon-tab"
                    id="notification"
                    onClick={handleIconClick}
                />
                {isMenuOpen && (
                    <div className="sort-menu">
                        <div onClick={() => handleSortOptionClick('Name')}>Theo tên</div>
                        <div onClick={() => handleSortOptionClick('Date')}>Theo ngày</div>
                        <div onClick={() => handleSortOptionClick('Priority')}>Theo độ ưu tiên</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Nav;
