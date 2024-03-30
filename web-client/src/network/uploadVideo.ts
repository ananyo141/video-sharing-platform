import axios from 'axios';



const uploadVideo = (data:any, file: File) => {

    const serverURL = "https://videosite.ddns.net/bucket";
    const url = data.createVideo.presignedUrl;

  const config = {
    headers: {
        'Content-Type': 'application/octet-stream', 
        'Host': 'video-bucket:9000' 
    }
  };
  const presignedUrl = `${serverURL}${url}`;

  return axios.put(presignedUrl, file, config);
};

export default uploadVideo;
