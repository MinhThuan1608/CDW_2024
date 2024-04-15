import React from "react";
import { useAppContext } from "../../../contexts/Context";
import arbiter from "../../../arbiter/arbiter";
import { generateCandidateMoves } from "../../../reducer/action/move";

const Piece = (
    { rank,
        file,
        piece,
        listUsers }
) => {
    const ownerRoom = JSON.parse(sessionStorage.getItem('user'))
    const { appState, dispatch } = useAppContext()
    const { turn, position: currentPosition } = appState;
    // const currentPosition = position[position.length - 1]

    const onDragStart = (e) => {
        e.dataTransfer.setData('text/plain', `${piece},${rank},${file}`)
        e.dataTransfer.effectAllowed = 'move'
        setTimeout(() => {
            e.target.style.display = "none"
        }, 0)

        if ((listUsers[0].id === ownerRoom.id && turn === 'w') || (listUsers[1].id === ownerRoom.id && turn === 'b')) {
            const candidateMoves = arbiter.getValidMoves({
                position: currentPosition[currentPosition.length - 1],
                prevPosition: currentPosition[currentPosition.length - 2],
                rank,
                file,
                piece
            })
            dispatch(generateCandidateMoves({ candidateMoves }))
        }
    }
    const onDragOEnd = e => e.target.style.display = 'block'
    return (
        <div className={`piece ${piece} p-${file}${rank}`}
            // draggable={( listUsers[0].id === ownerRoom.id && turn === 'w') || (listUsers[1].id === ownerRoom.id && turn === 'b') ? true : false}
            // onDragStart={(listUsers[0].id === ownerRoom.id && turn === 'w') || (listUsers[1].id === ownerRoom.id && turn === 'b') ? onDragStart : null}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragOEnd}
        />
    )
}
export default Piece;