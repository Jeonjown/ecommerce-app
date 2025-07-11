import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
  it('returns a valid email', () => {
    expect(validateEmail('test@email.com')).toBe(true);
  });

  it('returns not valid email', () => {
    expect(() => validateEmail('testEmail')).toThrow('Email is not valid');
  });

  it('returns not valid email when email is empty ', () => {
    expect(() => validateEmail('')).toThrow('Email is not valid');
  });
});
