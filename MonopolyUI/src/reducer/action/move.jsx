import { useContext } from "react";
import { SocketContext } from "../../App";
import actionsTypes from "../actionsType"

// const { socket, setSocket } = useContext(SocketContext);
export const makeNewMove = ({newPosition}) => {
   
    return {
        type: actionsTypes.NEW_MOVE,
        payload: {newPosition},
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