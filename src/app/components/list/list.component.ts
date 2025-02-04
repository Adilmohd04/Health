import { Component, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService, User } from '../../services/workout.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements AfterViewInit {
  @Output() selectUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();

  users: User[] = [];
  searchName: string = '';
  filterType: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  paginatedUserData: User[] = [];
  totalPages: number = 1;
  selectedUser: User | null = null;
  loading: boolean = true;

  constructor(private workoutService: WorkoutService, private library: FaIconLibrary) {
    this.library.addIcons(faTrashAlt); 
    this.workoutService.userData$.subscribe(data => {
      this.users = data;
      this.paginate();
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    this.paginate();
  }

  onSearch() {
    this.paginate();
  }

  onFilterChange() {
    this.paginate();
  }

  onDeleteUser(user: User): void {
    this.workoutService.deleteUser(user.id);
    this.paginate();
  }

  onItemsPerPageChange(event: any) {
    const value = Number(event.target.value);
    if (value > 0) {
      this.itemsPerPage = value;
      this.currentPage = 1;
      this.paginate();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.paginate();
  }

  paginate() {
    this.loading = true;
    let filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(this.searchName.toLowerCase()));
    if (this.filterType) {
      filteredUsers = filteredUsers.filter(user => user.workouts.some(workout => workout.type === this.filterType));
    }
    this.totalPages = Math.ceil(filteredUsers.length / this.itemsPerPage);
    this.paginatedUserData = filteredUsers.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    this.loading = false;
  }

  onSelectUser(user: User) {
    this.selectUser.emit(user);
  }

  getUserWorkouts(user: User): string {
    return user.workouts.map(w => w.type).join(', ');
  }

  getNumberOfWorkouts(user: User): number {
    return user.workouts.length;
  }

  getTotalWorkoutMinutes(user: User): number {
    return user.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  getPaginationRange(): number[] {
    const pageRange = [];
    let start = this.currentPage;
    let end = Math.min(this.totalPages, this.currentPage + 1);
  
    for (let i = start; i <= end; i++) {
      pageRange.push(i);
    }
    
    return pageRange;
  }
  

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }
}
