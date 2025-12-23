package com.neurofleetx.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.neurofleetx.backend.dto.LoginRequest;
import com.neurofleetx.backend.dto.RegisterRequest;
import com.neurofleetx.backend.model.User;
import com.neurofleetx.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ========= REGISTER =========
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setGender(request.getGender());
        user.setRole(request.getRole());

        User savedUser = userService.register(user);
        return ResponseEntity.ok(savedUser);
    }

    // ========= LOGIN =========
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {

        User user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(user);
    }
}
