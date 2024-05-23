import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShortcutInputComponent } from './short-cut-input/short-cut-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShortcutInputComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'switchy';
  data: string = '';
  modifiers: string[] = ['Control', 'Alt', 'Shift', 'CapsLock', 'Meta'];

  updateData(event: string) {
    this.data = event;
  }
}
