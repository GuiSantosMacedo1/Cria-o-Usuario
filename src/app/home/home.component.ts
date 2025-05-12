import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class AppComponent {
  selectedUser: any;
  users: any[] = [];
  userForm: FormGroup;
  editForm: FormGroup;
  userData = {
    name: '',
    age: null,
    sex: '',
    document: '',
    status: true,
    address: {
      street: '',
      number: '',
      block: '',
      apartment: '',
      country: '',
      city: '',
      district: '',
    },
  };

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1)]],
      sex: ['', [Validators.required]],
      document: ['', [Validators.required]],
      status: [true, [Validators.required]],
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
      this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1)]],
      sex: ['', [Validators.required]],
      document: ['', [Validators.required]],
      status: [true, [Validators.required]],
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

  }

  ngOnInit() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  onSubmit() {
    const userData = {
      name: this.userForm.get('name')?.value,
      age: this.userForm.get('age')?.value,
      sex: this.userForm.get('sex')?.value,
      document: this.userForm.get('document')?.value,
      status: this.userForm.get('status')?.value,
      address: this.userForm.get('address')?.value,
    };

    if (this.userForm.valid) {
      this.userData = {
        name: this.userForm.get('name')?.value,
        age: this.userForm.get('age')?.value,
        sex: this.userForm.get('sex')?.value,
        document: this.userForm.get('document')?.value,
        status: this.userForm.get('status')?.value,
        address: this.userForm.get('address')?.value,
      };
      this.userService.createUser(userData).subscribe(() => {
        this.openModalCreate();
        this.getUsers();
        this.userForm.reset();
      });
    } else {
      console.log('Form is invalid');
    }
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((response) => {
      this.users = response;
      console.log('Usuários atualizados:', this.users);
    });
  }

  modalEdit(user: any) {
    this.selectedUser = user;
    this.editForm.patchValue({
      name: user.name,
      age: user.age,
      sex: user.sex,
      document: user.document,
      status: user.status,
      address: {
        street: user.address.street,
        number: user.address?.number,
        block: user.address?.block,
        apartment: user.address?.apartment,
        country: user.address?.country,
        city: user.address?.city,
        district: user.address?.district,
      },
    });

    const modal = document.querySelector('.modal-edit') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    modal.classList.add('show');
    overlay.classList.add('show');
    this.closeModalUsers();
  }
  
  closeModalEdit() {
    const modal = document.querySelector('.modal-edit') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    modal.classList.remove('show');
    overlay.classList.remove('show');
    this.openModalUsers();
  }
  
  confirmEdit(userId: number) {
    const updatedUser = this.editForm.value;
    this.userService.updateUser(userId, updatedUser).subscribe(() => {
      this.getUsers();
      this.closeModalEdit();
      console.log('User updated successfully');
    });
  }
  modalDelete(user: any) {
    this.selectedUser = user;
    const modal = document.querySelector('.modal-delete') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    modal.classList.add('show');
    overlay.classList.add('show');
    this.closeModalUsers();
  }
  closeModalDelete() {
    const modal = document.querySelector('.modal-delete') as HTMLElement;
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    modal.classList.remove('show');
    overlay.classList.remove('show');
    this.openModalUsers();
  }

  confirmDelete(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter((user) => user.id !== userId);
      this.getUsers();
      this.closeModalDelete();
      console.log('User deleted successfully');
    });
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
  }
}
