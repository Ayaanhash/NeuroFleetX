package com.neurofleetx.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_CONFIRMED = "CONFIRMED";
    public static final String STATUS_ON_TRIP = "ON_TRIP";
    public static final String STATUS_COMPLETED = "COMPLETED";
    public static final String STATUS_CANCELLED = "CANCELLED";

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Column(nullable = false)
    private Long customerId;

    private Long vehicleId;
    private String vehicleNumber;
    private String driverEmail;

    private String pickupLocation;
    private String dropLocation;

    @Column(nullable = false)
    private Integer passengers;

    private String vehicleType;
    private Boolean evPreference;

    
    private Double distance;
    private Integer estimatedEta;   // ✅ USED IN MY RIDES
    private Integer priority;

    
    @Column(nullable = false)
    private Double estimatedCost;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime bookingTime;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    
    @PrePersist
    public void applyDefaults() {

        if (passengers == null || passengers <= 0)
            passengers = 1;

        if (evPreference == null)
            evPreference = false;

        if (priority == null)
            priority = 2;

        if (distance == null || distance <= 0)
            distance = 10.0;

        if (estimatedEta == null || estimatedEta <= 0)
            estimatedEta = 30; // ✅ DEFAULT ETA (minutes)

        if (estimatedCost == null || estimatedCost < 0)
            estimatedCost = 0.0;

        if (status == null || status.isBlank())
            status = STATUS_PENDING;
        else
            status = status.toUpperCase();

        if (bookingTime == null)
            bookingTime = LocalDateTime.now();
    }

    

    public Long getId() { return id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getDriverEmail() { return driverEmail; }
    public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDropLocation() { return dropLocation; }
    public void setDropLocation(String dropLocation) { this.dropLocation = dropLocation; }

    public Integer getPassengers() { return passengers; }
    public void setPassengers(Integer passengers) { this.passengers = passengers; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public Boolean getEvPreference() { return evPreference; }
    public void setEvPreference(Boolean evPreference) { this.evPreference = evPreference; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public Integer getEstimatedEta() { return estimatedEta; }
    public void setEstimatedEta(Integer estimatedEta) { this.estimatedEta = estimatedEta; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public String getStatus() { return status; }
    public void setStatus(String status) {
        this.status = (status == null || status.isBlank())
                ? STATUS_PENDING
                : status.toUpperCase();
    }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}
