import { isKingAttacked } from "./checkScanner"

export const getRookMoves = ({ position, rank, file, piece }) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'

    const direction = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ]

    direction.forEach(dir => {
        for (let i = 1; i < 8; i++) {
            const x = rank + (i * dir[0])
            const y = file + (i * dir[1])

            if (position?.[x]?.[y] === undefined)
                break
            if (position[x][y].startsWith(enemy)) {
                if (!isKingAttacked(position, [x, y], piece, rank, file))
                    moves.push([x, y])
                break
            }
            if (position[x][y].startsWith(us))
                break
            if (!isKingAttacked(position, [x, y], piece, rank, file))
                moves.push([x, y])
        }
    })

    return moves
}
export const getKnightMoves = ({ position, rank, file }) => {
    const moves = []
    const enemy = position[rank][file].startsWith('w') ? 'b' : 'w'

    const candidates = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, 2],
        [1, -2],
        [2, -1],
        [2, 1],
    ]
    candidates.forEach(c => {
        const cell = position?.[rank + c[0]]?.[file + c[1]]
        if (cell !== undefined && [cell.startsWith(enemy) || cell === ''])
            if (!isKingAttacked(position, [rank + c[0], file + c[1]], position[rank][file], rank, file))
                moves.push([rank + c[0], file + c[1]])
    })
    return moves
}

export const getBishopMoves = ({ position, rank, file, piece }) => {
    const moves = []
    const us = piece[0]
    const enemy = us === 'w' ? 'b' : 'w'

    const direction = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
    ]

    direction.forEach(dir => {
        for (let i = 1; i < 8; i++) {
            const x = rank + (i * dir[0])
            const y = file + (i * dir[1])

            if (position?.[x]?.[y] === undefined)
                break

            if (position[x][y].startsWith(enemy)) {
                if (!isKingAttacked(position, [x, y], piece, rank, file))
                    moves.push([x, y])
                break
            }
            if (position[x][y].startsWith(us))
                break

            if (!isKingAttacked(position, [x, y], piece, rank, file))
                moves.push([x, y])
        }
    })

    return moves
}

export const getQueenMoves = ({ position, rank, file, piece }) => {
    const moves = [
        ...getRookMoves({ position, rank, file, piece }),
        ...getBishopMoves({ position, rank, file, piece })
    ]
    return moves
}

export const getKingMoves = ({ position, rank, file, piece }) => {
    const moves = []
    const us = piece[0]

    const direction = [
        [1, -1], [1, 0], [1, 1],
        [0, -1], [0, 1],
        [-1, -1], [-1, 0], [-1, 1],
    ]

    direction.forEach(dir => {

        const x = rank + dir[0]
        const y = file + dir[1]

        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us))
            if (!isKingAttacked(position, [x, y], piece, rank, file))
                moves.push([x, y])

    })

    let rowCastle = piece.startsWith('w') ? 0 : 7;
    let rookCol = piece.substring[0] === 'w' ? 0 : 7;
    if (file === 4 && rank === rowCastle) {
        console.log(position?.[rowCastle]?.[7]?.endsWith('r'))
        if (position?.[rowCastle]?.[7]?.endsWith('r') && position[rowCastle][5] === '' && position[rowCastle][6] === '') {
            if (!isKingAttacked(position, [rowCastle, 6], piece, rank, file))
                moves.push([rowCastle, 6])
        }
        else if (position?.[rowCastle]?.[0]?.endsWith('r') &&
            position[rowCastle][1] === '' &&
            position[rowCastle][2] === '' &&
            position[rowCastle][3] === '') {
            if (!isKingAttacked(position, [rowCastle, 2], piece, rank, file))
                moves.push([rowCastle, 2])
        }
    }

    return moves
}
export const getPawnMoves = ({ position, rank, file, piece }) => {
    const moves = []
    const dir = piece === 'wp' ? 1 : -1

    if (!position?.[rank + dir][file]) {
        if (!isKingAttacked(position, [rank + dir, file], piece, rank, file))
            moves.push([rank + dir, file])
    }


    if (rank % 5 === 1) {
        if (position?.[rank + dir]?.[file] === '' &&
            position?.[rank + dir + dir]?.[file] === '') {
            if (!isKingAttacked(position, [rank + dir + dir, file], piece, rank, file))
                moves.push([rank + dir + dir, file])
        }
    }

    return moves
}
export const getPawnCaptures = ({ position, prevPosition, rank, file, piece }) => {
    const moves = []
    const dir = piece === 'wp' ? 1 : -1
    const enemy = piece[0] === 'w' ? 'b' : 'w'

    // capture enemy to left :  bắt tốt của địch ở bên trái
    if (position?.[rank + dir]?.[file - 1] && position?.[rank + dir]?.[file - 1].startsWith(enemy)) {
        if (!isKingAttacked(position, [rank + dir, file - 1], piece, rank, file))
            moves.push([rank + dir, file - 1])
    }
    // capture enymy to right : bắt tốt của địch ở bên phải
    if (position?.[rank + dir]?.[file + 1] && position?.[rank + dir]?.[file + 1].startsWith(enemy)) {
        if (!isKingAttacked(position, [rank + dir, file + 1], piece, rank, file))
            moves.push([rank + dir, file + 1])
    }
    // en-passant : bắt tốt qua đường
    const enemyPawn = dir === 1 ? 'bp' : 'wp'
    const adjacentFiles = [file - 1, file + 1]
    if (prevPosition) {
        if ((dir === 1 && rank === 4) || (dir === -1 && rank === 3)) {
            adjacentFiles.forEach(f => {

                if (position?.[rank]?.[f] === enemyPawn &&
                    position?.[rank + dir + dir]?.[f] === '' &&
                    prevPosition?.[rank]?.[f] === '' &&
                    prevPosition?.[rank + dir + dir]?.[f] === enemyPawn) {
                    if (!isKingAttacked(position, [rank + dir, f], piece, rank, file))
                        moves.push([rank + dir, f])
                }
            })
        }
    }
    return moves
}