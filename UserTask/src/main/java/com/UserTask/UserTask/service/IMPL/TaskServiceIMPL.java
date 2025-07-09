package com.UserTask.UserTask.service.IMPL;

import com.UserTask.UserTask.dto.TaskRequestDTO;
import com.UserTask.UserTask.dto.TaskResponseDTO;
import com.UserTask.UserTask.dto.UpdateTaskDTO;
import com.UserTask.UserTask.entity.Task;
import com.UserTask.UserTask.entity.User;
import com.UserTask.UserTask.repo.TaskRepo;
import com.UserTask.UserTask.repo.UserRepo;
import com.UserTask.UserTask.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskServiceIMPL implements TaskService {

    @Autowired
    TaskRepo taskRepo;

    @Autowired
    UserRepo userRepo;


    @Override
    public TaskResponseDTO createTaskForUser(TaskRequestDTO taskRequestDTO, String email) {

        User user = userRepo.findByEmailEqualsIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Task task = new Task();
        task.setTaskName(taskRequestDTO.getTaskName());
        task.setDueDate(taskRequestDTO.getDueDate());
        task.setUser(user);
        task.getUsers().add(user); // many-to-many

        Task savedTask = taskRepo.save(task);


        return new TaskResponseDTO(
                savedTask.getTaskId(),
                savedTask.getTaskName(),
                savedTask.getLastUpDate(),
                savedTask.getDueDate(),
                user.getEmail()
        );



    }

    @Override
    public List<TaskResponseDTO> getTasksForUser(String email) {
        List<Task> tasks = taskRepo.findByUsers_Email(email);
        List<TaskResponseDTO> dtos = new ArrayList<>();
        for (Task task : tasks) {
            TaskResponseDTO dto = new TaskResponseDTO(
                    task.getTaskId(),
                    task.getTaskName(),
                    task.getLastUpDate(),
                    task.getDueDate(),
                    task.getUser().getEmail()
            );
            dtos.add(dto);
        }
        return dtos;

//        Optional<User> user = userRepo.findByEmailEqualsIgnoreCase(email);
//        List<Task> tasks = new ArrayList<>();
//        if (user.isPresent()) {
//            tasks = taskRepo.findByUser_Email(user.get().getEmail());
//        }
//        else {
//            throw new RuntimeException("User not found with email: " + email);
//        }
//
//        return tasks;
    }

    @Override
    public String deleteTaskByIdAndEmail(int taskId, String email) {
        Optional<Task> currentTask = taskRepo.findById(taskId);
        if (currentTask.isEmpty()) {
            throw new RuntimeException("Task not found");
        }

        Task task = currentTask.get();

        // Check ownership
        if (!task.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized to delete this task");
        }

        taskRepo.delete(task);
        return "deleted task "+task.getTaskName();
    }

    @Override
    public String updateTask(int taskId, String email, UpdateTaskDTO updateTaskDTO) {
        if (taskRepo.existsById(taskId)) {
            Task task = taskRepo.getReferenceById(taskId);

            if (!task.getUser().getEmail().equalsIgnoreCase(email)) {
                throw new RuntimeException("Unauthorized to update this task");
            }


            if (updateTaskDTO.getTaskName() != null && !updateTaskDTO.getTaskName().trim().isEmpty()) {
                task.setTaskName(updateTaskDTO.getTaskName());
            }

            if (updateTaskDTO.getDueDate() != null) {
                task.setDueDate(updateTaskDTO.getDueDate());
            }

            task.setLastUpDate(LocalDateTime.now());

            taskRepo.save(task);
            return updateTaskDTO.getTaskName() + " Updated Successful";
        } else {
            throw new RuntimeException("No task found for that id");
        }
    }

    @Override
    public List<TaskResponseDTO> getTodaysTasksForUser(String email) {
        Optional<User> userOptional = userRepo.findByEmailEqualsIgnoreCase(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOptional.get();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay(); // 00:00
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay(); // Next day 00:00 (exclusive)

        List<Task> tasks = taskRepo.findByUserAndDueDateBetween(user, startOfDay, endOfDay);

        List<TaskResponseDTO> dtos = new ArrayList<>();
        for (Task task : tasks) {
            TaskResponseDTO dto = new TaskResponseDTO(
                    task.getTaskId(),
                    task.getTaskName(),
                    task.getLastUpDate(),
                    task.getDueDate(),
                    task.getUser().getEmail()
            );
            dtos.add(dto);
        }

        return dtos;
    }

}
