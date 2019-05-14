import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'register',
    template: `
        <div>
            <auth-form (submitted)="loginUser($event)">
                <h1>Register</h1>
                <a routerLink="/auth/login">Already have an account?</a>
                <button type="submit">
                    Create account
                </button>
            </auth-form>
        </div>
    `
})
export class RegisterComponent {
    constructor() {}

    loginUser(event: FormGroup): void {
        console.log(event.value);
    }
}