package com.neurofleetx.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {


    public static final String STATUS_CONFIRMED = "CONFIRMED";
    public static final String STATUS_CANCELLED = "CANCELLED";

   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Column(nullable = false)
    private Long customerId;

    
    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String date;   
    @Column(nullable = false)
    private String time;  

    
    private String preferredVehicle;
    private Integer seats;
    private String energyType;

    private String vehicleType;
    private String vehicleNo;
    private String driver;
    private String phone;

   
    private Double cost;
    private Integer savedAmount;

    
    @Column(nullable = false)
    private String status;

    
    @Column(nullable = false)
    private LocalDateTime bookingTime;

  
    @PrePersist
    public void applyDefaults() {

        if (status == null || status.isBlank())
            status = STATUS_CONFIRMED;

        if (bookingTime == null)
            bookingTime = LocalDateTime.now();

        if (savedAmount == null)
            savedAmount = 0;

        if (seats == null || seats <= 0)
            seats = 1;

        if (cost == null)
            cost = 0.0;
    }


    public Long getId() { return id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getPreferredVehicle() { return preferredVehicle; }
    public void setPreferredVehicle(String preferredVehicle) { this.preferredVehicle = preferredVehicle; }

    public Integer getSeats() { return seats; }
    public void setSeats(Integer seats) { this.seats = seats; }

    public String getEnergyType() { return energyType; }
    public void setEnergyType(String energyType) { this.energyType = energyType; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }

    public String getDriver() { return driver; }
    public void setDriver(String driver) { this.driver = driver; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }

    public Integer getSavedAmount() { return savedAmount; }
    public void setSavedAmount(Integer savedAmount) { this.savedAmount = savedAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status.toUpperCase(); }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
}
