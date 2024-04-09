import React, { useContext, useEffect, useRef, useState } from "react";
import './Pieces.css';
import Piece from "./Piece";
import { copyPosition, createPosition } from "../help";
import { useAppContext } from "../../../contexts/Context";
import { SocketContext } from "../../../App";
import { clearCandidates } from "../../../reducer/action/move";

let movePromotion = {}
const Piceces = (props) => {
    const { socket, setSocket } = useContext(SocketContext);
    const ref = useRef()


    const { appState, dispatch } = useAppContext()

    const currentPosition = appState.position[appState.position.length - 1]

    const calculateCoords = e => {
        const { width, left, top } = ref.current.getBoundingClientRect()
        // console.log(ref.current.getBoundingClientRect())
        const size = width / 8
        const y = Math.floor((e.clientX - left) / size)
        const x = 7 - Math.floor((e.clientY - top) / size)
        return { x, y }
    }

    const onDrop = e => {
        e.preventDefault()
        const newPosition = copyPosition(currentPosition)
        const { x, y } = calculateCoords(e)
        const [p, rank, file] = e.dataTransfer.getData('text').split(',')

        if (appState.candidateMoves?.find(m => m[0] === x && m[1] === y)) {
            if (p.endsWith('p') && !newPosition[x][y] === '' && x !== rank && y !== file)
                newPosition[rank][y] = ''

            if ((p === 'wp' && x === 7) || (p === 'bp' && x === 0)) {
                appState.isPromotion = true;
                movePromotion = {
                    oldRow: Number(rank),
                    oldCol: Number(file),
                    newRow: x,
                    newCol: y
                }
                console.log(movePromotion)
            } else {
                newPosition[Number(rank)][Number(file)] = ''
                newPosition[x][y] = p

                const move = {
                    oldRow: Number(rank),
                    oldCol: Number(file),
                    newRow: x,
                    newCol: y
                };

                socket.publish({
                    destination: '/app/game/chess/' + props.roomId,
                    body: JSON.stringify({
                        messageType: 'MOVE',
                        move: move,

                    })
                });
            }

        }

        dispatch(clearCandidates())
    }

    const onDragOver = e => {
        e.preventDefault()
    }

    useEffect(() => {
        if (appState.completePromotionChoose && socket) {
            console.log(movePromotion)
            socket.publish({
                destination: '/app/game/chess/' + props.roomId,
                body: JSON.stringify({
                    messageType: 'MOVE',
                    move: movePromotion,
                    namePromotion: props.isSelected,

                })
            });
            appState.completePromotionChoose = false
        }
    }, [appState.completePromotionChoose])

    return <div
        className="pieces"
        ref={ref}
        onDrop={onDrop}
        onDragOver={onDragOver}>

        {currentPosition.map((r, rank) =>
            r.map((f, file) =>
                currentPosition[rank][file]
                    ? <Piece
                        key={rank + '-' + file}
                        rank={rank}
                        file={file}
                        piece={currentPosition[rank][file]}
                    />
                    : null
            ))}
    </div>
}
export default Piceces;