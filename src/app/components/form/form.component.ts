import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { WorkoutService, User } from '../../services/workout.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(50px)', opacity: 0 }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class FormComponent {
  userName: string = '';
  workoutType: string = '';
  minutes: number = 0;
  @Output() addUser = new EventEmitter<any>();

  constructor(private workoutService: WorkoutService) {}

  addUserWorkout() {
    this.workoutService.getUsers().subscribe(users => {
      const newId = users.length + 1;
      const newUser = { id: newId, name: this.userName, workouts: [] };
      this.addUser.emit(newUser); 
      this.userName = ''; 
    });
  }

  onSubmit() {
    if (this.userName && this.workoutType && this.minutes > 0) {
      this.workoutService.addUserWorkout(this.userName, this.workoutType, this.minutes);
      console.log(`Added workout for ${this.userName}: ${this.workoutType} (${this.minutes} minutes)`);
      this.resetForm();
    } else {
      alert('Please fill all fields correctly.');
    }
  }

  private resetForm() {
    this.userName = '';
    this.workoutType = '';
    this.minutes = 0;
  }
}
