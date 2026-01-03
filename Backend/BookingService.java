package com.neurofleetx.service;

import com.neurofleetx.model.Booking;
import com.neurofleetx.repository.BookingRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

   
    public Booking createBooking(Booking booking) {

       
        booking.setStatus(Booking.STATUS_CONFIRMED);
        booking.setBookingTime(LocalDateTime.now());

        if (booking.getCost() == null)
            booking.setCost(0.0);

        if (booking.getSavedAmount() == null)
            booking.setSavedAmount(0);

        return bookingRepository.save(booking);
    }

 
    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    
    @Transactional
    public Booking cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(Booking.STATUS_CANCELLED);
        return bookingRepository.save(booking);
    }
}
