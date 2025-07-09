package com.UserTask.UserTask.dto;

import java.time.LocalDateTime;

public class TaskResponseDTO {
    private int taskId;
    private String taskName;
    private LocalDateTime lastUpDate;
    private LocalDateTime dueDate;
    private String userEmail;  // Instead of full user object

    // Constructors
    public TaskResponseDTO() {
    }

    public TaskResponseDTO(int taskId, String taskName, LocalDateTime lastUpDate,
                           LocalDateTime dueDate, String userEmail) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.lastUpDate = lastUpDate;
        this.dueDate = dueDate;
        this.userEmail = userEmail;
    }

    // Getters and Setters
    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public LocalDateTime getLastUpDate() {
        return lastUpDate;
    }

    public void setLastUpDate(LocalDateTime lastUpDate) {
        this.lastUpDate = lastUpDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
