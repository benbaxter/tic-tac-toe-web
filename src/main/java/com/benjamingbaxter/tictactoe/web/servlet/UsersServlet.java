package com.benjamingbaxter.tictactoe.web.servlet;

import com.benjamingbaxter.tictactoe.web.listener.DatabaseSetupListener;
import com.benjamingbaxter.tictactoe.web.model.User;
import com.benjamingbaxter.tictactoe.web.repository.UserRepository;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(urlPatterns = {"/users"})
public class UsersServlet extends HttpServlet {

    UserRepository repo;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        repo = (UserRepository) config.getServletContext().getAttribute(DatabaseSetupListener.USER_REPOSITORY_KEY);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<User> users = repo.findAll().stream()
                .map(username -> {
                    User u = new User();
                    u.setUsername(username);
                    return u;
                }).collect(Collectors.toList());

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String json = gson.toJson(users);

        resp.setContentType("application/json");
        resp.getWriter().write(json);
        resp.flushBuffer();
    }
}
