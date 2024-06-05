import { faClose, faCrown, faSkullCrossbones, faTrophy, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { color } from 'chart.js/helpers';
import { width } from '@fortawesome/free-solid-svg-icons/faClose';
import { GetStatistics } from '../../api_caller/admin';

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
        GetStatistics().then(statistics => {
            if (statistics.length) {
                let dates = statistics.map((item, index) => {
                    let date = new Date(item.logDate)
                    if (index !== statistics.length - 1) date.setDate(date.getDate() - 1)
                    else if (date.getHours() < 4) date.setDate(date.getDate() - 1)
                    return date.getDate() + '/' + (date.getMonth() + 1)
                })
                let usersLogin = statistics.map(item => item.userLoginCount)
                let newUserCount = statistics.map(item => item.newUserCount)
                let matchCount = statistics.map(item => item.matchCount)
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
                <div style={{ width: 'calc(100% - 10px)', minHeight: '400px', margin: '10px 10px auto auto', height: '80%', backgroundColor: '#b484f4', borderRadius: '5px', padding: '10px' }} >
                    <Line data={userStatistic} options={options} />
                </div>
            </div>
        </div>
    );
};

export default Statistical;
