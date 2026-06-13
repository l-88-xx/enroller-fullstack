package com.company.enroller.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.company.enroller.model.Participant;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;

//filtr requestów, który wystawi token JWT gdy klient prześle poprawne dane logowania

public class JWTAuthenticationFilter extends AbstractAuthenticationProcessingFilter {




    private AuthenticationManager authenticationManager;
    private final String secret;
    private final String issuer;
    private final int tokenExpiration;

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager, String secret, String issuer, int tokenExpiration) {
        super(new AntPathRequestMatcher("/tokens", HttpMethod.POST.name()));
        this.authenticationManager = authenticationManager;
        this.secret = secret;
        this.issuer = issuer;
        this.tokenExpiration = tokenExpiration;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res) throws AuthenticationException {
        try {
            Participant participant = new ObjectMapper().readValue(req.getInputStream(), Participant.class);
            if (participant.getLogin() == null || participant.getLogin().trim().isEmpty()) {
                throw new BadCredentialsException("Login jest wymagany");
            }
            if (participant.getPassword() == null || participant.getPassword().trim().isEmpty()) {
                throw new BadCredentialsException("Hasło jest wymagane");
            }
            Authentication authentication = new UsernamePasswordAuthenticationToken(participant.getLogin(), participant.getPassword(), new ArrayList<>());
            return authenticationManager.authenticate(authentication);
        } catch (IOException e) {
            throw new BadCredentialsException("Niepoprawny login request.", e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain, Authentication auth) throws IOException {
        String login = ((UserDetails) auth.getPrincipal()).getUsername();
        LocalDateTime now = LocalDateTime.now();
        String token = JWT.create()
                .withIssuer(issuer)
                .withSubject(login)
                .withIssuedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()))
                .withExpiresAt(Date.from(now.plusSeconds(tokenExpiration).atZone(ZoneId.systemDefault()).toInstant()))
                .withClaim("role", "participant")
                .sign(Algorithm.HMAC256(secret));
        res.getWriter().write(String.format("{\"token\": \"%s\"}", token));
    }

    @Override
    protected void unsuccessfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException failed)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"Niepoprawny login lub hasło\"}"
        );
    }
}