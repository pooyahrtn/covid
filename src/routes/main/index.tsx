import React, { useState, useEffect } from 'react';
import {
  Container,
  makeStyles,
  createStyles,
  Theme,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import { MicNone } from '@material-ui/icons';
import SendModal from './SendModal';

import 'react-circular-progressbar/dist/styles.css';

const useStyles = makeStyles((t: Theme) =>
  createStyles({
    contianer: {
      flexGrow: 1,
      marginTop: t.spacing(10),
    },
    radioGroup: {
      marginTop: t.spacing(2),
    },
    recordContainer: {
      width: t.spacing(16),
      marginTop: t.spacing(2),
      aspectRatio: '1',
      transition: 'all 1s',
    },
    recordContainerRecording: {
      transform: 'scale(1.2)',
    },
    recordButton: {
      width: '80%',
      height: '80%',
      backgroundColor: 'red',
      borderRadius: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      color: 'white',
    },
  })
);

type Disease = 'confirmed' | 'suspected' | 'other' | 'healthy';

let lastRecordTime: Date;
let intervalId: any;
const totalLength = 5;
const minimumRecordLength = 1;

const calcProgress = () => {
  const now = new Date();
  const passedSeconds = (now.getTime() - lastRecordTime.getTime()) / 1000;
  return (passedSeconds / totalLength) * 100;
};

const isRecordAcceptable = () => {
  const now = new Date();
  return (
    (now.getTime() - lastRecordTime.getTime()) / 1000 > minimumRecordLength
  );
};

export default () => {
  const classes = useStyles();
  const [disease, setDisease] = useState<Disease>();
  const [recordProgress, setRecordProgress] = useState(0);
  const [openSendModal, setOpenSendModal] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisease((event.target as any).value);
  };

  const [isRecording, setIsRecording] = useState<boolean>();

  const stopRecording = () => {
    // time to stop recording
    // reset recording
    setIsRecording(false);
    setRecordProgress(0);
    clearInterval(intervalId);
    if (!isRecordAcceptable()) {
      // record is too short
      alert('مدت ضبط صدا کوتاه است، لطفا مجددا تلاش کنید');
      return;
    }
    // record is acceptable:
    setOpenSendModal(true);
  };

  const startRecording = () => {
    // start recording
    lastRecordTime = new Date();
    setIsRecording(true);
    intervalId = setInterval(() => {
      const progress = calcProgress();
      if (progress >= 100) {
        return stopRecording();
      }
      setRecordProgress(progress);
    }, 500);
  };

  const onRecordPressed = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const closeSendModal = () => {
    setOpenSendModal(false);
  };

  return (
    <Container className={classes.contianer}>
      <SendModal open={openSendModal} handleClose={closeSendModal} />
      <Typography variant="body1" color="primary">
        با ضبط و ارسال صدای سرفه‌ی خود یا دیگران میتوانید به تحقیقات در جهت
        تخشیص سریع‌تر بیماری Covid-19 کمک نمایید.
      </Typography>
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">لطفا وضعیت خود را مشخص کنید</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={disease}
          onChange={handleChange}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value="confirmed"
            control={<Radio />}
            label="تشخیص قطعی COVID-19"
          />
          <FormControlLabel
            value="suspected"
            control={<Radio />}
            label="مشکوک به COVID-19"
          />
          <FormControlLabel
            value="other"
            control={<Radio />}
            label="بیماری های دیگر"
          />

          <FormControlLabel value="healthy" control={<Radio />} label="سالم" />
        </RadioGroup>
      </FormControl>
      {disease && (
        <RecordButton
          className={classes.recordContainer}
          onPress={onRecordPressed}
          progress={recordProgress}
          isRecording={isRecording ?? false}
        />
      )}
    </Container>
  );
};

interface RecordButtonProps {
  className: string;
  onPress: () => void;
  progress: number;
  isRecording: boolean;
}
const RecordButton: React.FC<RecordButtonProps> = (props) => {
  const { className, onPress, progress, isRecording } = props;
  const classes = useStyles();
  return (
    <Container
      className={`${className} ${
        isRecording ? classes.recordContainerRecording : ''
        }`}
    >
      <CircularProgressbarWithChildren
        value={progress}
        strokeWidth={5}
        styles={buildStyles({
          // How long animation takes to go from one percentage to another, in seconds
          pathTransitionDuration: 0.5,
          trailColor: '#d6d6d6',
          backgroundColor: '#3e98c7',
        })}
      >
        {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
        <div className={classes.recordButton} onClick={onPress}>
          <MicNone fontSize="large" />
        </div>
      </CircularProgressbarWithChildren>
    </Container>
  );
};
