package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.WaitRoomMessage;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.ChessMessage;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.Move;
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

import java.util.Date;

@Controller
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;
    private final RoomService roomService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    @MessageMapping("/game/chess")
    public void chessGameAction(@Payload ChessMessage chessMessage, Message message) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        ChessMessage responseMessage = null;
        GameBoard gameBoard = new GameBoard(); // Khởi tạo GameBoard từ dữ liệu đã lưu

        switch (chessMessage.getMessageType()) {
            case MOVE:
                // Xử lý việc di chuyển quân cờ
                Move move = chessMessage.getMove(); // Assume Move class is defined
                boolean isValidMove = gameBoard.isValidMove(move); // Assume isValidMove method is defined in GameBoard class
                if (isValidMove) {
                    gameBoard.makeMove(move); // Assume makeMove method is defined in GameBoard class
                    responseMessage = ChessMessage.builder()
                            .messageType(ChessMessage.ChessMessageType.MOVE)
                            .move(move)
                            .gameBoard(gameBoard)
                            .sender(user)
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
                boolean isCheckmate = gameBoard.isCheckmate(); // Assume isCheckmate method is defined in GameBoard class
                responseMessage = ChessMessage.builder()
                        .messageType(ChessMessage.ChessMessageType.CHECKMATE)
                        .isCheckmate(isCheckmate)
                        .sender(user)
                        .build();
                break;
            default:
                break;
        }

        simpMessagingTemplate.convertAndSend("/topic/game/chess" , responseMessage);
    }



}
