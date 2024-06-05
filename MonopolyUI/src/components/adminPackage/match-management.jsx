import { faArrowDown, faArrowRightLong, faSkullCrossbones, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { GetAllMatches } from '../../api_caller/admin';
import { formatDateAndTime } from '../gameBoard/help';

const MatchManagement = (props) => {
    const [listMatch, setListMatch] = useState([]);
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const getAllMatches = async () => {
            const matches = await GetAllMatches(0);
            if (matches) {
                setListMatch(matches)
                setLoading(false)
            }
        }

        getAllMatches();

    }, [props.showModalProfile])
    return (
        <div>
            <p className='user-list-length'>Tổng:
                <span className='quantity-user'> 10 </span>
                trận
            </p>
            {listMatch.map((match, index) => (
                <div className='ad-user-list-item'>
                    <div className='ad-user-list-left'>
                        <p>
                            id: <span>{match.id}</span>
                        </p>
                        <p>
                            Ngày chơi: {formatDateAndTime(match.startAt)}

                        </p>

                    </div>
                    <div className='ad-user-list-center'>
                        <p>
                            <FontAwesomeIcon icon={faTrophy} className="icon-win admin-icon-win" />
                            {match.winner.username}
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faSkullCrossbones} className="icon-lose admin-icon-lose" />
                            {match.loser.username}
                        </p>

                    </div>
                    <div className='ad-user-list-right'>
                        <p>
                        Ngày chơi: {formatDateAndTime(match.startAt)}
                        </p>
                        <p>
                            Tổng thời gian: {match.totalTime}

                        </p>
                    </div>
                </div>
            ))}

            <div className='more-btn'>
                Xem thêm <FontAwesomeIcon icon={faArrowDown} className="admin-icon-lose" />
            </div>

        </div>
    );
};

export default MatchManagement;
