import * as loginRepository from "./login.repository.js"; 

import { User } from "./domain/classes/User.js";
import * as authRepository from "./auth.repository.js";

export function login(email) {
  const existing = authRepository.findByEmail(email);
  if (existing) {
    return existing;
  }
  const user = User.create(username);
  return authRepository.save(user.toJSON());
}