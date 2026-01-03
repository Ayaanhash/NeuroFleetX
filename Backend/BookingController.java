package com.neurofleetx.controller;

import com.neurofleetx.model.Booking;
import com.neurofleetx.service.BookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

   
    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking
    ) {
        return ResponseEntity.ok(
                bookingService.createBooking(booking)
        );
    }

   
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(
            @PathVariable Long customerId
    ) {
        return ResponseEntity.ok(
                bookingService.getBookingsByCustomer(customerId)
        );
    }

   
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                bookingService.cancelBooking(id)
        );
    }
}
