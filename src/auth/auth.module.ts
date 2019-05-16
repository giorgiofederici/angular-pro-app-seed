import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Third-party modules
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

// Shared modules
import { SharedModule } from './shared/shared.module';

export const ROUTES: Routes = [
    {
        path: 'auth',
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: 'login', loadChildren: './login/login.module#LoginModule' },
            { path: 'register', loadChildren: './register/register.module#RegisterModule' }
        ]
    }
];

export const firebaseConfig: FirebaseAppConfig = {
    apiKey: "AIzaSyDwJP8_mW7VrBktwZuwO2RS_DfcO2JH8h4",
    authDomain: "fitness-app-38eb4.firebaseapp.com",
    databaseURL: "https://fitness-app-38eb4.firebaseio.com",
    projectId: "fitness-app-38eb4",
    storageBucket: "fitness-app-38eb4.appspot.com",
    messagingSenderId: "13486326035"
    // appId: "1:13486326035:web:5245f425aa3d93b0"
  };

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        SharedModule.forRoot()  // forRoot() specified here to avoid AuthService duplicates. Not needed to do the same in login and register module
    ]
})
export class AuthModule {}