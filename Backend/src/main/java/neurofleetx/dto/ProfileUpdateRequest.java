package com.neurofleetx.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {
    private String name;
    private String dob;
    private String phone;
    private String gender;
    private String travelPreferences;
    private String location;
    private Double latitude;
    private Double longitude;
}
