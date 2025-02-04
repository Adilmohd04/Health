import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkoutService, User } from '../../services/workout.service';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockWorkoutService: WorkoutService;

  beforeEach(async () => {
    mockWorkoutService = {
      userData$: new BehaviorSubject<User[]>([]) 
    } as unknown as WorkoutService;

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ListComponent],
      providers: [{ provide: WorkoutService, useValue: mockWorkoutService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call paginate on ngAfterViewInit', () => {
    spyOn(component, 'paginate');
    component.ngAfterViewInit();
    expect(component.paginate).toHaveBeenCalled();
  });

  it('should render users in a table', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Yoga', minutes: 45 }] }
    ];
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next(mockUsers);

    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(mockUsers.length);
  });

  it('should filter users by name', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Yoga', minutes: 45 }] }
    ];
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next(mockUsers);

    fixture.detectChanges();

    component.searchName = 'Jane';
    component.onSearch();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('Jane Doe');
  });

  it('should filter users by workout type', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Yoga', minutes: 45 }] }
    ];
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next(mockUsers);
    fixture.detectChanges();

    component.filterType = 'Running';
    component.onFilterChange();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    expect(rows[0].nativeElement.textContent).toContain('John Doe');
  });

  it('should delete a user', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Yoga', minutes: 45 }] }
    ];
    
    // Ensure the deleteUser method is defined in the mock
    mockWorkoutService.deleteUser = jasmine.createSpy('deleteUser');
  
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next(mockUsers);
    fixture.detectChanges();
  
    component.onDeleteUser(mockUsers[0]);
    expect(mockWorkoutService.deleteUser).toHaveBeenCalledWith(mockUsers[0].id);
  });
  
  

  it('should go to the next page', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    component.onNextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should go to the previous page', () => {
    component.totalPages = 3;
    component.currentPage = 2;
    component.onPreviousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should go to the specified page', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    component.goToPage(3);
    expect(component.currentPage).toBe(3);
  });

  it('should change items per page', () => {
    component.itemsPerPage = 5;
    component.onItemsPerPageChange({ target: { value: 10 } });
    expect(component.itemsPerPage).toBe(10);
    expect(component.currentPage).toBe(1);
  });

  it('should select a user', () => {
    const mockUser: User = { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] };
    spyOn(component.selectUser, 'emit');
    component.onSelectUser(mockUser);
    expect(component.selectUser.emit).toHaveBeenCalledWith(mockUser);
  });

  it('should handle no users available', () => {
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next([]);
    fixture.detectChanges();

    const noUsersMessage = fixture.debugElement.query(By.css('.text-center'));
    expect(noUsersMessage.nativeElement.textContent).toContain('No users available');
  });

  it('should show loading indicator when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingIndicator = fixture.debugElement.query(By.css('.flex.justify-center.items-center'));
    expect(loadingIndicator.nativeElement.textContent).toContain('Loading...');
  });

  it('should handle pagination range', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    const pageRange = component.getPaginationRange();
    expect(pageRange.length).toBe(2); // Should show current and next page
  });

  it('should handle no users on filter by name', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Yoga', minutes: 45 }] }
    ];
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next(mockUsers);
    fixture.detectChanges();

    component.searchName = 'NotFound';
    component.onSearch();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(0); // Should not display any rows
  });

  it('should handle no users on filter by workout type', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Doe', workouts: [{ type: 'Yoga', minutes: 45 }] }
    ];
    (mockWorkoutService.userData$ as BehaviorSubject<User[]>).next(mockUsers);
    fixture.detectChanges();

    component.filterType = 'NonExistentType';
    component.onFilterChange();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(0); // Should not display any rows
  });
});
