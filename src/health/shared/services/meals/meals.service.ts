import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Store } from 'store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/Observable/of';

import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

export interface Meal {
    name: string,
    ingredients: string[],
    timestamp: number,
    $key: string,
    $exists: () => boolean
}

@Injectable()
export class MealsService {


    meals$: Observable<Meal[]> = (this.db.list(`meals/${this.uid}`) as Observable<Meal[]>)
        .do(next => this.store.set('meals', next)); // every time it changes, do ...

    constructor(
        private store: Store,
        private db: AngularFireDatabase,
        private authService: AuthService
    ) { }

    get uid() {
        return this.authService.user.uid;
    }

    getMeal(key: string): Observable<any> {
        if (!key) {
            return Observable.of({});
        }
        return this.store.select<Meal[]>('meals')
            .filter(Boolean) // Stop the stream if the store is empty
            .map((meals: Meal[]) => { 
                return meals.find((meal: Meal) => meal.$key === key) 
            });
    }

    addMeal(meal: Meal) {
        return this.db.list(`meals/${this.uid}`).push(meal);
    }

    updateMeal(key: string, meal: Meal) {
        return this.db.object(`meals/${this.uid}/${key}`).update(meal);
    }

    removeMeal(key: string) {
        this.db.list(`meals/${this.uid}`).remove(key);
    }
}