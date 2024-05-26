export interface User {
  id: number;
  username: string;
  name: string;
  token?: string;
  email: string;
  password: string;
  verified: boolean | null;
}
