import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor() { }

  async register({ email, password }: { email: string; password: string}){
    try{
      const credentials= await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const ref = doc(this.firestore, `users/${credentials.user.uid}`);
      setDoc(ref, { email });
      return credentials;
    } catch (e){
      console.log("Error on register", e);
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string}){
    try{
      const credentials = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return credentials;
    } catch (e){
      console.log("Error on login", e);
      return null;
    }
  }

  logout(){
    return signOut(this.auth);
  }
}
