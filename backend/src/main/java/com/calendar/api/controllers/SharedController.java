package com.calendar.api.controllers;

import com.calendar.api.controllers.models.SharedRequestModel;
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
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/shared")
public class SharedController {

    private final EventService eventService;

    @Autowired
    public SharedController(EventService eventService) {
        this.eventService = eventService;
    }

    // Get events of the shared calendar
    @GetMapping(value = "/{shareId}/events")
    public List<EventEntity> getEvents(@PathVariable String shareId) {
        return eventService.findByUserId(shareId);
    }

    // Book a slot
    @PostMapping(value = "/{shareId}/events/{eventId}")
    public ResponseEntity<EventEntity> bookSlot(@PathVariable String shareId,
        @PathVariable long eventId,
        @RequestBody SharedRequestModel request,
        @RequestAttribute String userId) {

        EventEntity event = eventService.findById(eventId);
        if (event == null || !event.isAppointmentSlot() || !event.getUserId().equals(shareId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        if (request != null && request.getName() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        event.getInvitees().put(userId, request.getName());
        eventService.save(event);
        return ResponseEntity.status(HttpStatus.OK).body(event);
    }

    // cancel booking
    @DeleteMapping(value = "/{shareId}/events/{eventId}")
    public ResponseEntity<EventEntity> cancelBooking(@PathVariable String shareId,
        @PathVariable long eventId,
        @RequestAttribute String userId) {

        EventEntity event = eventService.findById(eventId);
        if (event == null || !event.getUserId().equals(shareId) ||
            !event.getInvitees().containsKey(userId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        event.getInvitees().remove(userId);
        eventService.save(event);
        return ResponseEntity.status(HttpStatus.OK).body(event);
    }
}
