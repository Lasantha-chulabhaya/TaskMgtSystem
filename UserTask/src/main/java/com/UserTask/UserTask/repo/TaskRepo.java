package com.UserTask.UserTask.repo;

import com.UserTask.UserTask.entity.Task;
import com.UserTask.UserTask.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface TaskRepo extends JpaRepository<Task, Integer> {

    List<Task> findByUsers_Email(String email);


    List<Task> findByUserAndDueDate(User user, LocalDateTime dueDate);

    List<Task> findByUserAndDueDateBetween(User user, LocalDateTime dueDateAfter, LocalDateTime dueDateBefore);
}
