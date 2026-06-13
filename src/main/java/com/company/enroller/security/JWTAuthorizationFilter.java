package com.company.enroller.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

    private final String secret;

    public JWTAuthorizationFilter(
            org.springframework.security.authentication.AuthenticationManager authenticationManager,
            String secret) {
        super(authenticationManager);
        this.secret = secret;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        String header =
                request.getHeader("Authorization");

        if (header == null ||
                !header.startsWith("Bearer ")) {

            chain.doFilter(request, response);
            return;
        }
        try {
            UsernamePasswordAuthenticationToken auth =
                    getAuthentication(request);

            if (auth == null) {
                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Token expired or invalid");
                return;
            }
            SecurityContextHolder.getContext().setAuthentication(auth);
            chain.doFilter(request, response);
        } catch (Exception e) {

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Authentication failed");
        }
    }

    private UsernamePasswordAuthenticationToken getAuthentication(
            HttpServletRequest request) {

        String token = request.getHeader("Authorization");
        if (token == null) {
            return null;
        }
        try {
            String participant = JWT.require(
                            Algorithm.HMAC256(secret))
                    .build()
                    .verify(token.replace("Bearer ", ""))
                    .getSubject();
            if (participant != null) {
                return new UsernamePasswordAuthenticationToken(
                        participant,
                        null,
                        Collections.emptyList());
            }
        } catch (TokenExpiredException e) {
            System.out.println("JWT expired: " + e.getMessage());
        } catch (JWTVerificationException e) {
            System.out.println("Invalid JWT: " + e.getMessage());
        }

        return null;
    }


}