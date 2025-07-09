package com.UserTask.UserTask.dto;

import java.time.LocalDateTime;

public class TaskRequestDTO {
    private String TaskName;
    private LocalDateTime DueDate;
    private String email;

    public TaskRequestDTO() {
    }

    public TaskRequestDTO(String taskName, LocalDateTime dueDate, String email) {
        TaskName = taskName;
        DueDate = dueDate;
        this.email = email;
    }

    public String getTaskName() {
        return TaskName;
    }

    public void setTaskName(String taskName) {
        TaskName = taskName;
    }

    public LocalDateTime getDueDate() {
        return DueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        DueDate = dueDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
