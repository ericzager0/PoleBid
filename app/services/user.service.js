import * as userRepository from "../repositories/user.repository.js";

export const getMe = async (userId) => {
  const user = await userRepository.getUserById(userId);
  if (!user) throw new Error("Usuario no encontrado");
  return user;
};
