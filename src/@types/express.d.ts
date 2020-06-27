declare namespace Express {
  export interface Request {
    currentUser?: { isAdmin: boolean; name: string; id: number; email: string };
  }
}
