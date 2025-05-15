import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
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
  selectedFile: File | null = null;  
  isFormSubmitted: boolean = false;
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

  onSubmit(): void {
    if (this.userForm.valid) {
      const addressGroup = this.userForm.get('address') as FormGroup;

      const address = addressGroup.enabled
        ? addressGroup.value
        : {
            street: null,
            number: null,
            block: null,
            apartment: null,
            country: null,
            city: null,
            district: null,
          };

      const userData = {
        name: this.userForm.get('name')?.value,
        age: this.userForm.get('age')?.value,
        sex: this.userForm.get('sex')?.value,
        document: this.userForm.get('document')?.value,
        status: this.userForm.get('status')?.value,
        address,
      };

      const formData = new FormData();
      formData.append('userData', JSON.stringify(userData));  

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
        console.log('Arquivo anexado ao FormData:', this.selectedFile.name);
      } else {
        console.warn('Nenhum arquivo anexado ao FormData.');
      }

      this.userService.uploadUserWithExcel(formData).subscribe(
        (response) => {
          console.log('Usuário e arquivo enviados com sucesso:', response);
          this.userForm.reset();
          this.userForm.markAsPristine();
          this.userForm.markAsUntouched();
          this.getUsers();
          this.clearAddress();
        },
        (error) => {
          console.error('Erro ao enviar usuário e arquivo:', error);
        }
      );
    } else {
      console.error('Formulário inválido:', this.userForm.value);
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

  onFileChange(event: any): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];  
      console.log('Arquivo selecionado:', this.selectedFile);

      const addressGroup = this.userForm.get('address') as FormGroup;
      Object.keys(addressGroup.controls).forEach((key) => {
        const control = addressGroup.get(key);
        control?.disable(); 
        control?.clearValidators();  
        control?.updateValueAndValidity();  
      });
    } else {
      console.error('Nenhum arquivo selecionado.');
      this.selectedFile = null;  
    }
  }

  clearAddress(): void {
    const fileInput = document.getElementById('excelFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  
    }

    this.selectedFile = null;
    this.enableAddressFields();  
  }

  enableAddressFields(): void {
    const addressGroup = this.userForm.get('address') as FormGroup;

    
    Object.keys(addressGroup.controls).forEach((key) => {
      const control = addressGroup.get(key);
      control?.enable();  
      control?.setValidators([Validators.required]);
      control?.updateValueAndValidity();
    });

    console.log('Campos de endereço reativados.');
  }
}
