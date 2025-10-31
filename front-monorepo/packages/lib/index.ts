import { jwtDecode } from 'jwt-decode';

export const decodificarJWT = (token: string): void => {
  const decoded = jwtDecode(token);
  localStorage.setItem("idUsuario", decoded.user_id);
};