// import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';

  // Cookieにtokenが存在していれば、ログイン中とみなす
const isLoggedIn = (): boolean => {
  const token = Cookie.get('auth-token');
  console.log("token=", token, "\n")
  return !!token;
};

export default isLoggedIn;

// topkenを複合化する。可能であればフロントでやりたくない。
// export async function validateTokenCookie(headers) {
//   const token = headers.cookie?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

//   if (!token) return false;

//   try {
//     const decoded = jwt.verify(token, "h/M9Rb1Hqo+W9MynC/+ilH2CSUi3D7s0T3vV2WWyrl0=");
//     return Boolean(decoded && decoded.user_id);
//   } catch (error) {
//     return false;
//   }
// }