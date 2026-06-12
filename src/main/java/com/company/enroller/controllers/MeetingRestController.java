package com.company.enroller.controllers;

import com.company.enroller.model.Meeting;
import com.company.enroller.model.Participant;
import com.company.enroller.persistence.MeetingService;
import com.company.enroller.persistence.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/meetings")
public class MeetingRestController {

    @Autowired
    MeetingService meetingService;

    @Autowired
    ParticipantService participantService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ResponseEntity<?> findMeetings(@RequestParam(value = "title", defaultValue = "") String title,
                                          @RequestParam(value = "description", defaultValue = "") String description,
                                          @RequestParam(value = "sort", defaultValue = "") String sortMode,
                                          @RequestParam(value = "participantLogin", defaultValue = "") String participantLogin) {

        Participant foundParticipant = null;
        if (!participantLogin.isEmpty()) {
            foundParticipant = participantService.findByLogin(participantLogin);
        }
        Collection<Meeting> meetings = meetingService.findMeetings(title, description, foundParticipant, sortMode);
        return new ResponseEntity<Collection<Meeting>>(meetings, HttpStatus.OK);
    }

    // GET/meetings
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getMeeting(@PathVariable("id") long id) {
        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity(meeting, HttpStatus.OK);
    }

    // GET/meetings/{id}
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteMeeting(@PathVariable("id") long id) {
        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        meetingService.delete(meeting);
        return new ResponseEntity<Meeting>(meeting, HttpStatus.NO_CONTENT);
    }

    // POST/meetings
    @RequestMapping(value = "", method = RequestMethod.POST)
    public ResponseEntity<?> addMeeting(@RequestBody Meeting meeting) {

        if (meetingService.alreadyExist(meeting)) {
            return new ResponseEntity<String>("Unable to add. A meeting with title " + meeting.getTitle() + " and date "
                    + meeting.getDate() + " already exist.", HttpStatus.CONFLICT);
        }
        meetingService.add(meeting);
        return new ResponseEntity<>(meeting, HttpStatus.CREATED);
    }

    // PUT/meetings/{id}
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateMeeting(@PathVariable("id") long id, @RequestBody Meeting meeting) {
        Meeting currentMeeting = meetingService.findById(id);
        if (currentMeeting == null) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        meeting.setId(currentMeeting.getId());
        meetingService.update(meeting);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Zapisanie do spotkania
    // POST /meetings/{id}/participants - dodaje uczestnika do spotkania
    @RequestMapping(value = "/{id}/participants", method = RequestMethod.POST)
    public ResponseEntity<?> addParticipant(
            @PathVariable("id") long id,
            @RequestBody Participant participantRequest) {

        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return new ResponseEntity<>("Meeting not found", HttpStatus.NOT_FOUND);
        }
        Participant participant = participantService.findByLogin(participantRequest.getLogin());
        if (participant == null) {
            if (participant == null) {
                participant = new Participant();
                participant.setLogin(participantRequest.getLogin());
                participant.setPassword("");

                participantService.add(participant);
            }
        }
        if (meeting.getParticipants().contains(participant)) {
            return new ResponseEntity<>(
                    "Participant already registered",
                    HttpStatus.CONFLICT);
        }
        meeting.addParticipant(participant);
        meetingService.update(meeting);
        return new ResponseEntity<>(participant, HttpStatus.CREATED);
    }

    // Wypisanie ze spotkania
    // DELETE meetings/{id}/participants/{login}
    @RequestMapping(value = "/{id}/participants/{login}", method = RequestMethod.DELETE)
    public ResponseEntity<?> removeParticipant(
            @PathVariable("id") long id,
            @PathVariable("login") String login) {

        Meeting meeting = meetingService.findById(id);
        if (meeting == null) {
            return new ResponseEntity<>("Meeting not found", HttpStatus.NOT_FOUND);
        }

        Participant participant = participantService.findByLogin(login);
        if (participant == null) {
            return new ResponseEntity<>("Participant not found", HttpStatus.NOT_FOUND);
        }

        if (!meeting.getParticipants().contains(participant)) {
            return new ResponseEntity<>("Participant not registered in meeting", HttpStatus.CONFLICT);
        }
        meeting.removeParticipant(participant);
        meetingService.update(meeting);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}