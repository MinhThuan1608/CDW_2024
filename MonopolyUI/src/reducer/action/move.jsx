import actionsType from "../actionsType"

export const makeNewMove = ({newPosition}) => {
    return {
        type: actionsType.NEW_MOVE,
        payload: {newPosition}
    }
}