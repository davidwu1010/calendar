package com.calendar.api.service;

import com.calendar.api.data.EventEntity;
import java.util.List;

public interface EventService {

    List<EventEntity> findByUserId(String userId);

    EventEntity findById(long eventId);

    void save(EventEntity event);

    void delete(long eventId);
}
