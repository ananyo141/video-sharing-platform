export default interface Video {
  _id: string;
  title: string;
  thumbnailUrl: string;
  userId: number;
  likes: any[];
  comments: any[];
  createdAt: string;
  description: string;
  source: string;
  transcodedUrl: string;
  updatedAt: string;
  user: {
    email: string;
  };
}
