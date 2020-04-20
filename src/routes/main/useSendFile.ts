import axios from 'axios';
import { useState } from 'react';

export const useSendFile = () => {
  const [loading, setLoading] = useState(false);
  const requestSend = (audio: any, fileName: string) => {
    setLoading(true);
    const data = new FormData();
    data.append('uploadedfile', audio.blob, fileName);

    return axios.post('/autism-android/New/upload.php?id=10005533', data, {
      headers: {
        'content-type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    });
  };
  return { requestSend, loading };
};
