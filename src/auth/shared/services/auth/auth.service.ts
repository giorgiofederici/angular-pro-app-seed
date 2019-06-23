import { Injectable } from '@angular/core';

import { Store } from 'store';

import 'rxjs/add/operator/do';

import { AngularFireAuth } from 'angularfire2/auth';

export interface User {
    email: string,
    uid: string,
    authenticated: boolean
}

@Injectable()
export class AuthService {

    // authState -> Observable
    // do -> create some side effect
    auth$ = this.af.authState.do(next => {
        if (!next) {
            this.store.set('user', null);
            return;
        }
        // Create the user object
        const user: User = {
            email: next.email,
            uid: next.uid,
            authenticated: true
        };
        // Assign the user object to store
        this.store.set('user', user);
    });

    constructor(
        private store: Store,
        private af: AngularFireAuth
    ) {}

    get user() {
        return this.af.auth.currentUser;
    }

    get authState() {
        return this.af.authState;
    }

    createUser(email: string, password: string) {
        return this.af.auth.createUserWithEmailAndPassword(email, password);
    }

    loginUser(email: string, password: string) {
        return this.af.auth.signInWithEmailAndPassword(email, password);
    }

    logoutUser() {
        return this.af.auth.signOut();
    }
}