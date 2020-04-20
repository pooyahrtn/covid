import React, { useState } from 'react';
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
  Button,
} from '@material-ui/core';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import { MicNone } from '@material-ui/icons';
import SendModal from './SendModal';
import { useRecorder } from './useRecord';

import 'react-circular-progressbar/dist/styles.css';
import { useSendFile } from './useSendFile';

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
      aspectRatio: '1',
      transition: 'all 1s',
      marginTop: t.spacing(6),
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
    sentOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
  })
);

type Disease =
  | 'covid19_sickness'
  | 'covid19_suspicious'
  | 'another_sickness'
  | 'healthy';
type Mode = 'disease' | 'gender' | 'smoking' | 'record';
type Gender = 'male' | 'female';
type Smoking = 'smoker' | 'non_smoker';

export default () => {
  const classes = useStyles();
  const [disease, setDisease] = useState<Disease>();
  const [sound, setSound] = useState();
  const [openSendModal, setOpenSendModal] = useState(false);
  const [mode, setMode] = useState<Mode>('disease');
  const [gender, setGender] = useState<Gender>();
  const [smoking, setSmoking] = useState<Smoking>();
  const [loadingSend, setLoadingSend] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as any).value;
    if (mode === 'disease') {
      setDisease(value);
      setMode('gender');
    } else if (mode === 'gender') {
      setGender(value);
      setMode('smoking');
    } else if (mode === 'smoking') {
      setSmoking(value);
      setMode('record');
    }
  };

  const {
    isRecording,
    startRecording,
    stopRecording,
    recordProgress,
  } = useRecorder({
    onStopCompleted: (data) => {
      setOpenSendModal(true);
      setSound(data);
    },
  });

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

  const { requestSend } = useSendFile();

  const onSendPressed = () => {
    setLoadingSend(true);
    requestSend(sound, createFileName({ disease, smoking, gender })).then(
      (res) => {
        setLoadingSend(false);
        setSent(true);
      }
    );
  };
  const onRestartPressed = () => {
    setDisease(undefined);
    setGender(undefined);
    setSmoking(undefined);
    setSent(false);
    setLoadingSend(false);
    setSound(undefined);
    setOpenSendModal(false);
    setMode('disease');
  };

  return (
    <Container className={classes.contianer}>
      <SendModal
        open={openSendModal}
        handleClose={closeSendModal}
        data={sound}
        onSendPressed={onSendPressed}
        loading={loadingSend}
      />
      {sent && (
        <div className={classes.sentOverlay}>
          با تشکر از شما، صدای ضبط شده ارسال شد.
          <Button
            variant="contained"
            onClick={onRestartPressed}
            color="primary"
          >
            شروع مجدد
          </Button>
        </div>
      )}
      <Typography variant="body1" color="primary">
        با ضبط و ارسال صدای سرفه‌ی خود یا دیگران میتوانید به تحقیقات در جهت
        تخشیص سریع‌تر بیماری Covid-19 کمک نمایید.
      </Typography>
      {mode === 'disease' && (
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
              value="covid19_sickness"
              control={<Radio />}
              label="تشخیص قطعی COVID-19"
            />
            <FormControlLabel
              value="covid19_suspicious"
              control={<Radio />}
              label="مشکوک به COVID-19"
            />
            <FormControlLabel
              value="another_sickness"
              control={<Radio />}
              label="بیماری های دیگر"
            />

            <FormControlLabel
              value="healthy"
              control={<Radio />}
              label="سالم"
            />
          </RadioGroup>
        </FormControl>
      )}
      {mode === 'gender' && (
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">لطفا جنسیت خود را مشخص کنید</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={gender}
            onChange={handleChange}
            className={classes.radioGroup}
          >
            <FormControlLabel value="male" control={<Radio />} label="مرد" />
            <FormControlLabel value="female" control={<Radio />} label="زن" />
          </RadioGroup>
        </FormControl>
      )}
      {mode === 'smoking' && (
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">
            آیا سابقه‌ی مصرف سیگار دارید؟
          </FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={smoking}
            onChange={handleChange}
            className={classes.radioGroup}
          >
            <FormControlLabel value="smoker" control={<Radio />} label="بله" />
            <FormControlLabel
              value="non_smoker"
              control={<Radio />}
              label="خیر"
            />
          </RadioGroup>
        </FormControl>
      )}

      {mode === 'record' && (
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

const createFileName = (data: {
  disease: Disease;
  smoking: Smoking;
  gender: Gender;
}) => {
  const { smoking, disease, gender } = data;
  return `cough_$${gender}_${smoking}_${disease}_${new Date().getTime()}_web.wav`;
};
