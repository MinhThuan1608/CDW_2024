import { faAngleDoubleRight, faArrowDown, faArrowLeft, faArrowLeftLong, faArrowRight, faArrowRightLong, faSkullCrossbones, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { SearchMatches } from '../../api_caller/admin';
import { formatDateAndTime, formatSecondsToHHMMSS } from '../gameBoard/help';
import Loader from '../loader/loader';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft';

const MatchManagement = (props) => {

    const [isLoading, setLoading] = useState(false);

    const getAllMatches = async (id, page) => {
        const dataResponse = await SearchMatches(id, page);
        if (dataResponse.matches) {
            props.setListMatch(dataResponse.matches)
            props.setTotalPagesMatch(dataResponse.totalPage)
            props.setCurrentPageMatch(dataResponse.page)
            setLoading(false)
        }
    }
    useEffect(() => {
        setLoading(true);
        getAllMatches(props.searchValue, 0);

    }, [])

    const handlePrevPage = () => {
        setLoading(true)
        getAllMatches(props.searchValue, props.currentPageMatch - 1)
        props.setCurrentPageMatch(props.currentPageMatch - 1)

    }
    const handleNextPage = () => {
        setLoading(true)
        getAllMatches(props.searchValue, props.currentPageMatch + 1)
        props.setCurrentPageMatch(props.currentPageMatch + 1)

    }
    const handleFirstPage = () => {
        setLoading(true)
        getAllMatches(props.searchValue, 0)
        props.setCurrentPageMatch(0)

    }
    const handleEndPage = () => {
        setLoading(true)
        getAllMatches(props.searchValue, props.totalPagesMatch - 1)
        props.setCurrentPageMatch(props.totalPagesMatch - 1)

    }
    return (
        <div className='admin-tab-content'>
            <p className='user-list-length'>Có
                <span className='quantity-user'> {props.listMatch.length} </span>
                trận
            </p>
            {props.listMatch.map((match, index) => (
                <div className='ad-match-list-item' key={index}>
                    <div className='ad-match-list-left'>
                        <p>
                            id: <span>{match.id}</span>
                        </p>


                    </div>
                    <div className='ad-match-list-center'>
                        <p>
                            <FontAwesomeIcon icon={faTrophy} className="icon-win admin-icon" />
                            {match.winner.username}
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faSkullCrossbones} className="icon-lose admin-icon" />
                            {match.loser.username}
                        </p>

                    </div>
                    <div className='ad-match-list-right'>
                        <p>
                            Ngày chơi: {formatDateAndTime(match.startAt)}
                        </p>
                        <p>
                            Tổng thời gian: {formatSecondsToHHMMSS(match.totalTime)}

                        </p>
                    </div>
                </div>
            ))}
            <div className='pageable'>
                {props.currentPageMatch !== props.totalPagesMatch - 1 && props.totalPagesMatch !== 0 && (
                    <>
                        <p className='more-btn' aria-disabled onClick={handleEndPage} title='Đến cuối'>
                            <FontAwesomeIcon icon={faAngleDoubleRight} className="admin-icon" />
                        </p>
                        <p className='more-btn' aria-disabled onClick={handleNextPage} title='Xem thêm'>
                            <FontAwesomeIcon icon={faArrowRight} className="admin-icon" />
                        </p>
                    </>
                )}
                <p className='more-btn'>
                    {props.currentPageMatch === 0 && props.totalPagesMatch === 0 ? 0 : props.currentPageMatch + 1} / {props.totalPagesMatch}
                </p>

                {props.currentPageMatch !== 0 && (
                    <>

                        <p className='more-btn' onClick={handlePrevPage} title='Quay lại'>
                            <FontAwesomeIcon icon={faArrowLeft} className="admin-icon" />
                        </p>
                        <p className='more-btn' aria-disabled onClick={handleFirstPage} title='Về đầu tiên'>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} className="admin-icon" />
                        </p>
                    </>
                )}

            </div>
            {isLoading && <Loader isLoading={isLoading} />}
        </div>
    );
};

export default MatchManagement;
