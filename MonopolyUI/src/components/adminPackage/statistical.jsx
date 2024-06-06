import { faClose, faCrown, faHand, faHandFist, faSkullCrossbones, faTrophy, faUser, faUserPlus, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { color } from 'chart.js/helpers';
import { width } from '@fortawesome/free-solid-svg-icons/faClose';
import { GetStatistics } from '../../api_caller/admin';
import Loader from '../loader/loader';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Statistical = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [userLoginToday, setUserLoginToday] = useState(0)
    const [newUserToday, setNewUserToday] = useState(0)
    const [matchToday, setMatchToday] = useState(0)
    const [userLoginAll, setUserLoginAll] = useState(0)
    const [matchAll, setMatchAll] = useState(0)
    const [newUserAll, setNewUserAll] = useState(0)

    const [userStatistic, setUserStatistic] = useState({
        labels: [], datasets: [{
            label: 'Số người chơi',
            data: [],
            fill: false,
            borderColor: 'white',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            tension: 0.1,
        }]
    })

    useEffect(() => {
        setLoading(true)
        GetStatistics().then(statistics => {
            if (statistics.length) {
                let dates = statistics.map((item, index) => {
                    let date = new Date(item.logDate)
                    if (index !== statistics.length - 1) date.setDate(date.getDate() - 1)
                    else {
                        if (date.getHours() < 4) date.setDate(date.getDate() - 1)
                        setUserLoginToday(item.userLoginCount)
                        setNewUserToday(item.newUserCount)
                        setMatchToday(item.matchCount)
                    }
                    return date.getDate() + '/' + (date.getMonth() + 1)
                })
                let usersLogin = statistics.map(item => item.userLoginCount)
                let newUserCount = statistics.map(item => item.newUserCount)
                let matchCount = statistics.map(item => item.matchCount)
                setUserLoginAll(usersLogin.reduce((accom, item)=>accom+item, 0))
                setNewUserAll(newUserCount.reduce((accom, item)=>accom+item, 0))
                setMatchAll(matchCount.reduce((accom, item)=>accom+item, 0))
                setUserStatistic({
                    labels: dates, datasets: [{
                        label: 'Số người chơi',
                        data: usersLogin,
                        fill: false,
                        borderColor: 'green',
                        backgroundColor: 'rgba(0, 255, 0, 0.5)',
                        tension: 0.1,
                    }, {
                        label: 'Số nguời chơi mới',
                        data: newUserCount,
                        fill: false,
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 0, 0, 0.5)',
                        tension: 0.1,
                    }, {
                        label: 'Số trận',
                        data: matchCount,
                        fill: false,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.5)',
                        tension: 0.1,
                    }]
                })
                setLoading(false)
            }
        })
        
    }, [])

    const options = {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    color: 'white'
                }
            },
            y: {
                ticks: {
                    color: 'white'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                },
            },
            title: {
                display: true,
                text: 'Thống kê dữ liệu trong 30 ngày',
                color: 'white',
                font: {
                    size: 18
                }
            },
            tooltip: {
                bodyColor: 'white',
                titleColor: 'white',
                footerColor: 'white'
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className='statistical' style={{ marginTop: '20px', marginRight: '10px' }}>

            <div className="statistical-top">
                <div className="win-match">
                    <p style={{ color: '#F9F07A' }}>Hôm nay</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <p style={{width: '50%', marginBottom: '5px', color: '#B7C9F2'}}>Số người đăng nhập: <span style={{color: 'white'}}>{userLoginToday}<FontAwesomeIcon icon={faUser}/></span>  </p>
                        <p style={{width: '50%', marginBottom: '5px', color: '#B7C9F2'}}>Số người mới: <span style={{color: 'white'}}>{newUserToday} <FontAwesomeIcon icon={faUserPlus}/></span></p>
                        <p style={{width: '50%', marginBottom: '5px', color: '#B7C9F2'}}>Số trận: <span style={{color: 'white'}}>{matchToday} <FontAwesomeIcon icon={faHandFist}/></span></p>
                    </div>
                </div>
                <div className="lose-match">
                    <p style={{ color: '#F9F07A' }}>Trước - nay</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <p style={{width: '50%', marginBottom: '5px', color: '#B7C9F2'}}>Số người đăng nhập: <span style={{color: 'white'}}>{userLoginAll}<FontAwesomeIcon icon={faUser}/></span>  </p>
                        <p style={{width: '50%', marginBottom: '5px', color: '#B7C9F2'}}>Số người mới: <span style={{color: 'white'}}>{newUserAll} <FontAwesomeIcon icon={faUserPlus}/></span></p>
                        <p style={{width: '50%', marginBottom: '5px', color: '#B7C9F2'}}>Số trận: <span style={{color: 'white'}}>{matchAll} <FontAwesomeIcon icon={faHandFist}/></span></p>
                    </div>
                </div>

            </div>
            <div className="statistical-bottom">
                <div style={{ width: 'calc(100% - 10px)', minHeight: '400px', margin: '10px 10px auto auto', height: '80%', backgroundColor: '#b484f4', borderRadius: '5px', padding: '10px' }} >
                    <Line data={userStatistic} options={options} />
                </div>
            </div>
            {isLoading && <Loader isLoading={isLoading} />}
        </div>
    );
};

export default Statistical;
