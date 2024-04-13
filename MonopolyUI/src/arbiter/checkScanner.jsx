export const isKingAttacked = (position, move, piece, rank, file) => {
    const us = piece[0]
    var kingPosition = findKing(position, us);
    if (piece.endsWith('k')) kingPosition = move

    return hitByRook(position, move, us, rank, file, kingPosition) ||
        hitByBishop(position, move, us, rank, file, kingPosition) ||
        hitByKnight(position, move, us, kingPosition) ||
        hitByKing(position, us, kingPosition) ||
        hitByPawn(position, kingPosition, move, us)

}

const findKing = (position, us) => {
    for (let i = 0; i < position.length; i++) {
        for (let j = 0; j < position[i].length; j++) {
            if (position?.[i]?.[j] != null && position[i][j].endsWith('k') && position[i][j].startsWith(us)) return [i, j];
        }
    };
    return null;
}

const hitByRook = (position, move, us, rank, file, kingPos) => {
    const attackers = ['q', 'r']
    return checkHitInLine(position, move, us, rank, file, kingPos, 0, 1, attackers) ||
        checkHitInLine(position, move, us, rank, file, kingPos, 0, -1, attackers) ||
        checkHitInLine(position, move, us, rank, file, kingPos, 1, 0, attackers) ||
        checkHitInLine(position, move, us, rank, file, kingPos, -1, 0, attackers)
}

const hitByBishop = (position, move, us, rank, file, kingPos) => {
    const attackers = ['q', 'b']
    return checkHitInLine(position, move, us, rank, file, kingPos, 1, 1, attackers) ||
        checkHitInLine(position, move, us, rank, file, kingPos, 1, -1, attackers) ||
        checkHitInLine(position, move, us, rank, file, kingPos, -1, 1, attackers) ||
        checkHitInLine(position, move, us, rank, file, kingPos, -1, -1, attackers)
}

const checkHitInLine = (position, move, us, rank, file, kingPos, rowVal, colVal, attackers) => {
    for (let i = 1; i < 8; i++) {
        if ((kingPos[0] + i * rowVal === move[0] && kingPos[1] + i * colVal === move[1]) || kingPos[0] + i * rowVal >= 8 ||
            kingPos[0] + i * rowVal < 0 || kingPos[1] + i * colVal >= 8 || kingPos[1] + i * colVal < 0) break
        if (kingPos[0] + i * rowVal === rank && kingPos[1] + i * colVal === file) continue
        let piece = position[kingPos[0] + i * rowVal][kingPos[1] + i * colVal]
        if (piece) {
            if (!piece.startsWith(us) && attackers.includes(piece.substring(1))) return true
            break
        }
    }
    return false
}

const hitByKnight = (position, move, us, kingPos) => {
    return checkKnight(position, [kingPos[0] - 2, kingPos[1] - 1], move, us) ||
        checkKnight(position, [kingPos[0] - 2, kingPos[1] + 1], move, us) ||
        checkKnight(position, [kingPos[0] - 1, kingPos[1] + 2], move, us) ||
        checkKnight(position, [kingPos[0] + 1, kingPos[1] + 2], move, us) ||
        checkKnight(position, [kingPos[0] + 2, kingPos[1] + 1], move, us) ||
        checkKnight(position, [kingPos[0] + 2, kingPos[1] - 1], move, us) ||
        checkKnight(position, [kingPos[0] + 1, kingPos[1] - 2], move, us) ||
        checkKnight(position, [kingPos[0] - 1, kingPos[1] - 2], move, us)
}

const checkKnight = (position, knightPos, move, us) => {
    var knight = position?.[knightPos[0]]?.[knightPos[1]]
    return knight && knight.endsWith('n') && !knight.startsWith(us) && !(knightPos[0] === move[0] && knightPos[1] === move[1])
}

const hitByKing = (position, us, kingPos) => {
    return checkKing(position, [kingPos[0] - 1, kingPos[1] - 1], us) ||
        checkKing(position, [kingPos[0] - 1, kingPos[1] + 1], us) ||
        checkKing(position, [kingPos[0] + 1, kingPos[1] - 1], us) ||
        checkKing(position, [kingPos[0] + 1, kingPos[1] + 1], us) ||
        checkKing(position, [kingPos[0] - 1, kingPos[1]], us) ||
        checkKing(position, [kingPos[0], kingPos[1] - 1], us) ||
        checkKing(position, [kingPos[0], kingPos[1] + 1], us) ||
        checkKing(position, [kingPos[0] + 1, kingPos[1]], us);
}

const checkKing = (position, thatKingPos, us) => {
    var thatKing = position?.[thatKingPos[0]]?.[thatKingPos[1]]
    return thatKing && thatKing.endsWith('k') && !thatKing.startsWith(us)
}

const hitByPawn = (position, kingPos, move, us) => {
    var colorIndex = us === 'w' ? 1 : -1
    return checkPawn(position, [kingPos[0] + colorIndex, kingPos[1] + 1], move, us) || checkPawn(position, [kingPos[0] + colorIndex, kingPos[1] - 1], move, us)
}

const checkPawn = (position, piecePos, move, us) => {
    var pawn = position?.[piecePos[0]]?.[piecePos[1]]
    return pawn && pawn.endsWith('p') && !pawn.startsWith(us) && !(piecePos[0] === move[0] && piecePos[1] === move[1])
}