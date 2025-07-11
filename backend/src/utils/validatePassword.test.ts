import { validatePassword } from './validatePassword';

describe('validatePassword', () => {
  //length is lessthan 8
  it('returns an error when password length is < 8', () => {
    expect(() => validatePassword('short')).toThrow(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
    );
  });

  //  minLowercase: 1,
  it('returns an error when password length doesnt have lowercase', () => {
    expect(() => validatePassword('TESTPASS123!')).toThrow(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
    );
  });
  // minUppercase: 1,
  it('returns an error when password length doesnt have uppercase', () => {
    expect(() => validatePassword('testpass123!')).toThrow(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
    );
  });
  // minNumbers: 1,
  it('returns an error when password length doesnt have numbers', () => {
    expect(() => validatePassword('Testpass!')).toThrow(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
    );
  });
  // minSymbols: 1,
  it('returns an error when password length doesnt have symbol', () => {
    expect(() => validatePassword('Testpass123')).toThrow(
      'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
    );
  });
  it('returns an true on valid password', () => {
    expect(validatePassword('Testpass123!')).toBe(true);
  });
});
