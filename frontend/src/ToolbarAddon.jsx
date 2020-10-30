import SearchField from './SearchField';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { signOutStart } from './redux/user/user.actions';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import SearchOptions from './SearchOptions';

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
  const [open, setOpen] = useState(false);
  return (
    <div className={classes.container}>
      <IconButton onClick={() => { setOpen(true); }}>
        <SearchIcon />
      </IconButton>
      <Button className={classes.button} onClick={signOut}>SIGN OUT</Button>
      <SearchOptions open={open} setOpen={setOpen} />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOutStart())
});

export default connect(null, mapDispatchToProps)(ToolbarAddon);