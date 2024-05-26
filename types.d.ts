import { User } from "./src/types/user.interface";
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
