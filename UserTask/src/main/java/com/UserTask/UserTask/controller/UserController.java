package com.UserTask.UserTask.controller;

import com.UserTask.UserTask.dto.ChangePasswordDTO;
import com.UserTask.UserTask.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping("api/v1/user-update")
public class UserController {
    @Autowired
    private UserService userService;

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO, @ApiIgnore Authentication authentication) {
        String email = authentication.getName();
        userService.changePassword(email, changePasswordDTO.getOldPassword(), changePasswordDTO.getNewPassword());
        return ResponseEntity.ok("Password updated successfully");
    }

}
