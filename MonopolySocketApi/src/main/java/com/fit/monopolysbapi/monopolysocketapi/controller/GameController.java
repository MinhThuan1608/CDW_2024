package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.ChessMessage;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
import com.fit.monopolysbapi.monopolysocketapi.response.AbstractResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
        ChessMessage responseMessageSwapTurn = null;
        Room room = roomService.getRoomById(roomId);
        GameBoard gameBoard = room.getGameBoard();
        switch (chessMessage.getMessageType()) {
            case MOVE:
                if ((user.getId().equals(room.getUsers().get(0).getId()) && gameBoard.getTurn().equals("w")) ||
                        (user.getId().equals(room.getUsers().get(1).getId()) && gameBoard.getTurn().equals("b"))) {
                    Move move = chessMessage.getMove();
                    move.setPiece(gameBoard.getPiece(move.getOldRow(), move.getOldCol()));
                    move.setCapture(gameBoard.getPiece(move.getNewRow(), move.getNewCol()));
                    if (gameBoard.isValidMove(move)) {
                        gameBoard.makeMove(move, chessMessage.getNamePromotion());
                        boolean isWin = gameBoard.checkWin(move);
                        String nextTurn = gameBoard.getTurn().equals("w") ? "b" : "w";
                        gameBoard.setTurn(nextTurn);
                        responseMessage = ChessMessage.builder()
                                .messageType(ChessMessage.ChessMessageType.MOVE)
                                .turn(nextTurn)
                                .pieces(gameBoard.getPiecesResponse())
                                .isWin(isWin)
                                .build();
//                                .timer(60)
//                        ====================
                        gameBoard.setTimer(GameBoard.RESET_TURN);
                        gameBoard.startTimer();
                    } else {
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
            case MESSAGE:
                responseMessage = ChessMessage.builder()
                        .users(room.getUsers())
                        .messageType(ChessMessage.ChessMessageType.MESSAGE)
                        .content(chessMessage.getContent())
                        .createAt(new Date())
                        .sender(user).build();
                break;
            default:
                break;
        }
        room.setGameBoard(gameBoard);
        simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomId, responseMessage);
    }

    @MessageMapping("/game/turn/{roomId}")
    public void chessGameSwapTurn(@DestinationVariable String roomId) {
        ChessMessage responseMessageSwapTurn = null;
        Room room = roomService.getRoomById(roomId);
        GameBoard gameBoard = room.getGameBoard();
        System.out.println(gameBoard.getTurn() + "đổi turn ==================");
        if (gameBoard.getTimer() == GameBoard.RESET_TURN)
            responseMessageSwapTurn = ChessMessage.builder()
                    .turn(gameBoard.getTurn())
                    .build();
        if (gameBoard.getCountdownResetCounter() == 3)
            responseMessageSwapTurn = ChessMessage.builder()
                    .isWin(gameBoard.isWin())
                    .turn(gameBoard.getTurn()).build();

        simpMessagingTemplate.convertAndSend("/topic/game/turn/" + roomId, responseMessageSwapTurn);
    }

//    @MessageMapping("/game/time/{roomId}")
//    public void chessGetTimer(@DestinationVariable String roomId) {
//        if (roomService.getRoomById(roomId) != null && roomService.getRoomById(roomId).getGameBoard() != null)
//            simpMessagingTemplate.convertAndSend("/topic/game/time/" + roomId, roomService.getRoomById(roomId).getGameBoard().getTimer());
//    }

    @GetMapping("/room/game/time/{roomId}")
    public ResponseEntity getTimmer(@PathVariable String roomId, Authentication authentication) {
        if (roomService.getRoomById(roomId) != null && roomService.getRoomById(roomId).getGameBoard() != null) {
            return ResponseEntity.ok(new AbstractResponse(200, "Get time ok", roomService.getRoomById(roomId).getGameBoard().getTimer()));
        }
        return ResponseEntity.ok(new AbstractResponse(200, "Get time fail", false));
    }

    @MessageMapping("/game/chess/chat/{roomId}")
    public void chessGameChat(@Payload ChessMessage chessMessage, @DestinationVariable String roomId, Message message) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        ChessMessage responseMessage = null;
        Room room = roomService.getRoomById(roomId);
        switch (chessMessage.getMessageType()) {
            case MESSAGE:
                responseMessage = ChessMessage.builder()
                        .users(room.getUsers())
                        .messageType(ChessMessage.ChessMessageType.MESSAGE)
                        .content(chessMessage.getContent())
                        .createAt(new Date())
                        .sender(user).build();
                break;
            default:
                break;
        }
        simpMessagingTemplate.convertAndSend("/topic/game/chess/chat/" + roomId, responseMessage);
    }


}
