package com.neurofleetx.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.neurofleetx.dto.ProfileUpdateRequest;
import com.neurofleetx.model.User;
import com.neurofleetx.service.UserService;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // In a real app you'd get email from token. For now pass as query param.
    @GetMapping
    public ResponseEntity<User> getProfile(@RequestParam String email) {
        User user = userService.getByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestParam String email,
                                              @RequestBody ProfileUpdateRequest request) {
        User updatedUser = new User();
        updatedUser.setName(request.getName());
        updatedUser.setDob(request.getDob());
        updatedUser.setPhone(request.getPhone());
        updatedUser.setGender(request.getGender());
        updatedUser.setTravelPreferences(request.getTravelPreferences());
        updatedUser.setLocation(request.getLocation());
        updatedUser.setLatitude(request.getLatitude());
        updatedUser.setLongitude(request.getLongitude());

        User saved = userService.updateProfile(email, updatedUser);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestParam String email,
                                                 @RequestParam String currentPassword,
                                                 @RequestParam String newPassword) {
        userService.changePassword(email, currentPassword, newPassword);
        return ResponseEntity.ok("Password updated");
    }
}
