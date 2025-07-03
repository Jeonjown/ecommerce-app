import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = 10;
  const hashed = await bcrypt.hash(password, salt);

  return hashed;
};
