import { useParams } from 'react-router-dom';
import { auth } from '../firebase/firebase.utils';
import axios from 'axios';
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui';
import Button from '@material-ui/core/Button';
import * as React from 'react';
import { createStructuredSelector } from 'reselect';
import { selectEvents } from '../redux/events/events.selector';
import { selectDisplayName, selectUid } from '../redux/user/user.selectors';
import { connect } from 'react-redux';
import { setEvents } from '../redux/events/events.actions';
import { useReducer, useState } from 'react';
import { useSnackbar } from 'notistack';

const TooltipHeader = ({ uid, events, setEvents, displayName, appointmentData, children, showCloseButton, ...restProps }) => {
  const { shareId } = useParams();
  const [booked, setBooked] = useState(appointmentData.invitees[uid] !== undefined);
  const { enqueueSnackbar } = useSnackbar();


  const bookHandler = async () => {
    const token = await auth.currentUser.getIdToken(true);
    const headers = {
      Authorization: 'Bearer ' + token
    };
    try {
      const response = await axios.post(`/api/shared/${shareId}/events/${appointmentData.id}`, {
          name: displayName
        }, {
          headers: headers
        }
      );
      const updateEvent = response.data;
      Object.defineProperty(updateEvent, 'members', {
        get: function () {
          return Object.keys(this.invitees);
        }
      });
      setEvents(events.map(event => event.id === updateEvent.id ? updateEvent : event));
      setBooked(true);
      enqueueSnackbar('Slot booked', { variant: 'success' });
    } catch (e) {
      alert(e);
    }

  };

  const cancelHandler = async () => {
    const token = await auth.currentUser.getIdToken(true);
    const headers = {
      Authorization: 'Bearer ' + token
    };

    try {
      const response = await axios.delete(`/api/shared/${shareId}/events/${appointmentData.id}`, {
          headers: headers
        }
      );
      const updateEvent = response.data;
      Object.defineProperty(updateEvent, 'members', {
        get: function () {
          return Object.keys(this.invitees);
        }
      });
      setEvents(events.map(event => event.id === response.data.id ? updateEvent : event));
      enqueueSnackbar('Slot canceled', { variant: 'success' });
      setBooked(false);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <AppointmentTooltip.Header
      showCloseButton
      appointmentData={appointmentData}
      {...restProps}
    >
      {
        appointmentData.appointmentSlot
          ?
          booked
            ?
            <Button
              size="small"
              color="primary"
              variant="contained"
              style={{ margin: 6 }}
              onClick={cancelHandler}
            >
              Cancel
            </Button>
            :
            <Button
              size="small"
              color="primary"
              variant="contained"
              style={{ margin: 6 }}
              onClick={bookHandler}
            >
              Book
            </Button>
          :
          null
      }
    </AppointmentTooltip.Header>
  );
};

const mapStateToProps = createStructuredSelector({
  displayName: selectDisplayName,
  events: selectEvents,
  uid: selectUid
});

const mapDispatchToProps = dispatch => ({
  setEvents: events => dispatch(setEvents(events))
});

export default connect(mapStateToProps, mapDispatchToProps)(TooltipHeader);