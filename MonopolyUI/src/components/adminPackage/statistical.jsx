import { faClose, faCrown, faSkullCrossbones, faTrophy, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const Statistical = (props) => {
    return (
        <div className='statistical'>
            <h1>Hôm nay</h1>
            <div className="statistical-top">
                <div className="win-match">
                    <p>
                    <FontAwesomeIcon icon={faTrophy} className="icon-win" />
                        Thắng
                        </p>
                    <span>1000 trận</span>
                </div>
                <div className="lose-match">
                <p>
                <FontAwesomeIcon icon={faSkullCrossbones} className="icon-lose" />
                        Thua
                        </p>
                    <span>1000 trận</span>
                </div>

            </div>
            <div className="statistical-bottom">
               
                

            </div>
        </div>
    );
};

export default Statistical;
