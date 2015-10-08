package com.benjamingbaxter.tictactoe.web.socket;

import javax.websocket.Session;
import java.util.*;

public class SessionHandler {
	
	private static SessionHandler instance;
	Map<String, Session> sessions;
	
	private SessionHandler() {
		sessions = new HashMap<>();
	}
	
	public static SessionHandler getInstance() {
		if( instance == null ) {
			instance = new SessionHandler();
		}
		return instance;
	}
	
	public void addSession(String user, Session session) {
		sessions.put(user, session);
	}
	
	public Session getSession(String user) {
		return sessions.get(user);
	}

	public Set<String> getUsers() {
		return sessions.keySet();
	}
}