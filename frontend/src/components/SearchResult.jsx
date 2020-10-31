import { Dialog, DialogContent, DialogTitle, List, ListItem } from '@material-ui/core';
import React from 'react';

const SearchResult = () => {
  return (
    <Dialog scroll="paper">
      <DialogTitle></DialogTitle>
      <DialogContent dividers>
        <List>
          <ListItem></ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default SearchResult;