import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const provider = new GoogleAuthProvider();

export const authService = {
  // Iniciar sesión
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      
      console.log(userCredential.user);
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  googleLogin: async () => {
    return signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        throw error;
      });
  },

  // Crear cuenta nueva
  register: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: async () => {
    return await signOut(auth);
  },
};
