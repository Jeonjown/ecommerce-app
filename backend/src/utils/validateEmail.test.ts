import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
  it('returns a valid email', () => {
    expect(validateEmail('test@email.com')).toBe(true);
  });

  it('returns not valid email', () => {
    expect(() => validateEmail('testEmail')).toThrow(
      'Please enter a valid email.'
    );
  });

  it('returns not valid email when email is empty ', () => {
    expect(() => validateEmail('')).toThrow('Please enter a valid email.');
  });
});
