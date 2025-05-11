import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1)]],
      sex: ['', [Validators.required]],
      document: ['', [Validators.required]],
      status: [false, [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        number: ['', [Validators.required]],
        block: [''],
        apartment: [''],
        country: ['', [Validators.required]],
        city: ['', [Validators.required]],
        district: ['', [Validators.required]],
      }),
    });

    console.log(this.userForm);
  }

  onSubmit() {

    console.log('Form Values:', this.userForm.value);
    console.log('Address Values:', this.userForm.get('address')?.value);
    const userData = {
      name: this.userForm.get('name')?.value,
      age: this.userForm.get('age')?.value,
      sex: this.userForm.get('sex')?.value,
      document: this.userForm.get('document')?.value,
      status: this.userForm.get('status')?.value,
      address: this.userForm.get('address')?.value,
    };

    if (this.userForm.valid) {
      this.userService.createUser(userData).subscribe((response) => {
        this.openModalCreate();
        this.userForm.reset();
        console.log(JSON.stringify(userData.address, null, 2));
        console.log('Usuário criado com sucesso:', response);
      });
    } else {
      console.log('Form is invalid');
    }
    console.log('Form submitted:', userData);
  }

  openModalCreate(): void {
    const modal = document.querySelector('.modal-create') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    modal.classList.add('show');
    overlay.classList.add('show');
  }

  closeModalCreate(): void {
    const modal = document.querySelector('.modal-create') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    modal.classList.remove('show');
    overlay.classList.remove('show');
  }
}
