package com.calendar.api.data;

import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="events")
public class EventEntity {

    @Id
    @GeneratedValue
    private long id;
    @Column(nullable=false)
    private String userId;
    @Column(nullable=false)
    private Date startDate;
    @Column
    private Date endDate;
    @Column
    private String title;
    @Column
    private boolean appointmentSlot;
    @ElementCollection
    private List<String> invitees;

    public long getId() {
        return id;
    }

    public void setId(long eventId) {
        this.id = eventId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isAppointmentSlot() {
        return appointmentSlot;
    }

    public void setAppointmentSlot(boolean appointmentSlot) {
        this.appointmentSlot = appointmentSlot;
    }

    public List<String> getInvitees() {
        return invitees;
    }

    public void setInvitees(List<String> invitees) {
        this.invitees = invitees;
    }
}
