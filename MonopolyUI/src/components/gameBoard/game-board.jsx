import React, { useEffect, useContext, useState } from 'react';
import Ranks from './bits/Ranks';
import Files from './bits/Files';
import Piceces from './Pieces/Pieces';
import { useAppContext } from '../../contexts/Context';
import { SocketContext } from '../../App';
import { useParams } from 'react-router-dom';
import { makeNewMove } from '../../reducer/action/move';
import Popup from './Popup/Popup';
import { toast } from 'react-toastify';

const GameBoard = () => {
    const { socket, setSocket } = useContext(SocketContext);
    const { appState, dispatch } = useAppContext()
    const { roomId } = useParams("roomId");

    const ranks = Array(8).fill().map((x, i) => 8 - i)
    const files = Array(8).fill().map((x, i) => i + 1)
    const position = appState.position[appState.position.length - 1]

    const [completePromotionChoose, setCompletePromotionChoose] = useState(false)
    const [isSelected, setIsSelected] = useState('')
    const [hints, setHints] = useState([])
    const me = JSON.parse(sessionStorage.getItem('user'))

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
                let newPosition, turn;
                setHints(messResponse.hints)
                switch (messResponse.messageType) {
                    case 'WIN':
                        newPosition = messResponse.pieces
                        turn = messResponse.turn
                        if (newPosition)
                            dispatch(makeNewMove({ newPosition, turn }))
                        if (me?.id === messResponse.winnerId)
                            toast('Chúc mừng, bạn đã chiến thắng <3');
                        else toast('Tiếc ghê, bạn thua mất rồi... hichic');
                        toast('Bạn sẽ được chuyển về trang phòng chờ sau 10s');
                        setTimeout(() => {
                            window.location = '/wait-room/' + roomId;
                        }, 10000)
                        break
                    case 'DRAW':
                        newPosition = messResponse.pieces
                        turn = messResponse.turn
                        if (newPosition)
                            dispatch(makeNewMove({ newPosition, turn }))
                        toast('Trận này hòa nháaa');
                        toast('Bạn sẽ được chuyển về trang phòng chờ sau 10s');
                        setTimeout(() => {
                            window.location = '/wait-room/' + roomId;
                        }, 10000)
                        break
                    case 'MOVE':
                        newPosition = messResponse.pieces
                        turn = messResponse.turn
                        if (newPosition)
                            dispatch(makeNewMove({ newPosition, turn }))
                        break

                    default:
                        break
                }
            });
            socket.publish({
                destination: '/app/game/chess/' + roomId,
                body: JSON.stringify({
                    messageType: 'CONNECT'
                })
            })
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
            <Piceces roomId={roomId} isSelected={isSelected} completePromotionChoose={completePromotionChoose} setCompletePromotionChoose={setCompletePromotionChoose} hints={hints}/>

            {appState.isPromotion && (<Popup isSelected={isSelected} setIsSelected={setIsSelected} setCompletePromotionChoose={setCompletePromotionChoose}/>)}
            <Files files={files} />

        </div>
    );
}
export default GameBoard;