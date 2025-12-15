package com.neurofleetx.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    // NOTE: For a real app, hash passwords.
    @NotBlank
    private String password;

    private String role;  // ADMIN, FLEET_MANAGER, DRIVER, CUSTOMER

    private String dob;   // keep as String (yyyy-MM-dd) to match frontend
    private String phone;
    private String gender; // Female/Male/Other

    @Column(length = 1000)
    private String travelPreferences;

    private String location;
    private Double latitude;
    private Double longitude;
}
