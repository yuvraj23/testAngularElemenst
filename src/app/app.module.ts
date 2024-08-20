import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { createCustomElement } from '@angular/elements';
import { HelloButtonComponent } from './hello-button/hello-button.component';
import { SubscribeWidgetComponent } from './subscribe-widget/subscribe-widget.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloButtonComponent,
    SubscribeWidgetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule
  ],
  // Remove entryComponents if using Angular 9+
})
export class AppModule {
  constructor(private injector: Injector) {
    const helloButton = createCustomElement(HelloButtonComponent, { injector });
    customElements.define('hello-button', helloButton);

    const subscribeWidgetElement = createCustomElement(SubscribeWidgetComponent, { injector });
    customElements.define('yuvraj-subscribe-widget', subscribeWidgetElement);
  }

  ngDoBootstrap() {} // No need to bootstrap any Angular components
}
