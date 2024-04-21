import React from "react";
import { useAppContext } from "../../../contexts/Context";
import { generateCandidateMoves } from "../../../reducer/action/move";

const Piece = ({ rank, file, piece, hints, justMoving, listUsers, me }) => {

    const { appState, dispatch } = useAppContext()
    const { turn, position: currentPosition } = appState;

    const onDragStart = (e) => {
        e.dataTransfer.setData('text/plain', `${piece},${rank},${file}`)
        e.dataTransfer.effectAllowed = 'move'
        setTimeout(() => {
            e.target.style.display = "none"
        }, 0)

        if ((listUsers[0].id === me.id && turn === 'w')) {
            if (turn === piece[0]) {
                const candidateMoves = hints.filter(hint => hint.piece === piece && hint.oldRow === rank && hint.oldCol === file)
                    .map(hint => [hint.newRow, hint.newCol])
                dispatch(generateCandidateMoves({ candidateMoves }))
            }
        } else if (listUsers[1].id === me.id && turn === 'b') {
            if (turn === piece[0]) {
                const candidateMoves = hints.filter(hint => hint.piece === piece && 7 - hint.oldRow === rank && hint.oldCol === file)
                    .map(hint => [7 - hint.newRow, hint.newCol])
                dispatch(generateCandidateMoves({ candidateMoves }))
            }
        }
    }
    const onDragEnd = e => e.target.style.display = 'block'
    return (
        <div className={`piece ${piece} p-${file}${rank} ${justMoving[0] === rank && justMoving[1] === file ? 'justMoving' : ''}`}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        />
    )
}
export default Piece;