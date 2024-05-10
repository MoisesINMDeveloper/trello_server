export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  verified: boolean | null;
}
