package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.ChessMessage;
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
import org.springframework.scheduling.annotation.Scheduled;
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
        User winner = null;
        switch (chessMessage.getMessageType()) {
            case CONNECT:
                if (gameBoard != null)
                    responseMessage = ChessMessage.builder()
                            .messageType(ChessMessage.ChessMessageType.MOVE)
                            .turn(gameBoard.getTurn())
                            .timer(gameBoard.getTimer())
                            .hints(gameBoard.getHintsResponse())
                            .pieces(gameBoard.getPiecesResponse())
                            .build();
                break;
            case MOVE:
                responseMessage = ChessMessage.builder()
                        .messageType(ChessMessage.ChessMessageType.MOVE)
                        .turn(gameBoard.getTurn())
                        .timer(gameBoard.getTimer())
                        .hints(gameBoard.getHintsResponse())
                        .pieces(gameBoard.getPiecesResponse())
                        .build();
                if ((user.getId().equals(room.getUsers().get(0).getId()) && gameBoard.getTurn() == 'w') ||
                        (user.getId().equals(room.getUsers().get(1).getId()) && gameBoard.getTurn() == 'b')) {
                    Move move = chessMessage.getMove();
                    if (move != null) {
                        move.setPiece(gameBoard.getPiece(move.getOldRow(), move.getOldCol()));
                        move.setCapture(gameBoard.getPiece(move.getNewRow(), move.getNewCol()));
                        System.out.println("move: " + move);
                    }
                    if (gameBoard.isValidMove(move)) {
                        gameBoard.makeMove(move, chessMessage.getNamePromotion());
                        char nextTurn = gameBoard.getNextTurn();
                        boolean isEnemyChecked = gameBoard.isChecked(nextTurn);
                        boolean isEnemyHasNoStepToPlay = gameBoard.hasNoStepToPlay(nextTurn);
//                        boolean onlyKing = gameBoard.onlyKing();
                        if ((isEnemyHasNoStepToPlay && isEnemyChecked)
                                || (move.getCapture() != null && move.getCapture().getName().substring(1).equals("k"))) {
                            User loser = room.getUsers().stream().filter(u -> !u.getId().equals(user.getId())).findFirst().get();
                            responseMessage = ChessMessage.builder()
                                    .messageType(ChessMessage.ChessMessageType.WIN)
                                    .winnerId(user.getId())
                                    .pieces(gameBoard.getPiecesResponse())
                                    .build();
                            simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomId, responseMessage);
                            gameService.matchEnd(room, user, loser, true);
                            return;
                        } else if (isEnemyHasNoStepToPlay || gameBoard.notEnoughPieceToPlay(move)) {
                            User otherUser = room.getUsers().stream().filter(u -> !u.getId().equals(user.getId())).findFirst().get();
                            responseMessage = ChessMessage.builder()
                                    .messageType(ChessMessage.ChessMessageType.DRAW)
                                    .pieces(gameBoard.getPiecesResponse())
                                    .build();
                            gameService.matchEnd(room, user, otherUser, false);
                        } else {
                            gameBoard.setTurn(nextTurn);
                            gameBoard.setTimer(gameBoard.getResetTime());
                            gameBoard.startTimer();
                            responseMessage = ChessMessage.builder()
                                    .messageType(ChessMessage.ChessMessageType.MOVE)
                                    .turn(nextTurn)
                                    .timer(gameBoard.getTimer())
                                    .move(Move.builder().oldRow(move.getOldRow()).oldCol(move.getOldCol()).newRow(move.getNewRow()).newCol(move.getNewCol()).build())
                                    .pieces(gameBoard.getPiecesResponse())
                                    .hints(gameBoard.getHintsResponse())
                                    .build();

                        }
                    }
                }
                break;

            case MESSAGE:
                responseMessage = ChessMessage.builder()
                        .users(room.getUsers())
                        .messageType(ChessMessage.ChessMessageType.MESSAGE)
                        .content(chessMessage.getContent())
                        .createAt(new Date())
                        .sender(user).build();
                break;
            case GIVE_UP:
                winner = user.getId().equals(room.getUsers().get(0).getId()) ? room.getUsers().get(1) : room.getUsers().get(0);
                gameService.matchEnd(room, winner, user, true);
                responseMessage = ChessMessage.builder()
                        .messageType(ChessMessage.ChessMessageType.GIVE_UP)
                        .winnerId(winner.getId())
                        .pieces(gameBoard.getPiecesResponse())
                        .build();
                break;
            case EXIT:
                winner = user.getId().equals(room.getUsers().get(0).getId()) ? room.getUsers().get(1) : room.getUsers().get(0);
                gameService.matchEnd(room, winner, user, true);
                responseMessage = ChessMessage.builder()
                        .messageType(ChessMessage.ChessMessageType.EXIT)
                        .winnerId(winner.getId())
                        .pieces(gameBoard.getPiecesResponse())
                        .build();
                roomService.leaveRoom(user, roomId);
                break;
            default:
                break;
        }
        room.setGameBoard(gameBoard);
        simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomId, responseMessage);
    }


    @Scheduled(fixedRate = 1000)
    public void autoReturnStateGameBoard() {
        if (roomService.getRooms().size() > 0)
            for (int i = 0; i < roomService.getRooms().size(); i++) {
                if (roomService.getRooms().get(i).isPlaying() && roomService.getRooms().get(i).getGameBoard().isJustResetCounter()) {
                    if (roomService.getRooms().get(i).getGameBoard().getCountdownResetCounterBlack() > 3) {
                        simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomService.getRooms().get(i).getId(), ChessMessage.builder()
                                .messageType(ChessMessage.ChessMessageType.WIN)
                                .winnerId(roomService.getRooms().get(i).getUsers().get(0).getId())
                                .pieces(roomService.getRooms().get(i).getGameBoard().getPiecesResponse())
                                .build());
                        gameService.matchEnd(roomService.getRooms().get(i), roomService.getRooms().get(i).getUsers().get(0), roomService.getRooms().get(i).getUsers().get(1), true);
                    } else if (roomService.getRooms().get(i).getGameBoard().getCountdownResetCounterWhite() > 3) {
                        simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomService.getRooms().get(i).getId(), ChessMessage.builder()
                                .messageType(ChessMessage.ChessMessageType.WIN)
                                .winnerId(roomService.getRooms().get(i).getUsers().get(1).getId())
                                .pieces(roomService.getRooms().get(i).getGameBoard().getPiecesResponse())
                                .build());

                        gameService.matchEnd(roomService.getRooms().get(i), roomService.getRooms().get(i).getUsers().get(1), roomService.getRooms().get(i).getUsers().get(0), true);
                    } else {
                        simpMessagingTemplate.convertAndSend("/topic/game/chess/" + roomService.getRooms().get(i).getId(), ChessMessage.builder()
                                .messageType(ChessMessage.ChessMessageType.TIME)
                                .turn(roomService.getRooms().get(i).getGameBoard().getTurn())
                                .hints(roomService.getRooms().get(i).getGameBoard().getHintsResponse())
                                .timer(roomService.getRooms().get(i).getGameBoard().getTimer())
                                .build());
                        roomService.getRooms().get(i).getGameBoard().setJustResetCounter(false);
                    }
                }
            }

    }


}
