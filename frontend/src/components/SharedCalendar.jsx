import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import {
  useParams
} from 'react-router-dom';
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
  AppointmentForm,
  Resources
} from '@devexpress/dx-react-scheduler-material-ui';
import FabPanel from './FabPanel';
import ToolbarAddon from './ToolbarAddon';
import axios from 'axios';
import { auth } from '../firebase/firebase.utils';
import { createStructuredSelector } from 'reselect';
import { selectEvents } from '../redux/events/events.selector';
import { setEvents } from '../redux/events/events.actions';
import { connect } from 'react-redux';
import TooltipHeader from './TootipHeader';

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


const SharedCalendar = ({ events, setEvents, match }) => {
  const { shareId } = useParams();
  useEffect(() => {
      const fetchEvents = async () => {
        const token = await auth.currentUser.getIdToken(true);
        const response = await axios.get(`/api/shared/${shareId}/events/`, {
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

  return (
    <Paper style={{ height: '100vh' }}>
      <Scheduler
        data={events}
      >
        <ViewState
          defaultCurrentViewName="Week"
        />
        <EditingState
          onCommitChanges={() => {
          }}
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
          headerComponent={TooltipHeader}
        />
        <CurrentTimeIndicator />
        <AppointmentForm
          basicLayoutComponent={() => null}
          textEditorComponent={() => null}
          booleanEditorComponent={() => null}
          visible={false}
          onVisibilityChange={visible => setFormVisible(visible)}
          readOnly
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

export default connect(mapStateToProps, mapDispatchToProps)(SharedCalendar);
