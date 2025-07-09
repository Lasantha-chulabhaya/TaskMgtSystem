package com.UserTask.UserTask.dto;

//import com.UserTask.UserTask.entity.User;
//import jakarta.persistence.Column;
//import jakarta.persistence.FetchType;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TaskDTO {
    private int TaskId;
    private String TaskName;
    private LocalDateTime LastUpDate;
    private LocalDateTime DueDate;
    private boolean IsDueToday;
}
