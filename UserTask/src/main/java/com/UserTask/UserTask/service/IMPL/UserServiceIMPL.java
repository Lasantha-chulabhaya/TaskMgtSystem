package com.UserTask.UserTask.service.IMPL;

import com.UserTask.UserTask.dto.RegisterRequestDTO;
import com.UserTask.UserTask.entity.User;
import com.UserTask.UserTask.repo.UserRepo;
import com.UserTask.UserTask.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceIMPL implements UserService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void register(RegisterRequestDTO registerRequestDTO) {
        if (userRepo.existsByemailEqualsIgnoreCase(registerRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        else if(userRepo.existsBynameEqualsIgnoreCase(registerRequestDTO.getName())){
            throw new IllegalArgumentException("User name already exists");
        }
        else {
            User user = new User (
                    registerRequestDTO.getName(),
                    registerRequestDTO.getEmail(),
                    registerRequestDTO.getPassword(), // Consider encrypting: passwordEncoder.encode(registerRequestDTO.getPassword())
                    registerRequestDTO.getCreated_at() != null ? registerRequestDTO.getCreated_at() : LocalDateTime.now(), // Set current time if not provided
                    null
            );
            userRepo.save(user);
        }
    }

    @Override
    public void changePassword(String email, String oldPassword, String newPassword) {
            User user = userRepo.findByEmailEqualsIgnoreCase(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepo.save(user);
    }
}