package com.UserTask.UserTask.dto;

import java.time.LocalDateTime;

public class UpdateTaskDTO {
    private String taskName;
    private LocalDateTime dueDate;

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
}
