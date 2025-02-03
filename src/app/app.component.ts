import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

// Import FontAwesomeModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 

import { NavbarComponent } from './components/navbar/navbar.component';
import { FormComponent } from './components/form/form.component';
import { ListComponent } from './components/list/list.component';
import { ChartComponent } from './components/chart/chart.component';

import { WorkoutService, User } from './services/workout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    FormsModule, 
    FormComponent, 
    ListComponent, 
    ChartComponent, 
    FontAwesomeModule // Add FontAwesomeModule here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent {
  title = 'health';
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      if (this.users.length > 0) {
        this.selectedUser = this.users[0]; 
      }
    });
  }

  onSelectUser(user: User) {
    this.selectedUser = user;
  }

  onAddUser(user: User) {
    this.workoutService.addUserWorkout(user.name, '', 0);
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      this.selectedUser = this.users.find(u => u.id === user.id) || null; 
    });
  }

  onDeleteUser(user: User) {
    this.workoutService.deleteUser(user.id);
    this.workoutService.getUsers().subscribe(users => {
      this.users = users;
      if (this.selectedUser && this.selectedUser.id === user.id) {
        this.selectedUser = this.users.length > 0 ? this.users[0] : null; 
      }
    });
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
