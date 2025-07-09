package com.UserTask.UserTask.entity;


import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true)
        private String token;

        @Column(nullable = false)
        private String email;

        @Column(nullable = false)
        private LocalDateTime expiryDate;

        @Column(nullable = false)
        private boolean used = false;

        @Column(nullable = false)
        private LocalDateTime createdAt;


    public PasswordResetToken(Long id, String token, String email, LocalDateTime expiryDate, boolean used, LocalDateTime createdAt) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.expiryDate = expiryDate;
        this.used = used;
        this.createdAt = createdAt;
    }
    public PasswordResetToken(String token, String email, LocalDateTime expiryDate) {
        this.token = token;
        this.email = email;
        this.expiryDate = expiryDate;
        this.createdAt = LocalDateTime.now();
    }

    public PasswordResetToken() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}
