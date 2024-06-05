import { faSkullCrossbones, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const MatchManagement = (props) => {
    return (
        <div>
            <p className='user-list-length'>Tổng:
                <span className='quantity-user'> 10 </span>
                trận
            </p>
            <div className='ad-user-list-item'>
                <div className='ad-user-list-left'>
                    <p>
                        id trận
                    </p>
                    <p>
                        Ngày chơi: fsdf

                    </p>

                </div>
                <div className='ad-user-list-center'>
                    <p>
                        Người chơi 1
                    </p>
                    <p>
                        Người chơi 2

                    </p>

                </div>
                <div className='ad-user-list-right'>
                    <p>
                        <FontAwesomeIcon icon={faTrophy} className="icon-win admin-icon-win" />
                    </p>
                    <p>
                        <FontAwesomeIcon icon={faSkullCrossbones} className="icon-lose admin-icon-lose" />

                    </p>
                </div>
            </div>
          
        </div>
    );
};

export default MatchManagement;
