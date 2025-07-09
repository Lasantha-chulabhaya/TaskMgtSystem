package com.UserTask.UserTask.service.IMPL;

import com.UserTask.UserTask.entity.PasswordResetToken;
import com.UserTask.UserTask.entity.User;
import com.UserTask.UserTask.repo.PasswordResetTokenRepo;
import com.UserTask.UserTask.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordResetTokenRepo tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.password-reset.token-validity-minutes}")
    private int tokenValidityMinutes;

    @Transactional
    public void initiatePasswordReset(String email) throws Exception {
        // Check if user exists
        Optional<User> userOptional = userRepo.findByEmailEqualsIgnoreCase(email);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        User user = userOptional.get();

        // Clean up expired tokens
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());

        // Mark any existing tokens for this email as used
        tokenRepository.markTokensAsUsedByEmail(email);

        // Generate new reset token
        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(tokenValidityMinutes);

        // Save token to database
        PasswordResetToken passwordResetToken = new PasswordResetToken(resetToken, email, expiryDate);
        tokenRepository.save(passwordResetToken);

        // Send email
        try {
            emailService.sendPasswordResetEmail(email, user.getName(), resetToken);
        } catch (MessagingException e) {
            throw new Exception("Failed to send password reset email", e);
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) throws Exception {
        // Find token
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        if (!tokenOptional.isPresent()) {
            throw new RuntimeException("Invalid reset token");
        }

        PasswordResetToken resetToken = tokenOptional.get();

        // Check if token is expired
        if (resetToken.isExpired()) {
            throw new RuntimeException("Reset token has expired");
        }

        // Check if token is already used
        if (resetToken.isUsed()) {
            throw new RuntimeException("Reset token has already been used");
        }

        // Find user
        Optional<User> userOptional = userRepo.findByEmailEqualsIgnoreCase(resetToken.getEmail());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }

    public boolean isValidToken(String token) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        if (!tokenOptional.isPresent()) {
            return false;
        }

        PasswordResetToken resetToken = tokenOptional.get();
        return !resetToken.isExpired() && !resetToken.isUsed();
    }
}
