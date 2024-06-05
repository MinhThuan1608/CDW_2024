import React, { useContext, useState, useEffect, useRef } from 'react';
import '../assert/style/game-play.css';
import GameBoard from '../components/gameBoard/game-board'
import { SocketContext } from '../App';
import { useAppContext } from '../contexts/Context';
import { useParams } from 'react-router-dom';
import { GetTimmer, GetUserInRoom } from '../api_caller/room';
import userAvt from '../assert/images/avatar/meo.jpg';
import { faBackward, faBarChart, faBars, faChess, faClose, faCrow, faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GameChat from '../components/gameBoard/game-chat';
import VictoryModal from '../components/gameBoard/VictoryModal';
import { convertSecondsToMinutesAndSeconds } from '../components/gameBoard/help';

const GamePage = (props) => {
    const { socket } = useContext(SocketContext);
    const { appState } = useAppContext();
    const { roomId } = useParams("roomId");
    const [listMessageInGame, setListMessageInGame] = useState([]);
    const [listUsers, setlistUsers] = useState([]);
    const [isWin, setWin] = useState(false);
    const [isUserWin, setIsUserWin] = useState('')
    const [displayChatDiv, setDisplayChatDiv] = useState(false);

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
    const handleCloseSideBar = () => {
        // const divChat = document.querySelector('.chat-div-mobile');
        // divChat.style.animation = 'slideFromLeft 0.3s ease forwards'
        setDisplayChatDiv(false)
    }
    return (

        <div className="container-gameplay">
            {isWin && <VictoryModal listUsers={listUsers} isUserWin={isUserWin} roomId={roomId} />}
            <div className="game-board-main">
                <div className="turn-player-mobile">
                   {!displayChatDiv &&  <FontAwesomeIcon title='Bảng điều khiển' icon={faBars} className='sidebar-icon' onClick={() => setDisplayChatDiv(true)} />}
                </div>
                <GameBoard me={props.me} listUsers={listUsers} isWin={isWin} setWin={setWin}
                    setIsUserWin={setIsUserWin} seconds={seconds} setSeconds={setSeconds}
                    setListMessageInGame={setListMessageInGame} />
            </div>
            <div className="chat-div">
                <p className="turn-player" style={{ margin: `4px 0 0 0` }}>
                    <p></p>
                    <p></p>
                    <p className='turn'> Turn {appState.turn === 'b' ? 'Black' : 'White'}</p>
                    <p id="timer">{convertSecondsToMinutesAndSeconds(seconds)}</p>
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
                    <button onClick={handleExitGame}>Thoát Game</button>
                </div>
            </div>
            {displayChatDiv && (
                <div className="chat-div-mobile">
                    <FontAwesomeIcon icon={faClose} className='sidebar-icon btn-close' onClick={handleCloseSideBar} />
                    <p className="turn-player" style={{ margin: `4px 0 0 0` }}>
                        <p className='turn'> Turn {appState.turn === 'b' ? 'Black' : 'White'}</p>
                        <p id="timer">{convertSecondsToMinutesAndSeconds(seconds)}</p>
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
                    <GameChat className='chat-room-part-mobile' listMessageInGame={listMessageInGame} roomId={roomId} />
                    <div className="control-btn">
                        <button onClick={handleGiveUpGame}>Bỏ cuộc</button>
                        <button onClick={handleExitGame}>Thoát Game</button>
                    </div>
                </div>
            )}
        </div>

    );
}
export default GamePage;