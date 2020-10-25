package com.calendar.api.service;

import com.calendar.api.data.EventEntity;
import com.calendar.api.data.EventRepository;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public List<EventEntity> findByUserId(String userId) {
        return eventRepository.findByUserId(userId);
    }

    @Override
    public EventEntity findById(long eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }

    @Override
    public void save(EventEntity event) {
        eventRepository.save(event);
    }

    @Override
    public void delete(long eventId) {
        eventRepository.deleteEventEntityById(eventId);
    }
}
