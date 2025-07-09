package com.UserTask.UserTask.controller;

import com.UserTask.UserTask.dto.TaskRequestDTO;
import com.UserTask.UserTask.dto.TaskResponseDTO;
import com.UserTask.UserTask.dto.UpdateTaskDTO;
import com.UserTask.UserTask.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;


    @PostMapping("/create-task")
    public ResponseEntity<?> createTask(@RequestBody TaskRequestDTO taskRequestDTO, @ApiIgnore Authentication authentication) {
        String email = authentication.getName(); //email eka subject ekt daala tiyenne
        TaskResponseDTO savedtask = taskService.createTaskForUser(taskRequestDTO, email);
        return new ResponseEntity<>(savedtask, HttpStatus.CREATED);
    }

    @GetMapping("all-tasks")
    public ResponseEntity<List<TaskResponseDTO>> getAllTasksForUser(Authentication authentication) {
        String email = authentication.getName();
        List<TaskResponseDTO> tasks = taskService.getTasksForUser(email);
        return new ResponseEntity<>(tasks, HttpStatus.OK);

    }

    @DeleteMapping(
            path = "delete/{id}")

    public ResponseEntity<?> deleteTask(@PathVariable(value = "id") int taskId, @ApiIgnore Authentication authentication) {
        String email = authentication.getName();
        String deleted_task = taskService.deleteTaskByIdAndEmail(taskId, email);
        return new ResponseEntity<>(deleted_task, HttpStatus.OK);

    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTask(@PathVariable(value = "id") int taskId, @RequestBody UpdateTaskDTO updateTaskDTO, @ApiIgnore Authentication authentication) {

        try
        {
            String email = authentication.getName();
            String message = taskService.updateTask(taskId, email, updateTaskDTO);
            return ResponseEntity.ok("Task updated successfully - " + message);
        } catch (RuntimeException e)
        {
            return ResponseEntity.badRequest().body("Task update failed: " + e.getMessage());

        }
    }

    @GetMapping("/today")
    public ResponseEntity<List<TaskResponseDTO>> getTodaysTasks(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<TaskResponseDTO> tasks = taskService.getTodaysTasksForUser(email);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

}
