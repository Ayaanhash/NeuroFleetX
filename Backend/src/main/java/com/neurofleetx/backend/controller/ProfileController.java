package com.neurofleetx.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.neurofleetx.backend.dto.ProfileUpdateRequest;
import com.neurofleetx.backend.model.User;
import com.neurofleetx.backend.service.UserService;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final UserService service;

    public ProfileController(UserService service) {
        this.service = service;
    }

    // GET PROFILE
    @GetMapping("/{id}")
    public User getProfile(@PathVariable Long id) {
        return service.getProfile(id);
    }

    // UPDATE PROFILE (USING DTO)
    @PutMapping("/{id}")
    public User updateProfile(@PathVariable Long id,
                              @RequestBody ProfileUpdateRequest request) {
        return service.updateProfile(id, request);
    }
}
