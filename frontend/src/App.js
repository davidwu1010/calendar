import React, { useEffect } from 'react';
import './App.css';
import Calendar from './Calendar';
import { Switch, Route, Redirect } from 'react-router-dom';
import SignUp from './pages/sign-up/sign-up.component';
import SignIn from './pages/sign-in/sign-in.component';
import { createStructuredSelector } from 'reselect';
import { selectChecked, selectCurrentUser } from './redux/user/user.selectors';
import { connect } from 'react-redux';
import { checkUserSession } from './redux/user/user.actions';
import CssBaseline from '@material-ui/core/CssBaseline';
import SharedCalendar from './SharedCalendar';


function App({ currentUser, checkUserSession, checked }) {
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  return (
    <>
      <CssBaseline />
      <div className="App">
        {checked
          ?
          <Switch>
            <Route exact path="/" component={() => currentUser ? <Calendar /> : <Redirect to='/sign-in' />} />
            <Route exact path="/sign-in" render={() => currentUser ? <Redirect to='/' /> : <SignIn />} />
            <Route exact path="/sign-up" render={() => currentUser ? <Redirect to='/' /> : <SignUp />} />
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
