import React, { useEffect, useContext } from 'react';
import Ranks from './bits/Ranks';
import Files from './bits/Files';
import Piceces from './Pieces/Pieces';
import { useAppContext } from '../../contexts/Context';
import { SocketContext } from '../../App';

import { useParams } from 'react-router-dom';
import {  makeNewMove } from '../../reducer/action/move';
import Popup from './Popup/Popup';

const GameBoard = () => {
    const { socket, setSocket } = useContext(SocketContext);
    const { roomId } = useParams("roomId");
    // col
    const ranks = Array(8).fill().map((x, i) => 8 - i)
    // row
    const files = Array(8).fill().map((x, i) => i + 1)

    const { appState, dispatch } = useAppContext()
    const position = appState.position[appState.position.length - 1]

    const getClassName = (i, j) => {
        let c = 'tile'
        c += (i + j) % 2 === 0 ? ' tile--dark' : ' tile--light'

        if (appState.candidateMoves?.find(m => m[0] === i && m[1] === j)) {
            if (position[i][j])
                c += ' attacking'
            else
                c += ' highlight'
        }
        return c
    }

    useEffect(() => {
        if (socket) {
            socket.subscribe('/topic/game/chess/' + roomId, (message) => {
                const messResponse = JSON.parse(message.body);
                console.log(messResponse)
                switch (messResponse.messageType) {
                    case 'MOVE':
                        let newPosition = messResponse.pieces
                        let turn = messResponse.turn
                        dispatch(makeNewMove({newPosition, turn}))
                        // dispatch(clearCandidates())
                        break
                    default:
                        break
                }


            });
        }
    }, [socket]);

    return (

        <div className="board">

            <Ranks ranks={ranks} />
            <div className='tiles'>
                {ranks.map((rank, i) =>
                    files.map((file, j) =>
                        <div key={file + '-' + rank} className={getClassName(7 - i, j)}></div>
                    )
                )}
            </div>
            <Piceces roomId={roomId} />
            {/* <Popup/> */}
            <Files files={files} />

        </div>
    );
}
export default GameBoard;