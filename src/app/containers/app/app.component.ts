import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Store } from 'store';

import { Router } from '@angular/router';

import { AuthService, User } from '../../../auth/shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  template: `
    <div>

      <!-- async pipe subscribe for us -->
      <app-header [user]="user$ | async" (logout)="onLogout()"> 
      </app-header>

      <!-- app nav showed only when the user is authenticated -->
      <app-nav *ngIf="(user$ | async)?.authenticated">
      </app-nav>

      <div class="wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {

  user$: Observable<User>;
  subscription: Subscription;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // The authentication kicks off only here, when we subscribe
    // It is done in the app component because here we want to know, all the time, when logged in or logged out to perform particular actions
    this.subscription = this.authService.auth$.subscribe();
    // Reactive approach -> return an Observable
    this.user$ = this.store.select<User>('user');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onLogout() {
    await this.authService.logoutUser();
    this.router.navigate(['/auth/login']);
  }

}
