import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogActions, Button, Grid, TextField } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { DataGrid } from '@material-ui/data-grid';
import { createStructuredSelector } from 'reselect';
import { selectEvents } from './redux/events/events.selector';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';


const SearchResult = ({ open, handleClose, events }) => {
  dayjs.extend(LocalizedFormat);
  const columns = [
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 200,
      valueGetter: params => dayjs(params.getValue('startDate')).format('lll')
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 200,
      valueGetter: params => dayjs(params.getValue('endDate')).format('lll')
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle>Search Results</DialogTitle>
      <DialogContent dividers>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid rows={events} columns={columns} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SearchOptions = ({ open, setOpen, events }) => {

  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleSelectStartDate = date => {
    setStartDate(date);
    if (endDate === null || date > endDate) {
      setEndDate(date);
    }
  };

  const handleSelectEndDate = date => {
    setEndDate(date);
    if (startDate === null || date < startDate) {
      setStartDate(date);
    }
  };

  const reset = () => {
    setStartDate(null);
    setEndDate(null);
    setKeyword('');
  };

  const handleSearch = () => {
    if (keyword === '' && startDate === null && endDate === null) {
      return;
    }
    let results = events;
    if (keyword !== '') {
      results = results.filter(event => event.title.includes(keyword));
    }
    if (startDate !== null) {
      results = results.filter(event => event.startDate === undefined || event.startDate.split('T')[0] >= startDate.format('YYYY-MM-DD'));
    }

    if (endDate !== null) {
      results = results.filter(event => event.endDate === undefined || event.endDate.split('T')[0] <= endDate.format('YYYY-MM-DD'));
    }

    setFilteredEvents(results);
    handleClose();
    setResultOpen(true);
    console.log(results);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Search Events</DialogTitle>
        <DialogContent dividers>
          <Grid container alignItems="center" spacing={2} style={{ paddingRight: '80px' }}>
            <Grid item xs={3}>
              <Typography>Keyword</Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField value={keyword} onChange={event => setKeyword(event.target.value)} fullWidth
                         variant="filled"
                         label="Keyword in title" />
            </Grid>
            <Grid item xs={3}>
              <Typography>Date</Typography>
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                autoOk
                value={startDate}
                onChange={handleSelectStartDate}
                variant="inline"
                emptyLabel="From date"
                inputVariant="filled"
              />
            </Grid>
            <Grid item xs={1}>
              <Typography align="center">to</Typography>
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                autoOk
                value={endDate}
                onChange={handleSelectEndDate}
                variant="inline"
                emptyLabel="To date"
                inputVariant="filled"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={reset}>
            Reset
          </Button>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </DialogActions>
      </Dialog>
      <SearchResult events={filteredEvents} open={resultOpen} handleClose={() => setResultOpen(false)} />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  events: selectEvents
});

export default connect(mapStateToProps)(SearchOptions);
