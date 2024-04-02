import actionsTypes from "./actionsType"

export const reducer = (state, action) => {
    switch (action.type) {
        case actionsTypes.NEW_MOVE : {
            let {position, turn} = state
            
            position = [
                ...position,
                action.payload.newPosition
            ]
            turn = turn === 'w' ? 'b' : 'w' 

            return {
                ...state, 
                position,
                turn,
            }
        
        }
        case actionsTypes.GENERATE_CANDIDATE_MOVES : {
            
            return {
                ...state, 
                candidateMoves: action.payload.candidateMoves
            }
        
        }
        case actionsTypes.CLEAR_CANDIDATE_MOVES : {
            
            return {
                ...state, 
                candidateMoves: []
            }
        
        }
        case actionsTypes.SAVE_PIECE_NAME : {
            
            return {
                ...state, 
                piece: action.payload.p
            }
        
        }
        default: 
            return state

    }
}