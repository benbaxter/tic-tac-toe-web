package com.benjamingbaxter.tictactoe.web.socket;

import com.benjamingbaxter.tictactoe.web.model.PlayRequest;
import com.benjamingbaxter.tictactoe.web.model.PlayResponse;
import com.benjamingbaxter.tictactoe.web.model.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import javax.websocket.server.ServerEndpointConfig;
import java.util.List;
import java.util.stream.Collectors;

@ServerEndpoint("/play")
public class TicTacToeSocket {

    Gson gson;

    public TicTacToeSocket() {
        gson = new GsonBuilder().create();
    }

    @OnMessage
    public void message(String message, Session session) {

        PlayRequest action = gson.fromJson(message, PlayRequest.class);
        PlayResponse response = createResponse(action);

        if( "start".equals(action.getAction()) ) {
            SessionHandler.getInstance().addSession(action.getUsername(), session);
        } else if("askToPlay".equals(action.getAction())) {
            Session otherSession = SessionHandler.getInstance().getSession(action.getOther());
            otherSession.getAsyncRemote().sendText(gson.toJson(response));
        }


        session.getAsyncRemote().sendText(gson.toJson(response));
    }

    private PlayResponse createResponse(PlayRequest action) {
        List<User> users = SessionHandler.getInstance().getUsers().stream()
                .map(username -> {
                    User user = new User();
                    user.setOnline(true);
                    user.setUsername(username);
                    return user;
                }).collect(Collectors.toList());

        PlayResponse response = new PlayResponse();
        response.setUsers(users);
        response.setAction(action.getAction());
        response.setUsername(action.getUsername());
        return response;
    }

}
