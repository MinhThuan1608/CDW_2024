import React, { useContext, useState, useEffect } from 'react';
import '../assert/style/game-play.css';
import GameBoard from '../components/gameBoard/game-board'
import ChatSide from '../components/waitRoom/wait-room-chat-side';
import { SocketContext } from '../App';
import { useAppContext } from '../contexts/Context';


const GamePage = () => {
    const { socket, setSocket } = useContext(SocketContext);

    const { appState, dispatch } = useAppContext();
    // const { roomId } = useParams("roomId");
    const [listMessage, setListMessage] = useState([]);

    // set thời gian cho game
    const [seconds, setSeconds] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [appState.turn]);

    return (

        <div className="container-gameplay">
            <div className="game-board-main">
                <GameBoard />
            </div>
            <div className="chat-div">
                <p className="turn-player" style={{ margin: `4px 0 0 0` }}>
                    Turn
                    <span className='turn'> {appState.turn === 'b' ? 'Black' : 'White'}</span>
                </p>
                <div className="player-turn">
                    {appState.turn === 'w' ? (
                        <>
                        <div className="control-game active">
                            <div className="countdown-timer">
                                <p className="turn-player">
                                    Thuan
                                </p>
                                00: <span id="timer">{seconds}</span>
                            </div>
                        </div>
                        <div className="control-game">
                        <div className="countdown-timer">
                            <p className="turn-player">
                                Thuy
                            </p>
                            00: <span id="timer">{seconds}</span>
                        </div>
                    </div>
                        </>
                    ) : (
                        <>
                        <div className="control-game ">
                            <div className="countdown-timer">
                                <p className="turn-player">
                                    Thuan
                                </p>
                                00: <span id="timer">{seconds}</span>
                            </div>
                        </div>
                        <div className="control-game active">
                        <div className="countdown-timer">
                            <p className="turn-player">
                                Thuy
                            </p>
                            00: <span id="timer">{seconds}</span>
                        </div>
                    </div>
                        </>
                    )}

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