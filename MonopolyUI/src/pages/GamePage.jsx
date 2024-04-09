import React, { useContext, useState, useEffect } from 'react';
import '../assert/style/game-play.css';
import GameBoard from '../components/gameBoard/game-board'
import ChatSide from '../components/waitRoom/wait-room-chat-side';
import { SocketContext } from '../App';
import { useAppContext } from '../contexts/Context';
import { useParams } from 'react-router-dom';
import { GetUserInRoom } from '../api_caller/room';
import userAvt from '../assert/images/avatar/meo.jpg';

const GamePage = () => {
    const { socket, setSocket } = useContext(SocketContext);
    const { appState, dispatch } = useAppContext();
    const { roomId } = useParams("roomId");
    const [listMessage, setListMessage] = useState([]);
    const [listUsers, setlistUsers] = useState([]);

    // set thời gian cho game
    const [seconds, setSeconds] = useState(60);


    useEffect(() => {
        GetUserInRoom(roomId).then(result => {
            setlistUsers(result)
        })
    }, []);

    // =================

    return (

        <div className="container-gameplay">
            <div className="game-board-main">
                <GameBoard />
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
                            <p></p>
                            <div className=""></div>
                            <div className="img-avt" style={{ backgroundImage: `url(${user.avatar ? user.avatar.data : userAvt})` }}></div>

                            <span>{user.username}</span>
                            <p></p>
                        </div>
                    ))}
                </div>
                <ChatSide socket={socket} listMessage={listMessage} />
                <div className="control-btn">
                    <button>Bỏ cuộc</button>
                    <button>Thoát</button>
                </div>
            </div>
        </div>

    );
}
export default GamePage;