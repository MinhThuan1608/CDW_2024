import actionsTypes from "./actionsType"

export const reducer = (state, action) => { 
    switch (action.type) {
        case actionsTypes.INIT_GAME : {
            return {
                ...state, 
                position: action.payload.position,
            }
        
        }
        case actionsTypes.NEW_MOVE : {
            let {position, turn} = state
            position = [
                ...position,
                action.payload.newPosition
            ]
            turn = action.payload.turn
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
        case actionsTypes.SWAP_TURN : {
            return {
                ...state, 
                turn : action.payload.turn
            }
        
        }
   
        default: 
            return state

    }
}