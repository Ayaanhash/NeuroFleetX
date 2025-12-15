package com.neurofleetx.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neurofleetx.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
