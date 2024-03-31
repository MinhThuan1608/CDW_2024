import React, { useReducer } from 'react';
import '../assert/style/game-play.css';
import GameBoard from '../components/gameBoard/game-board'


const GamePage = () => {

    return (

        <div className="container">
            <GameBoard />
        </div>

    );
}
export default GamePage;