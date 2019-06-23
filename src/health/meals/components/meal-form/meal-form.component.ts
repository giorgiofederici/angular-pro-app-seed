import { Component, OnChanges, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { Meal } from '../../../shared/services/meals/meals.service';

@Component({
    selector: 'meal-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['meal-form.component.scss'],
    template: `
        <div clas="meal-form">
            <form [formGroup]="form">

                <div class="meal-form__name">
                    <label>
                        <h3>Meal name</h3>
                        <input
                            class="meal-form__input"
                            type="text"
                            placeholder="e.g. English Breakfast"
                            formControlName="name">
                        <div class="error" *ngIf="required">
                            Workout name is required
                        </div>
                    </label>
                </div>

                <div class="meal-form__food">
                    <div class="meal-form__subtitle">
                        <h3>Food</h3>
                        <button
                            type="button"
                            class="meal-form__add"
                            (click)="addIngredient()">
                            <img src="/img/add-white.svg">
                            Add food
                        </button>
                    </div>
                    <div formArrayName="ingredients">
                        <label *ngFor="let c of ingredients.controls; index as i;">
                            <input 
                                class="meal-form__input"
                                [formControlName]="i"
                                placeholder="e.g. Eggs">
                            <span class="meal-form__remove" (click)="removeIngredient(i)">
                            </span>
                        </label>
                    </div>
                </div>

                <div class="meal-form__submit">
                    <div>
                        <button
                        class="meal-form__button"
                        type="button"
                        *ngIf="!exists"
                        (click)="createMeal()">
                            Create meal
                        </button>
                        <button
                            class="meal-form__button"
                            type="button"
                            *ngIf="exists"
                            (click)="updateMeal()">
                                Save
                        </button>
                        <a class="button button--cancel" [routerLink]="['../']">
                            Cancel
                        </a>
                    </div>

                    <div class="meal-form__delete" *ngIf="exists">
                        <div *ngIf="toggled">
                            <p>Delete item?</p>
                            <button class="confirm" type="button" (click)="removeMeal()">Yes</button>
                            <button class="cancel" type="button" (click)="toggle()">No</button>
                        </div>

                        <button class="meal-form__button meal-form__button--delete" type="button" (click)="toggle()">
                            Delete
                        </button>
                    </div>
                </div>

            </form>
        </div>
    `
})
export class MealFormComponent implements OnChanges {

    toggled: boolean = false;
    exists: boolean = false;

    @Input()
    meal: Meal;

    @Output()
    create: EventEmitter<Meal> = new EventEmitter<Meal>();

    @Output()
    update: EventEmitter<Meal> = new EventEmitter<Meal>();

    @Output()
    remove: EventEmitter<Meal> = new EventEmitter<Meal>();

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        ingredients: this.fb.array([''])
    });

    constructor(
        private fb: FormBuilder
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (this.meal && this.meal.name) {
            this.exists = true;
            this.emptyIngredients();

            const value = this.meal;
            this.form.patchValue(value);

            if (value.ingredients) {
                for (const item of value.ingredients) {
                    this.ingredients.push(new FormControl(item));
                }
            }
        }
    }

    emptyIngredients() {
        while(this.ingredients.controls.length) {
            this.ingredients.removeAt(0);
        }
    }

    get required() {
        return (
            this.form.get('name').hasError('required') &&
            this.form.get('name').touched
        );
    }

    get ingredients(): FormArray {
        return this.form.get('ingredients') as FormArray;
    }

    addIngredient(): void {
        this.ingredients.push(new FormControl(''));
    }

    removeIngredient(index: number): void {
        this.ingredients.removeAt(index);
    }

    createMeal(): void {
        if (this.form.valid) {
            this.create.emit(this.form.value);
        }
    }

    updateMeal(): void {
        if (this.form.valid) {
            this.update.emit(this.form.value);
        }
    }

    removeMeal(): void {
        this.remove.emit(this.form.value);
    }

    toggle() {
        this.toggled = !this.toggled;
    }
}