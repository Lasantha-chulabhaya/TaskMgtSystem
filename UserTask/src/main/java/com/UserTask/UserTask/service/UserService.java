package com.UserTask.UserTask.service;

import com.UserTask.UserTask.dto.RegisterRequestDTO;

public interface UserService {
    void register(RegisterRequestDTO registerRequestDTO);

    void changePassword(String email, String oldPassword, String newPassword);
}
