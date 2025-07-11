import { hashPassword } from './hashPassword';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('hashPassword()', () => {
  it('returns a hashed password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('fakeHash123');

    const result = await hashPassword('myPassword');

    expect(bcrypt.hash).toHaveBeenCalledWith('myPassword', 10);
    expect(result).toBe('fakeHash123');
  });
});
