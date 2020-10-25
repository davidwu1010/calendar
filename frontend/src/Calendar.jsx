import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
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
} from '@devexpress/dx-react-scheduler-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import SearchField from './SearchField';
import FabPanel from './FabPanel';
import ToolbarAddon from './ToolbarAddon';
import axios from 'axios';
import { auth } from './firebase/firebase.utils';


const schedulerData = [
  { startDate: '2020-10-20T19:45', endDate: '2020-10-20T21:00', title: 'Meeting', id: 1233 },
];


const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onCustomFieldChange = (nextValue) => {
    onFieldChange({ appointmentSlot: nextValue });
    setAppointmentSlot(nextValue);
  };

  const [appointmentSlot, setAppointmentSlot] = useState(false);

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <Grid container direction="row">
        <AppointmentForm.BooleanEditor value={appointmentSlot} label="Appointment slots"
                                       onValueChange={onCustomFieldChange} />
      </Grid>
    </AppointmentForm.BasicLayout>
  );
};

const Calendar = () => {
  useEffect(() => {
      const fetchEvents = async () => {
        const token = await auth.currentUser.getIdToken(true);
        const response = await axios.get('/api/events/', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        setEvents(response.data);
      };
      fetchEvents();
    }
    , []);

  const [formVisible, setFormVisible] = useState(false);
  const [events, setEvents] = useState([]);

  const changesHandler = async change => {
    const { added, changed, deleted } = change;
    const token = await auth.currentUser.getIdToken(true);
    const headers = {
      Authorization: 'Bearer ' + token
    };

    console.log(change);
    if (added) {
      try {
        const response = await axios.post('/api/events/',
          added,
          {
            headers: headers
          });
        setEvents([...events, response.data]);
      } catch (e) {
        console.error(e);
      }
    }
    if (changed) {
    }
    if (deleted !== undefined) {
      try {
        await axios.delete('/api/events/' + deleted, {
          headers: headers
        });
        setEvents(events.filter(event => event.id !== deleted));
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
        <Appointments />
        <AppointmentTooltip
          showOpenButton
          showCloseButton
          showDeleteButton
        />
        <CurrentTimeIndicator />
        <AppointmentForm
          basicLayoutComponent={BasicLayout}
          textEditorComponent={TextEditor}
          booleanEditorComponent={() => null}
          visible={formVisible}
          onVisibilityChange={visible => setFormVisible(visible)}
        />
      </Scheduler>
      <FabPanel onCreate={() => setFormVisible(true)} />
    </Paper>
  );
};

export default Calendar;