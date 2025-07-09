package com.UserTask.UserTask.repo;

import com.UserTask.UserTask.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface UserRepo extends JpaRepository<User, String> {
    boolean existsByemailEqualsIgnoreCase(String userEmail);


    boolean existsBynameEqualsIgnoreCase(String userName);

    Optional<User> findByEmailEqualsIgnoreCase(String email);


}


