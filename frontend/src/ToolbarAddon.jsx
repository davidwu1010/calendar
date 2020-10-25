import SearchField from './SearchField';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { signOutStart } from './redux/user/user.actions';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginRight: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(2),
  }
}));

const ToolbarAddon = ({ signOut }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <SearchField/>
      <Button className={classes.button} onClick={signOut}>SIGN OUT</Button>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOutStart())
});

export default connect(null, mapDispatchToProps)(ToolbarAddon);