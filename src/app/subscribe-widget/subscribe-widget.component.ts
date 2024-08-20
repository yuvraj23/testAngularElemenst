import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'subscribe-widget',
  templateUrl: './subscribe-widget.component.html',
  styleUrls: ['./subscribe-widget.component.scss']
})
export class SubscribeWidgetComponent implements AfterViewInit, OnDestroy {

  @ViewChild('openModalBtn', { static: false }) openModalBtn!: ElementRef;
  @ViewChild('closeModalBtn', { static: false }) closeModalBtn!: ElementRef;
  @ViewChild('subscribeBtn', { static: false }) subscribeBtn!: ElementRef;
  @ViewChild('otpInput', { static: false }) otpInput!: ElementRef;
  @ViewChild('otpSubmitButton', { static: false }) otpSubmitButton!: ElementRef;
  @ViewChild('modal', { static: false }) modal!: ElementRef;
  @ViewChild('emailInput', { static: false }) emailInput!: ElementRef;
  @ViewChild('message', { static: false }) message!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    this.initializeEventListeners();
  }

  ngOnDestroy(): void {
    this.cleanupEventListeners();
  }

  initializeEventListeners() {
    this.openModalBtn.nativeElement.addEventListener('click', this.toggleModal.bind(this));
    this.closeModalBtn.nativeElement.addEventListener('click', this.toggleModal.bind(this));
    this.subscribeBtn.nativeElement.addEventListener('click', this.handleSubscribe.bind(this));
  }

  cleanupEventListeners() {
    this.openModalBtn.nativeElement.removeEventListener('click', this.toggleModal.bind(this));
    this.closeModalBtn.nativeElement.removeEventListener('click', this.toggleModal.bind(this));
    this.subscribeBtn.nativeElement.removeEventListener('click', this.handleSubscribe.bind(this));

    // If you added any event listener dynamically, make sure to remove them too.
    if (this.otpSubmitButton) {
      this.otpSubmitButton.nativeElement.removeEventListener('click', this.verifyOtp.bind(this));
    }
  }

  toggleModal() {
    const modal = this.modal.nativeElement;
    const emailInput = this.emailInput.nativeElement;
    const body = document.body;

    const token = localStorage.getItem("automateBytesAuthToken");

    if (token) {
      fetch('https://automatedbytesauth.pythonanywhere.com/auth/is_user_logged_in/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then(response => response.json())
        .then(data => {
          emailInput.value = data.email;
          emailInput.disabled = true;

          this.toggleModalDisplay(modal, body);
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
      emailInput.value = "";
      emailInput.disabled = false;

      this.toggleModalDisplay(modal, body);
    }
  }

  toggleModalDisplay(modal: HTMLElement, body: HTMLElement) {
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';

    if (modal.style.display === 'block') {
      body.classList.add('no-scroll');
    } else {
      body.classList.remove('no-scroll');
      this.clearModalContent();
    }
  }

  handleSubscribe() {
    const email = this.emailInput.nativeElement.value;
    const message = this.message.nativeElement;

    const is_logged_in = localStorage.getItem("automateIsLogin");

    fetch('https://yuvblogger.pythonanywhere.com/subscribe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, is_logged_in }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          message.textContent = data.message;

          if (data.is_otp_needed === "true") {
            this.showOtpInput();
          } else {
            this.handleSubscriptionSuccess();
          }
        } else {
          this.handleSubscriptionError(data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        message.textContent = 'An error occurred. Please try again. 🙁';
        message.style.color = 'red';
      });
  }

  showOtpInput() {
    this.subscribeBtn.nativeElement.style.display = 'none';
    this.otpInput.nativeElement.style.display = 'block';
    this.otpSubmitButton.nativeElement.style.display = 'block';

    this.otpSubmitButton.nativeElement.addEventListener('click', this.verifyOtp.bind(this));
  }

  verifyOtp() {
    const otp = this.otpInput.nativeElement.value;
    const email = this.emailInput.nativeElement.value;
    const message = this.message.nativeElement;

    fetch('https://yuvblogger.pythonanywhere.com/verify-otp/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp, email }),
    })
      .then(response => response.json())
      .then(otpData => {
        if (otpData.success) {
          this.handleSubscriptionSuccess();
        } else {
          message.textContent = otpData.message || "Invalid OTP. Please try again. 🤔";
          message.style.color = '#dc3545';  // Error color
        }
      })
      .catch(error => {
        console.error('Error:', error);
        message.textContent = 'Oops! Something went wrong during OTP verification. Please try again later. 😬';
        message.style.color = '#dc3545';
      });
  }

  handleSubscriptionSuccess() {
    const message = this.message.nativeElement;
    message.textContent = "🎉 Thanks for subscribing! You’re officially one of us now! 🥳";
    message.style.color = '#00c853';

    this.otpInput.nativeElement.style.display = 'none';
    this.otpSubmitButton.nativeElement.style.display = 'none';
  }

  handleSubscriptionError(data: any) {
    const message = this.message.nativeElement;

    if (data.email && data.email[0].startsWith("subscriber with this email already exists.")) {
      message.textContent = "🤔 Oh, you again? Our server’s on vacation 🌴😎🚀. You've already subscribed with this email";
      message.style.color = '#dc3545';
    }
  }

  clearModalContent() {
    const message = this.message.nativeElement;
    const emailInput = this.emailInput.nativeElement;

    message.textContent = '';
    emailInput.value = '';
  }
}
