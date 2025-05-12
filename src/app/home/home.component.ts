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
        this.userForm.reset({
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
      });
          console.log('Dados enviados:', userData); // Verifique os dados no console

      });
      this.userForm.markAsPristine();
      this.userForm.markAsUntouched();
    } else {
      console.log('Form is invalid', userData);
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
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length !== 1) {
      console.error('Cannot use multiple files');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          if (data.length > 1) {
      const [header, ...rows] = data;

      // Verifique se os valores estão presentes e no formato correto
      const address: string[] = rows[0] as string[];
      const street = address[0] || '';
      const number = address[1] || '';
      const block = address[2] || '';
      const apartment = address[3] || '';
      const country = address[4] || '';
      const city = address[5] || '';
      const district = address[6] || '';

      this.userForm.patchValue({
        address: {
          street,
          number,
          block,
          apartment,
          country,
          city,
          district,
        },
      });
      const addressGroup = this.userForm.get(['address']) as FormGroup;
      Object.keys(addressGroup.controls).forEach((key) => {
        const control = addressGroup.get(key);
        control?.markAsDirty();
        control?.updateValueAndValidity();
      });
    }
  };
    reader.readAsBinaryString(target.files[0]);
  }

  clearAddress(): void {
    const fileInput = document.getElementById('excelFile') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = ''; // Redefinir o valor do campo de arquivo
  }
}
}
