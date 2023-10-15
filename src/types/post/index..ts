/* eslint-disable prettier/prettier */
export type _count = {
  like: number;
  comment: number;
  favorite: number;
};
export type User = {
  id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
}
export type Favorite ={
  id: string;
  postId: string;
  userId: string;
}
export type Like ={
  id: string;
    userId: string;
    postId: string;
    likedAt: Date
}
export type Tag = {
  id: string;
  label: string;
  value: string;

}
export type Post = {
    id: string;
    title: string;
    content: string;
    image: string | null;
    createdAt: Date;
    userId: string;
    writerInfoName: string;
    writerInfoEmail: string;
    writerInfoImage: string;
}