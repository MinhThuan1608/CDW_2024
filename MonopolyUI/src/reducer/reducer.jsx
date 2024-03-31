import actionsType from "./actionsType"

export const reducer = (state, action) => {
    switch (action.type) {
        case actionsType.NEW_MOVE: {
            let {turn} = state
            turn = turn === 'w' ? 'b' : 'w'
          
            return {
                ...state, 
                turn,
                position : action.payload.newPosition
            }
        
        }
        default: 
            return state

    }
}