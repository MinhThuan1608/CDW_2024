import {  createPosition } from "./help";


export const initGameState = {
    position: [createPosition()],
    turn: 'w',
    candidateMoves: [],
    piece: '',
    isPromotion: false,
    completePromotionChoose: false,  
}

