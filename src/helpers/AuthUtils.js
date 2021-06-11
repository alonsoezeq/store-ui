
const getTokenPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) {return null;}
  let base64payload = token.split('.')[1];
  let payload = base64payload.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(payload));
}

export const isAuthenticated = () => {
  return !!getTokenPayload();
}

export const isAdmin = () => {
  return getTokenPayload()?.role === 'admin';
}

export const isSeller = () => {
  return getTokenPayload()?.role === 'seller';
}

export const isBuyer = () => {
  return getTokenPayload()?.role === 'buyer';
}

export const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? {'Authorization': `Bearer ${token}`} : {};
}

export const logout = () => {
  localStorage.removeItem('token');
  if (window.location.href === '/') {
    window.history.go(0);
  } else {
    window.location.href = '/';
  }
}