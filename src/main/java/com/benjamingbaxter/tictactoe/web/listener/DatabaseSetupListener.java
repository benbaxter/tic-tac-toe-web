package com.benjamingbaxter.tictactoe.web.listener;

import com.benjamingbaxter.tictactoe.web.repository.UserRepository;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@WebListener
public class DatabaseSetupListener implements ServletContextListener {

    public static final String DATABASE_CONNECTION_KEY = "dbconn";
    public static final String USER_REPOSITORY_KEY = "userRepository";

    Connection connection;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            Class.forName("com.mysql.jdbc.Driver").newInstance();
        } catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        try {
            connection = DriverManager.getConnection("jdbc:mysql://localhost/tic_tac_toe?user=root&password=");
            sce
                .getServletContext()
                .setAttribute(DATABASE_CONNECTION_KEY, connection);

            sce
                .getServletContext()
                .setAttribute(USER_REPOSITORY_KEY, new UserRepository(connection));

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if( connection != null ) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
