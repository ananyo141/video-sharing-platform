import axios from 'axios';

const uploadVideo = async (data:any, file: File) => {
    const serverURL = "https://videosite.ddns.net/bucket";
    const url = data.createVideo.presignedUrl;

  const config = {
    headers: {
        'Content-Type': 'application/octet-stream',

    }
  };
  const presignedUrl = `${serverURL}${url}`;

  return axios.put(presignedUrl, file, config);
};

export default uploadVideo;



