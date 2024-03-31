import React from "react";

const Piece = (
   { rank,
    file, 
    piece,}
) => {
    return (
    <div className={`piece ${piece} p-${rank}${file}`}
        draggable={true}
    />
    )
}
export default Piece;