package com.neurofleetx.repository;

import com.neurofleetx.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    
    List<Booking> findByCustomerId(Long customerId);

    
    List<Booking> findByCustomerIdAndStatusIgnoreCase(
            Long customerId,
            String status
    );

  

    boolean existsByVehicleIdAndStatusIgnoreCase(
            Long vehicleId,
            String status
    );

    
    List<Booking> findByBookingTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );

   
    List<Booking> findByStatusIgnoreCase(String status);

    
    long countByBookingTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );

  
    List<Booking> findByStatusIgnoreCaseAndStartTimeIsNotNullAndEndTimeIsNull(
            String status
    );
}
