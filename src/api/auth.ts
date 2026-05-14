import api from "./axios";
import type { ILogin } from "../interfaces/ILogin";
import type { IRegister } from "../interfaces/IRegister";
import type { IAuth } from "../interfaces/IAuth";

export interface LoginResponse {
  ok: boolean;
  token: string;
  user: IAuth;
}

export interface RegisterResponse {
  ok: boolean;
  user: IAuth;
}

export const loginUser = async (credentials: ILogin): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/api/auth/login", credentials);
  return data;
};

export const registerUser = async (form: IRegister): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>("/api/auth/register", form);
  return data;
};
