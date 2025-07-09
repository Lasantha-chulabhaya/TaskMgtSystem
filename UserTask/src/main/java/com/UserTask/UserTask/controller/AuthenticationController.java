package com.UserTask.UserTask.controller;

import com.UserTask.UserTask.dto.ForgotPasswordDTO;
import com.UserTask.UserTask.dto.LoginRequestDTO;
import com.UserTask.UserTask.dto.LoginResponseDTO;
import com.UserTask.UserTask.dto.RegisterRequestDTO;
import com.UserTask.UserTask.dto.ResetPasswordDTO;
import com.UserTask.UserTask.repo.UserRepo;
import com.UserTask.UserTask.service.IMPL.JwtServiceIMPL;
import com.UserTask.UserTask.service.IMPL.PasswordResetService;
import com.UserTask.UserTask.service.UserService;
import com.UserTask.UserTask.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("api/v1/user")
public class AuthenticationController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtServiceIMPL jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<?> RegisterUser(@RequestBody RegisterRequestDTO registerRequestDTO) {
        try {
            userService.register(registerRequestDTO);
            return ResponseEntity.ok("User registered successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO loginRequestDTO) throws Exception {
        return jwtService.createJwtToken(loginRequestDTO);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            passwordResetService.initiatePasswordReset(forgotPasswordDTO.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset email sent successfully");
            response.put("email", forgotPasswordDTO.getEmail());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        try {
            // Validate passwords match
            if (!resetPasswordDTO.getNewPassword().equals(resetPasswordDTO.getConfirmPassword())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Passwords do not match");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate password length
            if (resetPasswordDTO.getNewPassword().length() < 6) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Password must be at least 6 characters long");
                return ResponseEntity.badRequest().body(response);
            }

            passwordResetService.resetPassword(resetPasswordDTO.getToken(), resetPasswordDTO.getNewPassword());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = passwordResetService.isValidToken(token);

            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);

            if (!isValid) {
                response.put("message", "Invalid or expired reset token");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}