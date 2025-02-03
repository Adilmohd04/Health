import { Component, Input, OnChanges, SimpleChanges, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { User } from '../../services/workout.service';
import { isPlatformBrowser } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges, OnInit {
  @Input() users: User[] = [];
  @Input() selectedUser: User | null = null;

  private chart: Chart | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.createChart();
      this.updateChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser) {
      if (changes['selectedUser'] || changes['users']) {
        if (this.users.length === 0) {
          this.selectedUser = null; 
          this.clearChart();
        } else if (!this.selectedUser || !this.users.some(user => user.id === this.selectedUser?.id)) {
          this.selectedUser = this.getDefaultUser();
        }
        this.updateChart();
      }
    }
  }

  private createChart(): void {
    if (!this.isBrowser) return;

    const canvas = document.getElementById('userChart') as HTMLCanvasElement | null;
    const context = canvas?.getContext('2d');

    if (context) {
      const config: ChartConfiguration = {
        type: 'bar' as ChartType,
        data: {
          labels: [],
          datasets: [{
            label: 'Minutes',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      this.chart = new Chart(context, config);
    }
  }

  private updateChart(): void {
    if (this.chart) {
      if (this.selectedUser) {
        const workoutTypes = this.selectedUser.workouts.map(workout => workout.type);
        const workoutMinutes = this.selectedUser.workouts.map(workout => workout.minutes);

        // Generate a color for each workout
        const colors = workoutMinutes.map(() => this.getRandomColor());

        this.chart.data.labels = workoutTypes;
        this.chart.data.datasets[0].data = workoutMinutes;
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chart.data.datasets[0].borderColor = colors.map(color => this.getDarkerShade(color));
        
      } else {
        this.clearChart();
      }
      this.chart.update();
    }
  }

  private clearChart(): void {
    if (this.chart) {
      this.chart.data.labels = [];
      this.chart.data.datasets[0].data = [];
      this.chart.update();
    }
  }

  private getDefaultUser(): User | null {
    return this.users.length > 0 ? this.users[0] : null;
  }

  onSelectUser(user: User): void {
    this.selectedUser = user;
    this.updateChart();
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private getDarkerShade(color: string): string {
    let shade = '#';
    for (let i = 1; i < 7; i += 2) {
      const component = parseInt(color.slice(i, i + 2), 16);
      const darkerComponent = Math.max(0, component - 40).toString(16).padStart(2, '0');
      shade += darkerComponent;
    }
    return shade;
  }
}