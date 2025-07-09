package com.UserTask.UserTask.dto;

//import lombok.*;

import java.time.LocalDateTime;
//@AllArgsConstructor
//@NoArgsConstructor


public class RegisterRequestDTO {

//    private int userId;
    private String name;
    private String email;
    private String password;
    private LocalDateTime created_at;

    public RegisterRequestDTO() {
    }

    public RegisterRequestDTO(String name, String email, String password, LocalDateTime created_at) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
    }

    @Override
    public String toString() {
        return "RegisterRequestDTO{" +
//                "userId=" + userId +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", created_at=" + created_at +
                '}';
    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
}
