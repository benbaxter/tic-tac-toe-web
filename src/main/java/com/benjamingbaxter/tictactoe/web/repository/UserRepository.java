package com.benjamingbaxter.tictactoe.web.repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class UserRepository {

    private Connection connection;
    private static final String INSERT_SQL = "insert into users values ( ? )";
    private static final String SELECT_ALL_SQL = "select username from users ;";
    private static final String SELECT_USER_SQL = "select username from users where username = ";

    public UserRepository(Connection connection) {
        this.connection = connection;
    }

    public void saveUser(String username) {
        try (PreparedStatement statement = connection.prepareStatement(INSERT_SQL)) {
            statement.setString(1, username);
            statement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Optional<String> findUser(String username) {
        try(Statement statement = connection.createStatement()) {
            //this is an example of SQL injection vulnerability
            statement.execute(SELECT_USER_SQL + "'" + username + "'");
            ResultSet rs = statement.getResultSet();
            while( rs.next() ) {
                return Optional.ofNullable(rs.getString("username"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    public List<String> findAll() {
        try(Statement statement = connection.createStatement()) {
            ResultSet rs = statement.executeQuery(SELECT_ALL_SQL);
            List<String> usernames = new ArrayList<>();
            while(rs.next()) {
                usernames.add(rs.getString("username"));
            }
            return usernames;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }
}
