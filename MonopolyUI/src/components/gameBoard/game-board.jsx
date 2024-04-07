import React, { useEffect, useContext } from 'react';
import Ranks from './bits/Ranks';
import Files from './bits/Files';
import Piceces from './Pieces/Pieces';
import { useAppContext } from '../../contexts/Context';
import { SocketContext } from '../../App';

const GameBoard = () => {
    const { socket, setSocket } = useContext(SocketContext);
    // col
    const ranks = Array(8).fill().map((x, i) => 8 - i)
    // row
    const files = Array(8).fill().map((x, i) => i + 1)

    const { appState } = useAppContext()
    const position = appState.position[appState.position.length - 1]
    // console.log(position)

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
            // console.log('subcribe room ', roomId)
            socket.subscribe('/top/game/chess', (message) => {
                const messResponse = JSON.parse(message.body);
                console.log(messResponse);
                // switch (messResponse.messageType) {
                //     case 'MOVE':
                //         console.log(messResponse)
                //         break
                //     default:
                //         break
                // }


            });
        }
    });

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
            <Piceces />
            <Files files={files} />

        </div>
    );
}
export default GameBoard;