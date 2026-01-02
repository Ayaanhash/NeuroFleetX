package com.neurofleetx.service;

import com.neurofleetx.model.*;
import com.neurofleetx.repository.*;
import com.neurofleetx.dto.BookingTripDTO;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private EtaPredictionService etaPredictionService;

    /* ================= CREATE BOOKING ================= */
    public Booking createBooking(Booking booking) {
        booking.setStatus(Booking.STATUS_PENDING);
        booking.setBookingTime(LocalDateTime.now());
        booking.setEstimatedCost(calculateCost(booking));
        return bookingRepository.save(booking);
    }

    /* ================= CUSTOMER BOOKINGS ================= */
    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    /* ================= BOOKINGS + TRIPS ================= */
    public List<BookingTripDTO> getAllBookingsWithTrips() {
        return bookingRepository.findAll()
                .stream()
                .map(b -> new BookingTripDTO(
                        b,
                        tripRepository.findByBookingId(b.getId())
                ))
                .toList();
    }

    /* ================= COST ================= */
    private double calculateCost(Booking booking) {
        double cost = 100;
        if ("SUV".equalsIgnoreCase(booking.getVehicleType())) {
            cost += 50;
        }
        cost += booking.getPassengers() * 10;
        return cost;
    }

    /* ================= UPDATE STATUS ================= */
    @Transactional
    public Booking updateStatus(Long bookingId, String status) {
        return switch (status.toUpperCase()) {
            case Booking.STATUS_CONFIRMED -> confirmBooking(bookingId);
            case Booking.STATUS_ON_TRIP -> startTrip(bookingId);
            case Booking.STATUS_COMPLETED -> completeTrip(bookingId);
            case Booking.STATUS_CANCELLED -> cancelBooking(bookingId);
            default -> throw new RuntimeException("Invalid status");
        };
    }

    /* ================= CONFIRM BOOKING ================= */
    @Transactional
    public Booking confirmBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!Booking.STATUS_PENDING.equals(booking.getStatus())) {
            throw new RuntimeException("Booking already processed");
        }

        /* -------- VEHICLE -------- */
        Vehicle vehicle = vehicleRepository
                .findByStatusIgnoreCaseAndTypeIgnoreCase(
                        Vehicle.STATUS_AVAILABLE,
                        booking.getVehicleType()
                )
                .stream()
                .min(Comparator.comparingDouble(Vehicle::getCurrentLoad))
                .orElseThrow(() -> new RuntimeException("No available vehicles"));

        /* -------- DRIVER -------- */
        Driver driver = driverRepository
                .findFirstByStatus(DriverStatus.AVAILABLE)
                .orElseThrow(() -> new RuntimeException("No available drivers"));

        /* -------- ASSIGN -------- */
        vehicle.assignToDriver(driver.getEmail());
        vehicleRepository.save(vehicle);

        driver.setStatus(DriverStatus.ON_TRIP);
        driverRepository.save(driver);

        booking.setVehicleId(vehicle.getId());
        booking.setVehicleNumber(vehicle.getNumber());
        booking.setDriverEmail(driver.getEmail());

        int etaMinutes = etaPredictionService.predictEta(
                booking.getDistance(), "MEDIUM"
        );
        booking.setEstimatedEta(etaMinutes);

        booking.setStatus(Booking.STATUS_CONFIRMED);
        bookingRepository.save(booking);

        /* ================= CREATE TRIP ================= */
        if (!tripRepository.existsByBookingId(booking.getId())) {

            Trip trip = new Trip();
            trip.setBookingId(booking.getId());
            trip.setCustomerEmail(String.valueOf(booking.getCustomerId()));
            trip.setPickupLocation(booking.getPickupLocation());
            trip.setDropLocation(booking.getDropLocation());
            trip.setVehicleNumber(booking.getVehicleNumber());
            trip.setDriverEmail(booking.getDriverEmail());
            trip.setStatus("PLANNED");

            /* ✅ ETA → TRIP */
            trip.setDurationHours(etaMinutes / 60.0);

            tripRepository.save(trip);
        }

        return booking;
    }

    /* ================= START TRIP ================= */
    @Transactional
    public Booking startTrip(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(Booking.STATUS_ON_TRIP);
        booking.setStartTime(LocalDateTime.now());
        bookingRepository.save(booking);

        tripRepository.updateStatusByBookingId(bookingId, "ON_TRIP");

        return booking;
    }

    /* ================= COMPLETE TRIP ================= */
    @Transactional
    public Booking completeTrip(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(Booking.STATUS_COMPLETED);
        booking.setEndTime(LocalDateTime.now());
        bookingRepository.save(booking);

        tripRepository.updateStatusByBookingId(bookingId, "COMPLETED");

        vehicleRepository.findById(booking.getVehicleId())
                .ifPresent(v -> {
                    v.releaseVehicle();
                    vehicleRepository.save(v);
                });

        driverRepository.findByEmail(booking.getDriverEmail())
                .ifPresent(d -> {
                    d.setStatus(DriverStatus.AVAILABLE);
                    driverRepository.save(d);
                });

        return booking;
    }

    /* ================= CANCEL BOOKING ================= */
    @Transactional
    public Booking cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(Booking.STATUS_CANCELLED);
        bookingRepository.save(booking);

        tripRepository.deleteByBookingId(bookingId);
        return booking;
    }

    /* ================= AI RECOMMENDATION ================= */
    public List<Vehicle> recommendVehicles(int passengers, String vehicleType, boolean evPreference) {
        return vehicleRepository
                .findByStatusIgnoreCaseAndTypeIgnoreCase(
                        Vehicle.STATUS_AVAILABLE,
                        vehicleType
                );
    }
}
