import { Response } from 'express';

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('authToken', token, {
    httpOnly: true, // prevents JS access
    secure: process.env.NODE_ENV === 'production', // only HTTPS in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // <--- important
  });
};

export default setTokenCookie;
