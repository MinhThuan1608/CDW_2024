import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../contexts/Context';


const SideBarGameBoard = () => {
    const { appState, dispatch } = useAppContext();
    const [pieceNames, setPieceNames] = useState([]);

    useEffect(() => {
        if (appState.piece !== '') {
            setPieceNames(prevPieceNames => [...prevPieceNames, appState.piece]);  // Thêm giá trị mới vào mảng pieceNames
        }
    }, [appState.piece]);

    return (
        <div className="sidebar-game">

            <p className="turn-player">
                Turn
                <span className='turn'> {appState.turn === 'b' ? 'Black' : 'White'}</span>
            </p>
            {pieceNames.map((piece, index) => (
                <li key={index} className="prev-position">
                    <span>{piece.startsWith('w') ? 'White' : 'Black'} : </span>
                    {piece}
                </li>
            ))}


        </div>
    )

}
export default SideBarGameBoard;