import React, { useEffect, useState } from 'react';
import './App.css';
import Calendar from './components/Calendar';
import { Switch, Route, Redirect } from 'react-router-dom';
import SignUp from './pages/sign-up/sign-up.component';
import SignIn from './pages/sign-in/sign-in.component';
import { createStructuredSelector } from 'reselect';
import { selectChecked, selectCurrentUser } from './redux/user/user.selectors';
import { connect } from 'react-redux';
import { checkUserSession } from './redux/user/user.actions';
import CssBaseline from '@material-ui/core/CssBaseline';
import SharedCalendar from './components/SharedCalendar';


function App({ currentUser, checkUserSession, checked }) {
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const [lastLocation, setLastLocation] = useState(window.location.pathname);
  return (
    <>
      <CssBaseline />
      <div className="App">
        {checked
          ?
          <Switch>
            <Route exact path="/" component={() => currentUser ? <Calendar /> : <Redirect to='/sign-in' />} />
            <Route exact path="/sign-in" render={() => currentUser ? <Redirect to={lastLocation} /> : <SignIn />} />
            <Route exact path="/sign-up" render={() => currentUser ? <Redirect to={lastLocation} /> : <SignUp />} />
            <Route exact path="/share/:shareId"
                   component={() => currentUser ? <SharedCalendar /> : <Redirect to='/sign-in' />} />
          </Switch>
          :
          <h1>Loading...</h1>
        }
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  checked: selectChecked
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
