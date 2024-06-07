type User = {
  id: string;
  objectId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
};

type UpdateUserParams = {
  userId: string;
  bio: string;
  name: string;
  username: string;
  image: string;
  path:string
};
export type { User, UpdateUserParams };
