package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.WaitRoomMessage;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.ChessMessage;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.pieces.Piece;
import com.fit.monopolysbapi.monopolysocketapi.service.GameService;
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

import java.util.Arrays;
import java.util.Date;

@Controller
@RequiredArgsConstructor
public class GameController {

    private final RoomService roomService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/game/chess/{roomId}")
    public void chessGameAction(@Payload ChessMessage chessMessage, @DestinationVariable String roomId, Message message) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        ChessMessage responseMessage = null;
        Room room = roomService.getRoomById(roomId);
        GameBoard gameBoard = room.getGameBoard();
        switch (chessMessage.getMessageType()) {
            case MOVE:
                if ((user.getId().equals(room.getUsers().get(0).getId()) && gameBoard.getTurn().equals("w")) ||
                        (user.getId().equals(room.getUsers().get(1).getId()) && gameBoard.getTurn().equals("b"))) {
                    System.out.println("chạy dô ko");
                    // Xử lý việc di chuyển quân cờ
                    Move move = chessMessage.getMove();
                    move.setPiece(gameBoard.getPiece(move.getOldRow(), move.getOldCol()));
                    move.setCapture(gameBoard.getPiece(move.getNewRow(), move.getNewCol()));

                    System.out.println("is ok move? " + gameBoard.isValidMove(move));
                    System.out.println("move đê "+ move);
//                    System.out.println("capture "+move.getCapture());
                    if (gameBoard.isValidMove(move)) {
                        gameBoard.makeMove(move);
                        System.out.println("ok move");
                        String nextTurn = gameBoard.getTurn().equals("w") ? "b" : "w";
                        gameBoard.setTurn(nextTurn);
                        System.out.println(Arrays.deepToString(gameBoard.getPiecesResponse()));
                        System.out.println(Arrays.deepToString(room.getGameBoard().getPiecesResponse()));
                        responseMessage = ChessMessage.builder()
                                .messageType(ChessMessage.ChessMessageType.MOVE)
                                .turn(nextTurn)
                                .pieces(gameBoard.getPiecesResponse())
                                .build();

                    } else {
                        System.out.println("ko có hợp gì hết");
                        responseMessage = ChessMessage.builder()
                                .messageType(ChessMessage.ChessMessageType.MOVE)
                                .turn(gameBoard.getTurn())
                                .pieces(gameBoard.getPiecesResponse())
                                .build();
                    }

                } else {
                    responseMessage = ChessMessage.builder()
                            .messageType(ChessMessage.ChessMessageType.MOVE)
                            .turn(gameBoard.getTurn())
                            .pieces(gameBoard.getPiecesResponse())
                            .build();
                }

                break;

            case RESIGN:
                // Xử lý việc từ bỏ
                // ...
                break;
            case DRAW_OFFER:
                // Xử lý việc đề nghị hòa
                // ...
                break;
            case PIECE_PROMOTION:
                // Xử lý việc thăng cấp quân cờ
                // ...
                break;
            case CHECKMATE:
                // Xử lý việc kiểm tra Checkmate
//                boolean isCheckmate = gameBoard.isCheckmate(); // Assume isCheckmate method is defined in GameBoard class
//                responseMessage = ChessMessage.builder()
//                        .messageType(ChessMessage.ChessMessageType.CHECKMATE)
//                        .isCheckmate(isCheckmate)
//                        .sender(user)
//                        .build();
                break;
            default:
                break;
        }
        room.setGameBoard(gameBoard);
        simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomId, responseMessage);
    }


}
