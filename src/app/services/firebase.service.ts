import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, concatMap, first, from, observable, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { ProfileUser } from '../shared/models/chat/user-profile';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, UserInfo } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  currentUser$ = authState(this.auth);
  currentUser!: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private navigationService: NavigationService,
    private authService: AuthenticationService,
  ) {
  }

  getCurrentUserProfile(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user: any) => {
        if (!user || user.uid == undefined || user.id == null) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  get allUsers$(): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    let users = collectionData(queryAll) as Observable<ProfileUser[]>;
    return users;
  }

  getUser(userId: string): Observable<ProfileUser[]> {
    let email = userId + environment.firebase.defaultSuffixEmail;
    const ref = collection(this.firestore, 'users');
    const queryDoc = query(ref, where("email", "==", email));
    return collectionData(queryDoc) as Observable<ProfileUser[]>;
  }

  async addUser(user: ProfileUser) {
    console.log("addUser", user);

    const ref = doc(this.firestore, 'users', user.uid);

    // add new or override
    await setDoc(ref, user, { merge: true });
    return ref;
  }

  async updateUser(user: ProfileUser) {
    console.log("updateUser", user);

    if (user.uid) {
      const ref = doc(this.firestore, 'users', user.uid);
      return await updateDoc(ref, { ...user });
    }
  }

  async loginWithEmail(username: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, username, password);
  }

  loginWithPhone(username: string, password: string) {
  }

  async signUpWithEmail(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async createIfNotExistThenLoginFirebase(email: string, password: string, name: string, phone: string = ''): Promise<any> {
    console.log("createIfNotExistThenLoginFirebase", email);

    let createIfExist = false;
    let createNew = false;

    await createUserWithEmailAndPassword(this.auth, email, password)
      .then(u => {
        console.log("created new user. Login with the email");
        createNew = true;
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            console.log(`Email address ${email} already exist. Login with the email`);
            createIfExist = true;
            break;
          case 'auth/invalid-email':
            console.log(`Email address ${email} is invalid.`);
            break;
          case 'auth/operation-not-allowed':
            console.log(`Error during sign up.`);
            break;
          case 'auth/weak-password':
            console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
            break;
          default:
            console.log(error.message);
            break;
        }
      });

    if (createNew || createIfExist) {
      let currentUser = await this.signinThenCreateUserDocIfNotExist(email, password, name, phone);
      this.setLocalAccount(currentUser);

      return currentUser;
    }

    return null;
  }

  updateProfileData(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap((user) => {
        if (!user) throw new Error('Not Authenticated');

        return updateProfile(user, profileData);
      })
    );
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.navigationService.firebaseSession);
    return await this.auth.signOut();
  }

  setCurrentUser() {
    this.currentUser = this.getFirebaseAccount();
  }

  getFirebaseAccount(): any {
    let json = localStorage.getItem(this.navigationService.firebaseSession) ?? "";

    if (!json || json === "") {
      return null;
    }
    
    return JSON.parse(json);
  }

  setLocalAccount(currentUser: any) {
    localStorage.setItem(this.navigationService.firebaseSession, JSON.stringify(currentUser));
  }

  removeLocalAccount() {
    localStorage.removeItem(this.navigationService.firebaseSession);
  }

  private async signinThenCreateUserDocIfNotExist(email: string, password: string, name: string, phone: string = ''): Promise<any> {
    // authen credential
    let credential = await this.loginWithEmail(email, password);

    if (!credential) {
      credential = await this.loginWithEmail(email, password);
    }

    console.log("signinThenCreateUserDocIfNotExist", credential);

    await this.addUser({
      uid: credential.user.uid,
      email: email,
      displayName: name,
      firstName: name,
      lastName: name,
      phone: phone,
      address: '',
      photoURL: '',
      readed: false
    } as ProfileUser);

    return this.toCurrentUser(credential, name);
  }

  private toCurrentUser(credential: any, name: string = '') {
    let currentUser: any = {};
    currentUser.uid = credential.user.uid;
    currentUser.displayName = credential.user?.displayName ?? name;
    currentUser.email = credential.user.email;
    return currentUser;
  }

}
