import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-button',
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
