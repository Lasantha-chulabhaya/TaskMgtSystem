package com.UserTask.UserTask.entity;


//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import net.bytebuddy.implementation.bind.annotation.AllArguments;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

//@AllArgsConstructor
//@NoArgsConstructor
@Entity
//@Data
@Table(name = "task")
public class Task {

    @Id
    @Column(name = "taskId", nullable = false, length = 15)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskId;

    @Column(name = "task_name", nullable = false, length = 50)
    private String taskName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
//    @JsonBackReference
    private User user;

    @Column(name = "last_upated")
    private LocalDateTime lastUpDate;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @ManyToMany
    @JoinTable(
            name = "user_tasks",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "email")
    )
    //@JsonIgnore  //Ignore this field in JSON response
    private Set<User> users = new HashSet<>();

    public Task() {
    }

    public Task(int taskId, String taskName, User user, LocalDateTime lastUpDate, LocalDateTime dueDate, Set<User> users) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.user = user;
        this.lastUpDate = lastUpDate;
        this.dueDate = dueDate;
        this.users = users;
    }

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}
