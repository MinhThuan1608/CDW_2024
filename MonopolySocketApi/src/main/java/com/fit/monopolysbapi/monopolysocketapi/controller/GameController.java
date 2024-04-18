package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.ChessMessage;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.GameService;
import com.fit.monopolysbapi.monopolysocketapi.service.OnlineService;
import com.fit.monopolysbapi.monopolysocketapi.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
@RequiredArgsConstructor
public class GameController {

    private final RoomService roomService;
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/game/chess/{roomId}")
    public void chessGameAction(@Payload ChessMessage chessMessage, @DestinationVariable String roomId, Message message) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        Room room = roomService.getRoomById(roomId);
        GameBoard gameBoard = room.getGameBoard();
        ChessMessage responseMessage = null;
        switch (chessMessage.getMessageType()) {
            case CONNECT:
                if (gameBoard != null)
                    responseMessage = ChessMessage.builder()
                            .messageType(ChessMessage.ChessMessageType.MOVE)
                            .turn(gameBoard.getTurn())
                            .hints(gameBoard.getHintsResponse())
                            .pieces(gameBoard.getPiecesResponse())
                            .build();
                break;
            case MOVE:
                responseMessage = ChessMessage.builder()
                        .messageType(ChessMessage.ChessMessageType.MOVE)
                        .turn(gameBoard.getTurn())
                        .hints(gameBoard.getHintsResponse())
                        .pieces(gameBoard.getPiecesResponse())
                        .build();
                if ((user.getId().equals(room.getUsers().get(0).getId()) && gameBoard.getTurn() == 'w') ||
                        (user.getId().equals(room.getUsers().get(1).getId()) && gameBoard.getTurn() == 'b')) {
                    Move move = chessMessage.getMove();
                    move.setPiece(gameBoard.getPiece(move.getOldRow(), move.getOldCol()));
                    move.setCapture(gameBoard.getPiece(move.getNewRow(), move.getNewCol()));
                    System.out.println("move: " + move);
                    if (gameBoard.isValidMove(move)) {
                        gameBoard.makeMove(move, chessMessage.getNamePromotion());
                        char nextTurn = gameBoard.getNextTurn();
                        boolean isEnemyChecked = gameBoard.isChecked(nextTurn);
                        boolean isEnemyHasNoStepToPlay = gameBoard.hasNoStepToPlay(nextTurn);
                        if (isEnemyHasNoStepToPlay && isEnemyChecked) {
                            User loser = room.getUsers().stream().filter(u -> !u.getId().equals(user.getId())).findFirst().get();
                            responseMessage = ChessMessage.builder()
                                    .messageType(ChessMessage.ChessMessageType.WIN)
                                    .winnerId(user.getId())
                                    .pieces(gameBoard.getPiecesResponse())
                                    .build();
                            simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomId, responseMessage);
                            gameService.matchEnd(room, user, loser, true);
                            return;
                        } else if (isEnemyHasNoStepToPlay) {
                            User otherUser = room.getUsers().stream().filter(u -> !u.getId().equals(user.getId())).findFirst().get();
                            responseMessage = ChessMessage.builder()
                                    .messageType(ChessMessage.ChessMessageType.DRAW)
                                    .pieces(gameBoard.getPiecesResponse())
                                    .build();
                            gameService.matchEnd(room, user, otherUser, false);
                        } else {
                            gameBoard.setTurn(nextTurn);
                            responseMessage = ChessMessage.builder()
                                    .messageType(ChessMessage.ChessMessageType.MOVE)
                                    .turn(nextTurn)
                                    .move(Move.builder().oldRow(move.getOldRow()).oldCol(move.getOldCol()).newRow(move.getNewRow()).newCol(move.getNewCol()).build())
                                    .pieces(gameBoard.getPiecesResponse())
                                    .hints(gameBoard.getHintsResponse())
                                    .build();
                        }
                    }
                }
                break;
            case GIVE_UP:

                break;
            case GET_USER_IN_ROOM:

                break;
            default:
                break;
        }
        room.setGameBoard(gameBoard);
        simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomId, responseMessage);
    }


}
