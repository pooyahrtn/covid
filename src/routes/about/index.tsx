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
      <div className={classes.imageHeader}>
        <img
          src={`${process.env.PUBLIC_URL}/robotic.png`}
          alt="robotic"
          className={classes.logoImage}
        />
        <img
          src={`${process.env.PUBLIC_URL}/tehran.png`}
          alt="tehran"
          className={classes.logoImage}
        />
      </div>
      <Typography align="center">
        این برنامه توسط تیم تحقیقاتی ما در آزمایشگاه ربات و هوش مصنوعی دانشگاه
        تهران، به منظور انجام تحقیقات برای غربالگری بیماران مشکوک و یا مبتلا به
        بیماری COVID-19 طراحی شده است.
      </Typography>
    </Container>
  );
};

const LOGO_SIZE = 10;
const useStyles = makeStyles((t: Theme) =>
  createStyles({
    contianer: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    imageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: t.spacing(4),
    },
    logoImage: {
      width: t.spacing(LOGO_SIZE),
      height: 'auto',
    },
  })
);
