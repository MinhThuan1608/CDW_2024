import React, { useContext, useState, useEffect, useRef } from 'react';
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

const GamePage = (props) => {
    const { socket, setSocket } = useContext(SocketContext);
    const { appState, dispatch } = useAppContext();
    const { roomId } = useParams("roomId");
    const [listMessageInGame, setListMessageInGame] = useState([]);
    const [listUsers, setlistUsers] = useState([]);
    const [isWin, setWin] = useState(false);
    const [isUserWin, setIsUserWin] = useState('')

    const [seconds, setSeconds] = useState();


    useEffect(() => {
        GetUserInRoom(roomId).then(result => {
            if (result.length === 0) window.location = '/'
            else setlistUsers(result)
        })

    }, []);
    useEffect(() => {
        var intervalId = setInterval(() => {
            if (seconds > 0)
                setSeconds(seconds - 1)
        }, 1000)

        return () => { clearInterval(intervalId) }
    }, [seconds]);


    const sendVoice = (data) => {
        socket.publish({
            destination: '/app/game/chess/' + roomId,
            body: JSON.stringify({
                messageType: 'VOICE',

            })
        });
    }

    const handleExitGame = () => {
        socket.publish({
            destination: '/app/game/chess/' + roomId,
            body: JSON.stringify({
                messageType: 'EXIT',
            })
        });
    }
    const handleGiveUpGame = () => {
        socket.publish({
            destination: '/app/game/chess/' + roomId,
            body: JSON.stringify({
                messageType: 'GIVE_UP',
            })
        });
    }

    return (

        <div className="container-gameplay">

            {isWin && <VictoryModal listUsers={listUsers} isUserWin={isUserWin} />}
            <div className="game-board-main">
                <div className="turn-player-mobile">
                    <p className='turn'> Turn {appState.turn === 'b' ? 'Black' : 'White'}</p>
                    <p id="timer">00:{seconds}</p>
                </div>
                <GameBoard listUsers={listUsers} isWin={isWin} setWin={setWin} setIsUserWin={setIsUserWin} setSeconds={setSeconds} setListMessageInGame={setListMessageInGame} />
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
                    {listUsers?.map((user, index) => (
                        <div className={`control-game ${appState.turn === (index === 0 ? 'w' : 'b') ? 'active' : ''}`} key={index}>

                            <div className="img-avt" style={{ backgroundImage: `url(${user.avatar ? user.avatar.data : userAvt})` }}>
                                {index === 0 ? <FontAwesomeIcon icon={faCrown} className="main-room-player own" /> : <></>}
                            </div>
                            <span className='name-player'>{user.username}</span>
                            <FontAwesomeIcon icon={faChess} className={`icon-chess-game ${index === 0 ? 'icon-chess-white' : ''}`} />
                        </div>
                    ))}
                </div>
                <GameChat listMessageInGame={listMessageInGame} roomId={roomId} />
                <div className="control-btn">
                    <button onClick={handleGiveUpGame}>Bỏ cuộc</button>
                    <button onClick={handleExitGame}>Thoát</button>
                </div>
            </div>
        </div>

    );
}
export default GamePage;