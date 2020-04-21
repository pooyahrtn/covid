import React, { useState } from 'react';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { RecordVoiceOver, InfoOutlined } from '@material-ui/icons';

import {
  makeStyles,
  BottomNavigation,
  AppBar,
  Typography,
  Theme,
  createStyles,
  ThemeProvider,
  createMuiTheme,
  Container,
} from '@material-ui/core';
import { Main, About } from './routes';

const useStyles = makeStyles((t: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
    title: {
      flexGrow: 1,
      textAlign: 'center',
      margin: t.spacing(1),
    },
    bottomTab: {
      width: 500,
    },
    footer: {
      marginTop: 'auto',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      boxShadow: t.shadows[3],
    },
  });
});

const theme = createMuiTheme({
  direction: 'rtl',
});

function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState(1);

  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Container className={classes.root}>
        <AppBar position="fixed">
          <Typography variant="h6" className={classes.title}>
            {currentTabName(currentTabIndex)}
          </Typography>
        </AppBar>
        {currentTabIndex === 1 && <Main />}
        {currentTabIndex === 0 && <About />}
        <footer className={classes.footer}>
          <BottomNavigation
            value={currentTabIndex}
            onChange={(_, newValue) => {
              setCurrentTabIndex(newValue);
            }}
            showLabels={true}
          >
            <BottomNavigationAction
              label="درباره‌ی برنامه"
              value={0}
              icon={<InfoOutlined />}
            />
            <BottomNavigationAction
              label="ضبط"
              value={1}
              icon={<RecordVoiceOver />}
            />
          </BottomNavigation>
        </footer>
      </Container>
    </ThemeProvider>
  );
}

const currentTabName = (index: number) => {
  switch (index) {
    case 0:
      return 'درباره‌ی برنامه';
    case 1:
      return 'ضبط صدا';
    case 2:
      return 'رزرو';
  }
};

export default App;
