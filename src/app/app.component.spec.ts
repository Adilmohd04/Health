import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WorkoutService } from './services/workout.service';
import { of } from 'rxjs';
import { ListComponent } from './components/list/list.component';

describe('AppComponent', () => {
  let app: AppComponent;
  let workoutServiceSpy: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['getUsers', 'addUserWorkout', 'deleteUser']);
  
    workoutServiceSpy.getUsers.and.returnValue(of([{ id: 1, name: 'John Doe', workouts: [] }]));
  
    workoutServiceSpy.userData$ = of([{ id: 1, name: 'John Doe', workouts: [] }]);
  
    await TestBed.configureTestingModule({
      imports: [AppComponent, ListComponent],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy }
      ]
    }).compileComponents();
  });
  

  beforeEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Health Tracker');
  });

  it('should select a user', () => {
    const user = { id: 1, name: 'John Doe', workouts: [] };
    app.onSelectUser(user);
    expect(app.selectedUser).toEqual(user);
  });

  it('should add a workout and select a user', () => {
    const user = { id: 1, name: 'John Doe', workouts: [] };
    
    // Ensure that getUsers returns the user properly
    workoutServiceSpy.getUsers.and.returnValue(of([user]));
    
    app.onAddUser(user);
    
    // Check if the addUserWorkout method was called
    expect(workoutServiceSpy.addUserWorkout).toHaveBeenCalledWith(user.name, '', 0);
    
    // Check if the user list is updated
    workoutServiceSpy.getUsers().subscribe(users => {
      expect(users.length).toBeGreaterThan(0); // Ensure user is added
      expect(app.selectedUser).toEqual(user);
    });
  });
  it('should set selectedUser to null if the added user is not found', () => {
    const newUser = { id: 2, name: 'Jane Doe', workouts: [] };
  
    workoutServiceSpy.getUsers.and.returnValue(of([{ id: 1, name: 'John Doe', workouts: [] }])); // User not found
  
    app.onAddUser(newUser);
  
    expect(app.selectedUser).toBeNull(); // Ensure selectedUser is set to null
  });
  it('should update selectedUser to the first user after deletion', () => {
    const userToDelete = { id: 1, name: 'John Doe', workouts: [] };
    const remainingUser = { id: 2, name: 'Jane Doe', workouts: [] };
  
    workoutServiceSpy.getUsers.and.returnValue(of([remainingUser])); // One user left
  
    app.onDeleteUser(userToDelete);
  
    expect(app.selectedUser).toEqual(remainingUser); // Should select first remaining user
  });
  it('should set selectedUser to null when no users remain after deletion', () => {
    const userToDelete = { id: 1, name: 'John Doe', workouts: [] };
  
    workoutServiceSpy.getUsers.and.returnValue(of([])); // No users left
  
    app.onDeleteUser(userToDelete);
  
    expect(app.selectedUser).toBeNull(); // Should be null when no users exist
  });
      
  it('should delete a user and update the selectedUser', () => {
    const user = { id: 1, name: 'John Doe', workouts: [] };
    workoutServiceSpy.getUsers.and.returnValue(of([])); // Mock empty user list after deletion

    app.onDeleteUser(user);

    expect(workoutServiceSpy.deleteUser).toHaveBeenCalledWith(user.id);
    workoutServiceSpy.getUsers().subscribe(users => {
      expect(users.length).toBe(0); // Ensure user is removed
      expect(app.selectedUser).toBeNull(); // Ensure selectedUser is null
    });
  });

  it('should scroll to the section', () => {
    const sectionId = 'target-section';
    const mockElement = { scrollIntoView: jasmine.createSpy('scrollIntoView') };
    
    spyOn(document, 'getElementById').and.returnValue(mockElement as any);

    app.scrollToSection(sectionId);

    expect(document.getElementById).toHaveBeenCalledWith(sectionId);
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  // Test to check ListComponent subscription issues
  it('should handle ListComponent subscription correctly', () => {
    workoutServiceSpy.getUsers.and.returnValue(of([{ id: 1, name: 'John Doe', workouts: [] }]));

    const fixture = TestBed.createComponent(ListComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();  
  });
});
