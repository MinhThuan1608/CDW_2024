import React, { useContext, useState, useEffect } from 'react';
import '../assert/style/game-play.css';
import GameBoard from '../components/gameBoard/game-board'
import ChatSide from '../components/waitRoom/wait-room-chat-side';
import { SocketContext } from '../App';
import { useAppContext } from '../contexts/Context';
import { useParams } from 'react-router-dom';
import { GetTimmer, GetUserInRoom } from '../api_caller/room';
import userAvt from '../assert/images/avatar/meo.jpg';
import { faChess, faCrow, faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GameChat from '../components/gameBoard/game-chat';
import VictoryModal from '../components/gameBoard/VictoryModal';

const GamePage = () => {
    const { socket, setSocket } = useContext(SocketContext);
    const { appState, dispatch } = useAppContext();
    const { roomId } = useParams("roomId");
    const [listMessageInGame, setListMessageInGame] = useState([]);
    const [listUsers, setlistUsers] = useState([]);
    const [isWin, setWin] = useState(false);

    // set thời gian cho game
    const [seconds, setSeconds] = useState();


    useEffect(() => {
        GetUserInRoom(roomId).then(result => {
            setlistUsers(result)
        })

    }, []);

    useEffect(() => {
        if (socket) {
            socket.subscribe('/topic/game/chess/chat/' + roomId, (message) => {
                const messResponse = JSON.parse(message.body);
                console.log(messResponse);
                switch (messResponse.messageType) {
                    case 'MESSAGE':
                        setListMessageInGame(prevlistMessageInGame => [messResponse, ...prevlistMessageInGame])
                        break

                    default:
                        break
                }
            });

        }

    }, [socket])

    useEffect(() => {
        if (socket) {
          
            const fetchTimer = async () => {
                await GetTimmer(roomId).then(result => {
                    setSeconds(result)
                })
            };

            const intervalId = setInterval(fetchTimer, 1000);

            return () => {
                clearInterval(intervalId);
            };
           
        }

    })

    useEffect(() => {
        if (socket) {
            socket.publish({
                destination: '/app/game/turn/' + roomId,
                body: ''

            });
        }

    }, [seconds === 60])

    // =================

    return (

        <div className="container-gameplay">
            {isWin && <VictoryModal listUsers={listUsers} />}
            <div className="game-board-main">
                <GameBoard listUsers={listUsers} />
            </div>
            <div className="chat-div">
                <p className="turn-player" style={{ margin: `4px 0 0 0` }}>
                    <p></p>
                    <p></p>
                    <p className='turn'> Turn {appState.turn === 'b' ? 'Black' : 'White'}</p>
                    <p id="timer">00:{seconds}</p>
                    <p></p>
                    <p></p>
                </p>
                <div className="player-turn">
                    {listUsers.map((user, index) => (
                        <div className={`control-game ${appState.turn === (index === 0 ? 'w' : 'b') ? 'active' : ''}`} key={index}>

                            <div className="img-avt" style={{ backgroundImage: `url(${user.avatar ? user.avatar.data : userAvt})` }}>
                                {index === 0 ? <FontAwesomeIcon icon={faCrown} className="main-room-player own" /> : <></>}
                            </div>
                            <span className='name-player'>{user.username}</span>
                            <FontAwesomeIcon icon={faChess} className={`icon-chess-game ${index === 0 ? 'icon-chess-white' : ''}`} />
                        </div>
                    ))}
                </div>
                <GameChat socket={socket} listMessageInGame={listMessageInGame} roomId={roomId} />
                <div className="control-btn">
                    <button>Bỏ cuộc</button>
                    <button>Thoát</button>
                </div>
            </div>
        </div>

    );
}
export default GamePage;