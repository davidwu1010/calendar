package com.calendar.api.service;

import com.calendar.api.data.EventEntity;
import com.calendar.api.data.EventRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly=true)
    @Override
    public List<EventEntity> findByUserId(String userId) {
        return eventRepository.findByUserId(userId);
    }

    @Transactional(readOnly=true)
    @Override
    public EventEntity findById(long eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }

    @Transactional
    @Override
    public void save(EventEntity event) {
        eventRepository.save(event);
    }

    @Transactional
    @Override
    public void delete(long eventId) {
        eventRepository.deleteEventEntityById(eventId);
    }
}
