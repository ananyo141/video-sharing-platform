export default interface Video {
  _id: string;
  comments: any[];
  createdAt: string;
  description: string;
  likes: any[];
  source: string;
  title: string;
  transcodedUrl: string;
  updatedAt: string;
  user: {
    email: string;
  };
  userId: number;
}
