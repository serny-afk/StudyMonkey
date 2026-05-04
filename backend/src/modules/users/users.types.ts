export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicUser = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CharacterRecord = {
  id: string;
  userId: string;
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisteredUser = {
  user: PublicUser;
  character: CharacterRecord;
};
