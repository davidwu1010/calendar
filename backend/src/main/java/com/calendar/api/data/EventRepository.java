package com.calendar.api.data;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<EventEntity, Long> {
    List<EventEntity> findByUserId(String userId);
    void deleteEventEntityById(long eventId);
}
