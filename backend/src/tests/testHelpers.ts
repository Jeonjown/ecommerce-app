import { hashPassword } from '../utils/hashPassword';
import { validateEmail } from '../utils/validateEmail';
import { validatePassword } from '../utils/validatePassword';

(async () => {
  try {
    const email = 'test@example.com';
    const password = 'StrongPass123!';

    console.log('validating email...');
    console.log(validateEmail(email));

    console.log('validating password...');
    console.log(validatePassword(password));

    console.log('hashing password...');
    console.log(await hashPassword(password));

    console.log('All validations passed.');
  } catch (err) {
    console.error(err);
  }
})();
