import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './storage.service';

export interface Workout {
  type: string;
  minutes: number;
}

export interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly defaultUserData: User[] = [
    { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
    { id: 2, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
    { id: 3, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
  

  ];

  private userDataSubject = new BehaviorSubject<User[]>([]);
  userData$ = this.userDataSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.initializeData();
  }

  private initializeData(): void {
    const storedData = this.localStorageService.getItem<User[]>('userData');
    
    if (!storedData || storedData.length === 0) {
      this.localStorageService.setItem('userData', this.defaultUserData);
      this.userDataSubject.next([...this.defaultUserData]);
    } else {
      const defaultUserIds = new Set(this.defaultUserData.map(user => user.id));
      const storedUserIds = new Set(storedData.map(user => user.id));

      if (![...defaultUserIds].every(id => storedUserIds.has(id))) {
        this.localStorageService.setItem('userData', this.defaultUserData);
        this.userDataSubject.next([...this.defaultUserData]);
      } else {
        this.userDataSubject.next(storedData);
      }
    }
  }

  addUserWorkout(userName: string, workoutType: string, minutes: number): void {
    const currentData = this.userDataSubject.getValue();
    let user = currentData.find(u => u.name === userName);

    if (user) {
      const existingWorkout = user.workouts.find(w => w.type === workoutType);
      if (existingWorkout) {
        existingWorkout.minutes += minutes;
      } else {
        user.workouts.push({ type: workoutType, minutes });
      }
    } else {
      user = { id: currentData.length + 1, name: userName, workouts: [{ type: workoutType, minutes }] };
      currentData.push(user);
    }

    this.userDataSubject.next([...currentData]);
  }

  deleteUser(userId: number): void {
    const currentData = this.userDataSubject.getValue().filter(user => user.id !== userId);
    this.userDataSubject.next([...currentData]);
  
    this.localStorageService.setItem('userData', currentData);
  }
  

  getUsers(): Observable<User[]> {
    return this.userData$;
  }
}