package com.calendar.api.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

public class AuthorizationFilter extends OncePerRequestFilter {

    private static final String HEADER_NAME = "Authorization";
    private final FirebaseAuth firebaseAuth;

    public AuthorizationFilter(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
        HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String token = request.getHeader(HEADER_NAME);
        if (token == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } else {
            token = token.replace("Bearer ", "");
        }

        try {
            FirebaseToken decodedToken = null;
            decodedToken = firebaseAuth.verifyIdToken(token);
            request.setAttribute("userId", decodedToken.getUid());
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid JWT token");
        }
        filterChain.doFilter(request, response);
    }
}
