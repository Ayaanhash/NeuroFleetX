package com.neurofleetx.controller;

import com.neurofleetx.model.Booking;
import com.neurofleetx.model.Vehicle;
import com.neurofleetx.dto.BookingTripDTO;
import com.neurofleetx.service.BookingService;
import com.neurofleetx.service.RouteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RouteService routeService;

    /* ===============================
       CREATE BOOKING (MODULE 5)
    =============================== */
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking
    ) {
        return ResponseEntity.ok(
                bookingService.createBooking(booking)
        );
    }

    /* ===============================
       CUSTOMER BOOKINGS
    =============================== */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(
            @PathVariable Long customerId
    ) {
        return ResponseEntity.ok(
                bookingService.getBookingsByCustomer(customerId)
        );
    }

    /* ===============================
       BOOKING + TRIP (ADMIN / FLEET)
    =============================== */
    @GetMapping("/with-trips")
    public ResponseEntity<List<BookingTripDTO>> getBookingsWithTrips() {
        return ResponseEntity.ok(
                bookingService.getAllBookingsWithTrips()
        );
    }

    /* ===============================
       AI VEHICLE RECOMMENDATIONS
       (MODULE 5 CORE FEATURE)
    =============================== */
    @PostMapping("/recommendations")
    public ResponseEntity<List<Vehicle>> getRecommendations(
            @RequestBody Map<String, Object> request
    ) {
        int passengers = ((Number)
                request.getOrDefault("passengers", 1)).intValue();

        String vehicleType =
                request.getOrDefault("vehicleType", "CAR").toString();

        boolean evPreference =
                Boolean.parseBoolean(
                        request.getOrDefault("evPreference", false).toString()
                );

        return ResponseEntity.ok(
                bookingService.recommendVehicles(
                        passengers,
                        vehicleType,
                        evPreference
                )
        );
    }

    /* ===============================
       ROUTE SUPPORT (OPTIONAL)
    =============================== */
    @GetMapping("/routes")
    public ResponseEntity<?> getAlternateRoutes(
            @RequestParam double distance
    ) {
        return ResponseEntity.ok(
                routeService.getAlternateRoutes(distance)
        );
    }

    /* ===============================
       UPDATE BOOKING STATUS
    =============================== */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        try {
            String status = body.get("status");

            if (status == null || status.isBlank()) {
                return ResponseEntity
                        .badRequest()
                        .body("Status is required");
            }

            return ResponseEntity.ok(
                    bookingService.updateStatus(
                            id,
                            status.trim().toUpperCase()
                    )
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    /* ===============================
       LEGACY / SHORTCUT ENDPOINTS
    =============================== */
    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id) {
        return updateBookingStatus(id, Map.of("status", "CONFIRMED"));
    }

    @PutMapping("/start/{id}")
    public ResponseEntity<?> startTrip(@PathVariable Long id) {
        return updateBookingStatus(id, Map.of("status", "ON_TRIP"));
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<?> completeTrip(@PathVariable Long id) {
        return updateBookingStatus(id, Map.of("status", "COMPLETED"));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        return updateBookingStatus(id, Map.of("status", "CANCELLED"));
    }
}
