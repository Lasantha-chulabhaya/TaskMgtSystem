package com.UserTask.UserTask.service;

import com.UserTask.UserTask.dto.TaskRequestDTO;
import com.UserTask.UserTask.dto.TaskResponseDTO;
import com.UserTask.UserTask.dto.UpdateTaskDTO;

import java.util.List;

public interface TaskService {
    TaskResponseDTO createTaskForUser(TaskRequestDTO taskRequestDTO, String email);

    List<TaskResponseDTO> getTasksForUser(String email);

    String deleteTaskByIdAndEmail(int taskId, String email);

    String updateTask(int taskId, String email, UpdateTaskDTO updateTask);

    List<TaskResponseDTO> getTodaysTasksForUser(String email);
}
