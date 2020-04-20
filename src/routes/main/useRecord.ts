import { useCallback, useState, useMemo, useEffect } from 'react';
import { MicrophoneRecorder } from '../../libs/MicrophoneRecorder';

interface UseRecordConfig {
  onStopCompleted: (data: any) => void;
}
export const useRecorder = (config: UseRecordConfig) => {
  const { onStopCompleted } = config;

  const [isRecording, setIsRecording] = useState<boolean>();
  const [recordProgress, setRecordProgress] = useState(0);

  const onStop = useCallback(
    (data: any) => {
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
      onStopCompleted(data);
    },
    [onStopCompleted]
  );

  const onStart = useCallback(() => {
    // start recording
    setIsRecording(true);
    lastRecordTime = new Date();
    intervalId = setInterval(() => {
      const progress = calcProgress();
      setRecordProgress(progress);
    }, 500);
  }, []);

  const recorder = useMemo(
    () =>
      new MicrophoneRecorder(
        onStart,
        onStop,
        null,
        null,
        {
          mimeType: 'audio/wav',
        },
        {
          sampleRate: 44100,
          sampleSize: 16,
        } as MediaTrackConstraintSet
      ),
    [onStart, onStop]
  );

  const stopRecording = useCallback(() => {
    console.warn('stop prressed');
    recorder.stopRecording();
  }, [recorder]);

  const startRecording = useCallback(() => {
    recorder.startRecording();
  }, [recorder]);

  useEffect(() => {
    if (isRecording && recordProgress >= 100) {
      stopRecording();
    }
  }, [isRecording, stopRecording, recordProgress]);

  return { isRecording, recordProgress, startRecording, stopRecording };
};

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

let lastRecordTime: Date;
let intervalId: any;
const totalLength = 30;
const minimumRecordLength = 2;
