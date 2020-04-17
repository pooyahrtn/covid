import React from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  Container,
  Typography,
} from '@material-ui/core';

export default () => {
  const classes = useStyles();
  return (
    <Container className={classes.contianer}>
      <Typography align="center">این قسمت در آینده تکمیل خواهد شد</Typography>
    </Container>
  );
};


const useStyles = makeStyles((t: Theme) =>
  createStyles({
    contianer: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
  })
);
