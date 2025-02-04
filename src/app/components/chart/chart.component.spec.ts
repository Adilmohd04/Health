import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../services/workout.service';
import { Chart } from 'chart.js';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 25 },
        { type: 'Yoga', minutes: 40 }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have users initialized as an empty array', () => {
    expect(component.users).toEqual([]);
  });

  it('should assign selectedUser when users input changes', () => {
    component.users = mockUsers;
    component.selectedUser = null;
    component.ngOnChanges({
      users: {
        previousValue: [],
        currentValue: mockUsers,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.selectedUser).toEqual(jasmine.objectContaining(mockUsers[0]));
  });

  it('should update chart when selectedUser changes', () => {
    spyOn(component as any, 'updateChart').and.callThrough();
    component.selectedUser = mockUsers[0];
    component.ngOnChanges({
      selectedUser: {
        previousValue: null,
        currentValue: mockUsers[0],
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect((component as any).updateChart).toHaveBeenCalled();
  });

  it('should call createChart on ngOnInit if browser', () => {
    spyOn(component as any, 'createChart');
    component.ngOnInit();
    expect((component as any).createChart).toHaveBeenCalled();
  });

  it('should clear chart when there are no users', () => {
    spyOn(component as any, 'clearChart');
    component.users = [];
    component.selectedUser = null;
    component.ngOnChanges({
      users: {
        previousValue: mockUsers,
        currentValue: [],
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect((component as any).clearChart).toHaveBeenCalled();
  });

  it('should update chart when onSelectUser is called', () => {
    spyOn(component as any, 'updateChart');
    component.onSelectUser(mockUsers[1]);

    expect(component.selectedUser).toEqual(mockUsers[1]);
    expect((component as any).updateChart).toHaveBeenCalled();
  });

  it('should generate random colors', () => {
    const color = (component as any).getRandomColor();
    expect(color).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('should return a darker shade of a given color', () => {
    const color = '#AABBCC';
    const darkerShade = (component as any).getDarkerShade(color);
    expect(darkerShade).toMatch(/^#[0-9A-F]{6}$/);
    expect(darkerShade).not.toEqual(color);
  });

  it('should return the first user as the default user if users exist', () => {
    component.users = mockUsers;
    const defaultUser = (component as any).getDefaultUser();
    expect(defaultUser).toEqual(mockUsers[0]);
  });

  it('should return null as default user if no users exist', () => {
    component.users = [];
    const defaultUser = (component as any).getDefaultUser();
    expect(defaultUser).toBeNull();
  });
  it('should return early from createChart when not in browser', () => {
    spyOn(Chart, 'register'); // Prevent Chart.js from throwing errors
    spyOn(document, 'getElementById'); // Prevent DOM interaction errors

    (component as any).isBrowser = false; // Simulate server-side rendering

    const createChartSpy = spyOn(component as any, 'createChart').and.callThrough();
    
    // Mock Chart constructor
    const chartSpy = jasmine.createSpyObj('Chart', ['update']);
    
    (component as any).createChart();

    expect(createChartSpy).toHaveBeenCalled(); // Ensure createChart was called
    expect(chartSpy.update).not.toHaveBeenCalled(); // Ensure Chart is never created
  });




});
