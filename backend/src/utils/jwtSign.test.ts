import { jwtSign } from './jwtSign';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('jwtSign', () => {
  it('signs jwt token correctly', () => {
    process.env.JWT_SECRET = 'testsecret';

    (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

    const token = jwtSign(2);

    expect(jwt.sign).toHaveBeenCalledWith({ id: 2 }, 'testsecret', {
      expiresIn: '24h',
    });

    expect(token).toBe('mocktoken');
  });
});
