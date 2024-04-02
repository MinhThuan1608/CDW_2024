import React from 'react';
import '../assert/style/game-play.css';
import GameBoard from '../components/gameBoard/game-board'
import SideBarGameBoard from '../components/gameBoard/SideBarGameBoard';


const GamePage = () => {
    return (

        <div className="container-gameplay">
            <SideBarGameBoard />
            <GameBoard />
        </div>

    );
}
export default GamePage;