package com.neurofleetx.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.neurofleetx.backend.dto.ProfileUpdateRequest;
import com.neurofleetx.backend.model.User;
import com.neurofleetx.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= REGISTER =================
    public User register(User user) {

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email already registered"
            );
        }

        // Default role if not provided
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("CUSTOMER");
        }

        // Plain password for now (OK for project stage)
        user.setPassword(user.getPassword());

        return userRepository.save(user);
    }

    // ================= LOGIN =================
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!password.equals(user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        return user;
    }

    // ================= GET PROFILE =================
    public User getProfile(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    // ================= UPDATE PROFILE =================
    public User updateProfile(Long id, ProfileUpdateRequest request) {

        User user = getProfile(id);

        user.setName(request.getName());
        user.setDob(request.getDob());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setTravelPreferences(request.getTravelPreferences());
        user.setLocation(request.getLocation());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());

        return userRepository.save(user);
    }
}
