import React, { useContext, useState, useParams } from 'react';
import '../assert/style/game-play.css';
import GameBoard from '../components/gameBoard/game-board'
import ControlBarPlayerOne from '../components/gameBoard/ControlBarPlayerOne';
import ControlBarPlayerTwo from '../components/gameBoard/ControlBarPlayerTwo';
import ChatSide from '../components/waitRoom/wait-room-chat-side';
import { SocketContext } from '../App';


const GamePage = () => {
    const { socket, setSocket } = useContext(SocketContext);
    // const { roomId } = useParams("roomId");
    const [listMessage, setListMessage] = useState([]);
    return (

        <div className="container-gameplay">
           <div className="chat-div">
           <ChatSide socket={socket} listMessage={listMessage} />
           </div>
            <ControlBarPlayerOne />
            <GameBoard />
            <ControlBarPlayerTwo />
        </div>

    );
}
export default GamePage;