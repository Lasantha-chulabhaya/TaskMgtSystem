package com.UserTask.UserTask.service.IMPL;

import com.UserTask.UserTask.dto.LoginRequestDTO;
import com.UserTask.UserTask.dto.LoginResponseDTO;
import com.UserTask.UserTask.entity.User;
import com.UserTask.UserTask.repo.UserRepo;
import com.UserTask.UserTask.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class JwtServiceIMPL implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepo.findByEmailEqualsIgnoreCase(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(), // Use email as username since that's what you're using for authentication
                    user.getPassword(),
                    new ArrayList<>()
            );
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }

    public LoginResponseDTO createJwtToken(LoginRequestDTO loginRequestDTO) throws Exception {
        String email = loginRequestDTO.getEmail();
        String password = loginRequestDTO.getPassword();

        authenticate(email, password);

        UserDetails userDetails = loadUserByUsername(email);

        // Get the user entity to access the name
        Optional<User> userOptional = userRepo.findByEmailEqualsIgnoreCase(email);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found with email: " + email);
        }

        User user = userOptional.get();

        // Generate token with user's name
        String newGeneratedToken = jwtUtil.generateToken(userDetails, user.getName());

        LoginResponseDTO loginResponseDTO = new LoginResponseDTO(
                user.getEmail(),
                user.getName(),
                newGeneratedToken
        );
        return loginResponseDTO;
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (BadCredentialsException e) {
            throw new Exception("Invalid Credentials", e);
        }
    }
}