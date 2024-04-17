import actionsTypes from "../actionsType"

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
export const savePiece = ({p}) => {
    return {
        type: actionsTypes.SAVE_PIECE_NAME,
        payload: {p},
    }
}