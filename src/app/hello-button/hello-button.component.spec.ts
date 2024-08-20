import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';  // Ensure this is imported in your module

@Component({
  selector: 'hello-button',
  template: `
    <button mat-raised-button color="primary" (click)="sayHello()">Click Me</button>
  `,
  styles: []
})
export class HelloButtonComponent {
  sayHello() {
    alert('Hello');
  }
}
