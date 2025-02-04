import { TestBed } from '@angular/core/testing';
import { WorkoutService, User } from './workout.service';
import { LocalStorageService } from './storage.service';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let initialUsers: User[];

  beforeEach(() => {
    // Mock localStorageService
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);

    // Initial user data
    initialUsers = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
      { id: 3, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
    ];

    // Mock getItem to return initial data on service init
    localStorageServiceSpy.getItem.and.returnValue(initialUsers);

    TestBed.configureTestingModule({
      providers: [
        WorkoutService,
        { provide: LocalStorageService, useValue: localStorageServiceSpy }
      ]
    });

    service = TestBed.inject(WorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with predefined users', (done) => {
    service.getUsers().pipe(take(1)).subscribe(users => {
      expect(users.length).toBe(3);
      expect(users).toEqual(initialUsers);
      done();
    });
  });

  it('should add a workout for an existing user', (done) => {
    const userName = 'John Doe';
    const workoutType = 'Running';
    const minutes = 20;

    service.addUserWorkout(userName, workoutType, minutes);
    service.getUsers().pipe(take(1)).subscribe(users => {
      const user = users.find(u => u.name === userName);
      const workout = user?.workouts.find(w => w.type === workoutType);
      expect(workout).toBeTruthy();
      expect(workout?.minutes).toBe(50); // Running minutes should be 30 + 20 = 50
      done();
    });
  });

  it('should add a new workout type for an existing user', (done) => {
    const userName = 'Jane Smith';
    const workoutType = 'Cycling';
    const minutes = 30;

    service.addUserWorkout(userName, workoutType, minutes);
    service.getUsers().pipe(take(1)).subscribe(users => {
      const user = users.find(u => u.name === userName);
      const workout = user?.workouts.find(w => w.type === workoutType);
      expect(workout).toBeTruthy();
      expect(workout?.minutes).toBe(30); // New workout type added
      done();
    });
  });

  it('should add a workout for a new user', (done) => {
    const userName = 'New User';
    const workoutType = 'Running';
    const minutes = 45;

    service.addUserWorkout(userName, workoutType, minutes);
    service.getUsers().pipe(take(1)).subscribe(users => {
      const user = users.find(u => u.name === userName);
      expect(user).toBeTruthy();
      expect(user?.workouts.length).toBe(1);
      expect(user?.workouts[0].type).toBe(workoutType);
      expect(user?.workouts[0].minutes).toBe(minutes);
      done();
    });
  });

  it('should delete a user', (done) => {
    const userId = 1;

    // Call deleteUser to remove user with id 1
    service.deleteUser(userId);

    // Check that setItem was called to update localStorage with the updated users
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith('userData', [
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
      { id: 3, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
    ]);

    // Check the users observable to ensure the user was removed
    service.getUsers().pipe(take(1)).subscribe(users => {
      const user = users.find(u => u.id === userId);
      expect(user).toBeUndefined();
      done();
    });
  });

  it('should initialize with default data if local storage is empty', (done) => {
    localStorageServiceSpy.getItem.and.returnValue([]); // Mock empty localStorage

    service = TestBed.inject(WorkoutService); // Re-initialize the service with empty data

    service.getUsers().pipe(take(1)).subscribe(users => {
      expect(users.length).toBe(3); // Should load default data
      expect(users).toEqual(initialUsers);
      done();
    });
  });
  it('should initialize with default data if local storage is empty', (done) => {
    // Mock getItem to return null (empty local storage)
    localStorageServiceSpy.getItem.and.returnValue(null);
  
    // Re-initialize the service to trigger data loading
    service = new WorkoutService(localStorageServiceSpy);
  
    service.getUsers().pipe(take(1)).subscribe(users => {
      expect(users.length).toBe(3); // Should load default data
      expect(users).toEqual(initialUsers);
      expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith('userData', initialUsers);
      done();
    });
  });
  
 
  
});
