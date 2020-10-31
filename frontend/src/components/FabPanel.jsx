import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ShareIcon from '@material-ui/icons/Share';
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { auth } from '../firebase/firebase.utils';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  panel: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const ShareDialog = ({ dialogOpen, setDialogOpen }) => {
  const [shareLink, setShareLink] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const uid = auth.currentUser.uid;
    if (window.location.pathname.startsWith('/share/')) {
      setShareLink(window.location.href);
    } else {
      setShareLink(window.location.origin + '/share/' + uid);
    }
  }, []);
  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Share Calendar</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body2">Copy this link to share your calendar</Typography>
          <Grid container direction="row" alignItems="center">
            <TextField inputProps={{ spellCheck: false }} label="Link to calendar" variant="filled"
                       style={{ caretColor: 'transparent', minWidth: '400px' }} readonly value={shareLink} />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                enqueueSnackbar('Link copied.', { variant: 'success' });
              }
              }>
              Copy
            </Button>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

const FabPanel = () => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <div className={classes.panel}>
        <Fab color="inherit" variant="extended" className={classes.margin} onClick={() => setDialogOpen(true)}>
          <ShareIcon className={classes.extendedIcon} />
          Share
        </Fab>
      </div>
      <ShareDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
    </>
  );
};

export default FabPanel;