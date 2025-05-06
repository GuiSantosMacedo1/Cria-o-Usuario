import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1)]],
      sex: ['', [Validators.required]],
      document: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });

    console.log(this.userForm);
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Submitted!', this.userForm.value);
      this.openModalCreate();
    } else {
      console.log('Form is invalid');
    }
  }

  openModalUsers(): void {
    const modal = document.querySelector('.modal-users') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    modal.classList.add('show');
    overlay.classList.add('show');
  }
  closeModalUsers(): void {
    const modal = document.querySelector('.modal-users') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
      modal.classList.remove('show');
      overlay.classList.remove('show');
    };

  openModalCreate(): void {
    const modal = document.querySelector('.modal-create') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    modal.classList.add('show');
    overlay.classList.add('show');
  };
  
  closeModalCreate(): void {
    const modal = document.querySelector('.modal-create') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    if (this.userForm.valid) {
      modal.classList.remove('show');
      overlay.classList.remove('show');
    }
    this.userForm.reset(); // Reset the form after submission
  }
}