import { faClose, faCrown, faSkullCrossbones, faTrophy, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { color } from 'chart.js/helpers';
import { width } from '@fortawesome/free-solid-svg-icons/faClose';

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

    const data = {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
            {
                label: 'Sales Data',
                data: [100, 150, 200, 180, 250, 300],
                fill: false,
                borderColor: 'white',
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                tension: 0.1,
            },
        ],
    };

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
                text: 'Chart.js Line Chart',
                color: 'white',
            },
            tooltip: {
                bodyColor: 'white',
                titleColor: 'white',
                footerColor: 'white'
            }
        },
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
                <div style={{ width: '50%' }}>
                    <Line data={data} options={options} />
                </div>


            </div>
        </div>
    );
};

export default Statistical;
