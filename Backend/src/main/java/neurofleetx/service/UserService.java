package com.neurofleetx.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.neurofleetx.model.User;
import com.neurofleetx.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register new user
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Default role if not provided
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("CUSTOMER");
        }

        // TODO: hash password in real apps
        return userRepository.save(user);
    }

    // Login
    public User login(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        User user = optionalUser.get();
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password");
        }
        return user;
    }

    // Get profile by email
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Update profile (except password)
    public User updateProfile(String email, User updated) {
        User existing = getByEmail(email);

        existing.setName(updated.getName());
        existing.setDob(updated.getDob());
        existing.setPhone(updated.getPhone());
        existing.setGender(updated.getGender());
        existing.setTravelPreferences(updated.getTravelPreferences());
        existing.setLocation(updated.getLocation());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        // role usually not changed by user; leave as is

        return userRepository.save(existing);
    }

    // Change password
    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = getByEmail(email);
        if (!user.getPassword().equals(currentPassword)) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(newPassword);
        userRepository.save(user);
    }
}
