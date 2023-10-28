import { Component } from '@angular/core';
import { Appointment } from './models/appointment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mysite-angular';

  appointment: Appointment = {
    name: 'Test'
  };
}
