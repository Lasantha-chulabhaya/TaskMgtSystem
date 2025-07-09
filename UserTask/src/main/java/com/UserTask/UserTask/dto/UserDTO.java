package com.UserTask.UserTask.dto;

import com.UserTask.UserTask.entity.Task;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//@AllArgsConstructor
//@NoArgsConstructor
//@Data
public class UserDTO {

//    private int UserId;
    private String Name;
    private String Email;
    private String Password;
    private LocalDateTime Created_at;
    private List<Task> Tasks = new ArrayList<>();

    public UserDTO(String name, String email, String password, LocalDateTime created_at, List<Task> tasks) {
//        UserId = userId;
        Name = name;
        Email = email;
        Password = password;
        Created_at = created_at;
        Tasks = tasks;
    }

    public UserDTO() {
    }

//    public int getUserId() {
//        return UserId;
//    }
//
//    public void setUserId(int userId) {
//        UserId = userId;
//    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public LocalDateTime getCreated_at() {
        return Created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        Created_at = created_at;
    }

    public List<Task> getTasks() {
        return Tasks;
    }

    public void setTasks(List<Task> tasks) {
        Tasks = tasks;
    }
}
