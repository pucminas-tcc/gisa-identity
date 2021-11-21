import * as argon2 from 'argon2';

export const hash = async (password) => {
  return argon2.hash(password);
};

export const verify = async (plain, hash) => {
  return await argon2.verify(hash, plain);
};
