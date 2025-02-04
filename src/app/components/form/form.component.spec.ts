import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { WorkoutService } from '../../services/workout.service';
import { of } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockWorkoutService: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    // Create a spy object for the WorkoutService
    mockWorkoutService = jasmine.createSpyObj('WorkoutService', ['getUsers', 'addUserWorkout']);

    await TestBed.configureTestingModule({
      imports: [FormComponent],
      providers: [
        { provide: WorkoutService, useValue: mockWorkoutService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUserWorkout and reset form on successful submit', () => {
    // Arrange
    component.userName = 'John Doe';
    component.workoutType = 'Running';
    component.minutes = 30;
    mockWorkoutService.addUserWorkout.and.callThrough(); // Mock the addUserWorkout method

    // Act
    component.onSubmit();

    // Assert
    expect(mockWorkoutService.addUserWorkout).toHaveBeenCalledWith('John Doe', 'Running', 30);
    expect(component.userName).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.minutes).toBe(0);
  });

  it('should show alert if form fields are empty', () => {
    // Arrange
    component.userName = '';
    component.workoutType = '';
    component.minutes = 0;
    spyOn(window, 'alert'); // Spy on alert to check if it gets called

    // Act
    component.onSubmit();

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Please fill all fields correctly.');
  });

  it('should call addUser.emit with new user when addUserWorkout is called', () => {
    // Arrange
    component.userName = 'John Doe';
    mockWorkoutService.getUsers.and.returnValue(of([])); // Return an empty array when getUsers is called
    spyOn(component.addUser, 'emit'); // Spy on the addUser event emitter

    // Act
    component.addUserWorkout();

    expect(mockWorkoutService.getUsers).toHaveBeenCalled();
    expect(component.addUser.emit).toHaveBeenCalledWith({
      id: 1, 
      name: 'John Doe',
      workouts: []
    });
    expect(component.userName).toBe('');
  });
});
