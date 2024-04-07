import { getBishopMoves, getKnightMoves, getRookMoves, getQueenMoves, getKingMoves, getPawnMoves, getPawnCaptures } from "./getMoves";

const arbiter = {
    getRegularMoves: function ({ position, rank, file, piece }) {
        if (piece.endsWith('n'))
            return getKnightMoves({ position, rank, file })
        if (piece.endsWith('b'))
            return getBishopMoves({ position, rank, file, piece })
        if (piece.endsWith('r'))
            return getRookMoves({ position, rank, file, piece })
        if (piece.endsWith('q'))
            return getQueenMoves({ position, rank, file, piece })
        if (piece.endsWith('k'))
            return getKingMoves({ position, rank, file, piece })
        if (piece.endsWith('p'))
            return getPawnMoves({ position, rank, file, piece })
            
    },
    getValidMoves: function ({ position, prevPosition, rank, file, piece }) {
        let moves = this.getRegularMoves({ position, rank, file, piece })
        if (piece.endsWith('p')) {
            moves = [
                ...moves,
                ...getPawnCaptures({ position, prevPosition, rank, file, piece })

            ]
        }
        return moves
    }
}
export default arbiter;