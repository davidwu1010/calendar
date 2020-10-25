package com.calendar.api.controllers;

import com.calendar.api.data.EventEntity;
import com.calendar.api.service.EventService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<EventEntity> createEvent(@RequestBody EventEntity event,
        @RequestAttribute String userId) {
        event.setUserId(userId);
        eventService.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @GetMapping
    public List<EventEntity> getEvents(@RequestAttribute String userId) {
        return eventService.findByUserId(userId);
    }

    @PutMapping
    public ResponseEntity<Object> updateEvent(@RequestBody EventEntity event,
        @RequestAttribute String userId) {
        if (event.getUserId().equals(userId)) {
            eventService.save(event);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping(value="/{eventId}")
    public ResponseEntity<Object> deleteEvent(@PathVariable long eventId,
        @RequestAttribute String userId) {
        EventEntity event = eventService.findById(eventId);
        if (event != null && event.getUserId().equals(userId)) {
            eventService.delete(event.getId());
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
