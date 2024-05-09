import actionsTypes from "../actionsType"

export const initGameBoard = ({position}) => {
   
    return {
        type: actionsTypes.INIT_GAME,
        payload: {position},
    }
} 
export const makeNewMove = ({newPosition, turn}) => {
   
    return {
        type: actionsTypes.NEW_MOVE,
        payload: {newPosition, turn},
    }
} 

export const generateCandidateMoves = ({candidateMoves}) => {
    return {
        type: actionsTypes.GENERATE_CANDIDATE_MOVES,
        payload: {candidateMoves},
    }
}

export const clearCandidates = () => {
    return {
        type: actionsTypes.CLEAR_CANDIDATE_MOVES,
    }
}
export const savePiece = ({rank, file, x, y}) => {
    return {
        type: actionsTypes.SAVE_PIECE_OLD_NEW,
        payload: {rank, file, x, y},
    }
}
export const swapTurn = ({turn}) => {
    return {
        type: actionsTypes.SWAP_TURN,
        payload: {turn},
    }
} 