package com.company.enroller.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
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
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
        UsernamePasswordAuthenticationToken authentication =
                getAuthentication(request);
        SecurityContextHolder.getContext()
                .setAuthentication(authentication);
        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(
            HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        if (token != null) {
            String participant = JWT.require(Algorithm.HMAC256(secret))
                    .build()
                    .verify(token.replace("Bearer ", ""))
                    .getSubject();

            if (participant != null) {
                return new UsernamePasswordAuthenticationToken(
                        participant,
                        null,
                        Collections.emptyList());
            }
        }
        return null;
    }
}