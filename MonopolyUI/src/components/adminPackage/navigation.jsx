import { faBars, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { GetUserBySearch, SearchMatches } from '../../api_caller/admin';
import { formatDateAndTime } from '../gameBoard/help';

const Nav = (props) => {
    const [isLoading, setLoading] = useState(false);


    const searchUser = async (username, page) => {
        const dataResponse = await GetUserBySearch(username, page);
        console.log(dataResponse)
        if (dataResponse.userResponse) {
            props.setListUser(dataResponse.userResponse)
            // setSearchValue('')
            props.setTotalPagesUser(dataResponse.totalPage)
            props.setCurrentPageUser(dataResponse.page)
            setLoading(false)
        }
    }
    const searchMatch = async (id, page) => {
        const dataResponse = await SearchMatches(id, page);
        console.log(dataResponse)
        if (dataResponse.matches) {
            props.setListMatch(dataResponse.matches)
            console.log(props.listMatch)
            // setSearchValue('')
            props.setTotalPagesMatch(dataResponse.totalPage)
            props.setCurrentPageMatch(dataResponse.page)
            setLoading(false)
        }
    }




    const handleSearchChange = (event) => {
        const query = event.target.value;
        props.setSearchValue(query);
        if (!props.showMatchBar)
            searchUser(query, 0);
        else
            searchMatch(query, 0);
    };
    return (
        <div className='admin-nav'>
            <div className="nav-search">
                <span>Tìm kiếm:</span>
                <input
                    type="text"
                    value={props.searchValue}
                    onChange={handleSearchChange}
                    placeholder={props.showMatchBar ? 'Tìm trận theo id...' : 'Tìm user theo username...'}
                />

            </div>
            
        </div>
    );
};

export default Nav;
