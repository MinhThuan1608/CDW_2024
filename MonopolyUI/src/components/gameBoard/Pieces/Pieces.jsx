import React, { useRef, useState } from "react";
import './Pieces.css';
import Piece from "./Piece";
import { copyPosition, createPosition } from "../help";
import { useAppContext } from "../../../contexts/Context";
import {makeNewMove} from "../../../reducer/action/move";

const Piceces = () => {
    const ref = useRef()

    const {appState, dispatch} = useAppContext()
    const currentPosition = appState.position

    const calculateCoords = e => {
        const {width, left, top} = ref.current.getBoundingClientRect()
        const size = width/8
        const y = Math.floor((e.clientX - left) / size)
        const x = 7 - Math.floor((e.clientY - top) / size)
        return {x, y}
    }

    const onDrop = e => {
        // e.preventDefault()
        const newPosition = copyPosition(currentPosition)
        const {x, y} = calculateCoords(e)
        const [p, rank, file] = e.dataTransfer.getData('text').split(',')
        
        newPosition[rank][file] =''
        newPosition[x][y] = p
        
        dispatch(makeNewMove({newPosition}))
        // console.log(newPosition )
        // console.log(x, y)
        // console.log(appState.turn)
    }
    const onDragOver = e => {
        e.preventDefault()
    }

    return <div
        className="pieces"
        ref = {ref}
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