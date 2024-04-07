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
        String[][] piecesResponse = new String[GameBoard.ROW][GameBoard.COL];
        for (int i = 0; i < piecesResponse.length; i++)
            for (int j = 0; j < piecesResponse.length; j++)
                piecesResponse[i][j] = gameBoard.getPieces()[i][j] == null ? "" : gameBoard.getPieces()[i][j].getName();
        switch (chessMessage.getMessageType()) {
            case MOVE:
                if (user.getId().equals(room.getUsers().get(0).getId())) {
                    System.out.println("chạy dô ko");
                    // Xử lý việc di chuyển quân cờ
                    Move move = chessMessage.getMove();
                    move.setPiece(gameBoard.getPiece(move.getOldRow(), move.getOldCol()));
                    move.setCapture(gameBoard.getPiece(move.getNewRow(), move.getNewCol()));

                    if (!gameBoard.isValidMove(move)) {
                        System.out.println("hợp ệ nè");
                        gameBoard.makeMove(move);
                        String nextTurn = gameBoard.getTurn().equals("w") ? "b" : "w";
                        gameBoard.setTurn(nextTurn);
                        responseMessage = ChessMessage.builder()
                                .messageType(ChessMessage.ChessMessageType.MOVE)
                                .turn(nextTurn)
                                .pieces(piecesResponse)
                                .build();
                    } else {
                        System.out.println("ko có hợp gì hết");
                        responseMessage = ChessMessage.builder()
                                .messageType(ChessMessage.ChessMessageType.MOVE)
                                .turn(gameBoard.getTurn())
                                .pieces(piecesResponse)
                                .build();
                    }

                } else {
                    responseMessage = ChessMessage.builder()
                            .messageType(ChessMessage.ChessMessageType.MOVE)
                            .turn(gameBoard.getTurn())
                            .pieces(piecesResponse)
                            .build();
                }

                break;
//            case MOVE:
//
//                responseMessage = ChessMessage.builder()
//                        .messageType(ChessMessage.ChessMessageType.MOVE)
//                        .sender(user)
//                        .content(chessMessage.getContent())
//                        .build();
//
//                break;
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

        simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomId, responseMessage);
    }


}
