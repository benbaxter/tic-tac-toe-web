package com.benjamingbaxter.tictactoe.web.servlet;

import com.benjamingbaxter.tictactoe.web.listener.DatabaseSetupListener;
import com.benjamingbaxter.tictactoe.web.repository.UserRepository;
import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@WebServlet(urlPatterns = {"/register"})
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        UserRepository repo = (UserRepository) getServletContext().getAttribute(DatabaseSetupListener.USER_REPOSITORY_KEY);

        String username = req.getParameter("username");
        if( username != null ) {
            Optional<String> user = repo.findUser(username);
            //do not register an existing user
            if( ! user.isPresent() ) {
                repo.saveUser(username);
            }
        }

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        String json = gson.toJson(ImmutableMap.of("username", username));

        resp.setContentType("application/json");
        resp.getWriter().write(json);
        resp.flushBuffer();

    }
}
