import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { useLocation } from 'react-router-dom';
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  ViewSwitcher,
  DayView,
  MonthView,
  AppointmentTooltip,
  CurrentTimeIndicator,
  AppointmentForm, Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import FabPanel from './FabPanel';
import ToolbarAddon from './ToolbarAddon';
import axios from 'axios';
import { auth } from '../firebase/firebase.utils';
import { createStructuredSelector } from 'reselect';
import { selectEvents } from '../redux/events/events.selector';
import { setEvents } from '../redux/events/events.actions';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';


const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const location = useLocation();
  const onCustomFieldChange = (nextValue) => {
    onFieldChange({ appointmentSlot: nextValue });
    setAppointmentSlot(nextValue);
  };

  const [appointmentSlot, setAppointmentSlot] = useState(appointmentData.appointmentSlot);
  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <Grid container direction="row">
        <AppointmentForm.BooleanEditor value={appointmentSlot} label="Appointment slots"
                                       onValueChange={onCustomFieldChange}
                                       readOnly={location.pathname.startsWith('/share/')} />
      </Grid>
    </AppointmentForm.BasicLayout>
  );
};

const Appointment = ({ children, style, data, ...restProps }) => (
  <Appointments.Appointment
    data={data}
    style={{
      backgroundColor: data.appointmentSlot ? '#FFC108' : '#64b5f6'
    }}
    {...restProps}>
    {children}
  </Appointments.Appointment>
);

const Label = props => {
  if (props.text === 'Members') {
    return null;
  }
  return <AppointmentForm.Label {...props} />;
};

const Calendar = ({ events, setEvents, share }) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
      const fetchEvents = async () => {
        const token = await auth.currentUser.getIdToken(true);
        const response = await axios.get('/api/events/', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        const events = response.data;
        for (const event of events) {
          Object.defineProperty(event, 'members', {
            get: function () {
              return Object.keys(this.invitees);
            }
          });
        }
        setEvents(events);
      };
      fetchEvents();
    }
    , []);


  const [formVisible, setFormVisible] = useState(false);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const resources = [{
      fieldName: 'members',
      title: 'Members',
      allowMultiple: true
    }];

    const instancesMap = new Map();
    for (const event of events) {
      for (const member of event.members) {
        instancesMap.set(member, event.invitees[member]);
      }
    }

    const instances = [];
    for (const key of instancesMap.keys()) {
      instances.push({
        id: key,
        text: instancesMap.get(key)
      });
    }
    resources[0].instances = instances;
    setResources(resources);
  }, [events]);

  const changesHandler = async change => {
    const { added, changed, deleted } = change;
    const token = await auth.currentUser.getIdToken(true);
    const headers = {
      Authorization: 'Bearer ' + token
    };

    if (added) {
      if (Date.parse(added.startDate) >= Date.parse(added.endDate)) {
        alert('End date must be after start date');
        return;
      }

      if (!added.title) {
        alert('Title cannot be empty');
        return;
      }

      console.log(added);
      if (!added.startDate || added.startDate.toString() === 'Invalid Date') {
        alert('Illegal start date');
        return;
      }

      if (!added.endDate || added.endDate.toString() === 'Invalid Date') {
        alert('Illegal end date');
        return;
      }

      try {
        const response = await axios.post('/api/events/',
          added,
          {
            headers: headers
          });
        const addedEvent = response.data;
        Object.defineProperty(addedEvent, 'members', {
          get: function () {
            return Object.keys(this.invitees);
          }
        });
        setEvents([...events, addedEvent]);
        enqueueSnackbar('Event added.', {
          variant: 'success'
        });
      } catch (e) {
        console.error(e);
      }
    }
    if (changed) {
      const id = parseInt(Object.keys(changed)[0]);
      const updatedEvent = { ...events.find(event => event.id === id), ...changed[id] };
      if (Date.parse(updatedEvent.startDate) >= Date.parse(updatedEvent.endDate)) {
        alert('End date must be after start date');
        return;
      }
      try {
        const response = await axios.put('/api/events/', updatedEvent, {
          headers: headers
        });
        const changedEvent = response.data;
        Object.defineProperty(changedEvent, 'members', {
          get: function () {
            return Object.keys(this.invitees);
          }
        });
        setEvents(events.map(event => event.id === changedEvent.id ? changedEvent : event));
        enqueueSnackbar('Event updated.', {
          variant: 'success'
        });
      } catch (e) {
        console.error(e);
      }
    }
    if (deleted !== undefined) {
      try {
        await axios.delete('/api/events/' + deleted, {
          headers: headers
        });
        setEvents(events.filter(event => event.id !== deleted));
        enqueueSnackbar('Event deleted.', {
          variant: 'success'
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <Paper style={{ height: '100vh' }}>
      <Scheduler
        data={events}
      >
        <ViewState
          defaultCurrentViewName="Week"
        />
        <EditingState
          onCommitChanges={changesHandler}
        />
        <IntegratedEditing />
        <DayView
          cellDuration={60}
        />
        <WeekView
          cellDuration={60}
        />
        <MonthView />

        <Toolbar
          flexibleSpaceComponent={ToolbarAddon}
        />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <Appointments
          appointmentComponent={Appointment}
        />
        <AppointmentTooltip
          showOpenButton={!share}
          showCloseButton
          showDeleteButton={!share}
        />
        <CurrentTimeIndicator />
        <AppointmentForm
          basicLayoutComponent={BasicLayout}
          textEditorComponent={TextEditor}
          booleanEditorComponent={() => null}
          resourceEditorComponent={() => null}
          labelComponent={Label}
          visible={!share && formVisible}
          onVisibilityChange={visible => setFormVisible(visible)}
          readOnly={share}
        />
        <Resources
          data={resources}
          mainResourceName="members"
        />
      </Scheduler>

      <FabPanel onCreate={() => setFormVisible(true)} />
    </Paper>
  );
};

const mapStateToProps = createStructuredSelector({
  events: selectEvents
});

const mapDispatchToProps = dispatch => ({
  setEvents: events => dispatch(setEvents(events))
});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
