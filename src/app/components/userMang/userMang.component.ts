import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { SitesService } from '../../services/sits.service'; 
import { AuthService } from '../../services/auth.service';
import { User, CreateUserModel, UpdateUserModel } from '../../models/user.model';
import { Sits } from '../../models/sits.model';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private usersService = inject(UsersService);
  private sitesService = inject(SitesService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  users: User[] = [];
  sites: Sits[] = [];
  selectedSiteIds: number[] = [];
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  editingUser: User | null = null;
  currentUserId = this.authService.getUserId();

  userForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    manager: [false]
  });

  editForm: FormGroup = this.fb.group({
    username: ['', [Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    password: ['', [Validators.minLength(6), Validators.maxLength(100)]],
    manager: [false]
  });

  ngOnInit() {
    if (!this.authService.isManager()) {
      this.showMessage("yow can't do it if you dont a manger", 'error');
      return;
    }
    this.loadUsers();
    this.loadSites();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.showMessage("Error loading users", 'error');
        console.error('Error loading users:', error);
      }
    });
  }

  loadSites() {
    this.sitesService.getSites().subscribe({
      next: (sites) => {
        this.sites = sites;
      },
      error: (error) => {
        this.showMessage("Error loading sites", 'error');
        console.error('Error loading sites:', error);
      }
    });
  }

  onSiteSelectionChange(event: any) {
    const siteId = parseInt(event.target.value);
    if (event.target.checked) {
      if (!this.selectedSiteIds.includes(siteId)) {
        this.selectedSiteIds.push(siteId);
      }
    } else {
      this.selectedSiteIds = this.selectedSiteIds.filter(id => id !== siteId);
    }
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      this.isLoading = true;
      const userData: CreateUserModel = {
        ...this.userForm.value
      };

      this.usersService.createUser(userData).subscribe({
        next: (user) => {
          this.showMessage('creating user success', 'success');
          this.loadUsers();
          this.userForm.reset();
          this.selectedSiteIds = [];
          
          if (this.selectedSiteIds.length > 0) {
            this.assignSitesToUser(user.id, this.selectedSiteIds);
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          this.showMessage('Error creating user', 'error');
          console.error('Error creating user:', error);
          this.isLoading = false;
        }
      });
    }
  }

  assignSitesToUser(userId: number, siteIds: number[]) {
    siteIds.forEach(siteId => {
      this.sitesService.addUserToSite(siteId, userId).subscribe({
        next: () => {
            this.showMessage(`the youser is add to site${this.getSiteName(siteId)}`, 'success');
        },
        error: (error) => {
          console.error('Error assigning site to user:', error);
        }
      });
    });
  }

  editUser(user: User) {
    this.editingUser = user;
    this.editForm.patchValue({
      username: user.username,
      email: user.email,
      password: '',
      manager: user.manager
    });
  }

  saveEditUser() {
    if (this.editForm.valid && this.editingUser) {
      const updateData: UpdateUserModel = {};
      
      if (this.editForm.value.username) updateData.username = this.editForm.value.username;
      if (this.editForm.value.email) updateData.email = this.editForm.value.email;
      if (this.editForm.value.password) updateData.password = this.editForm.value.password;
      if (this.editForm.value.manager !== this.editingUser.manager) updateData.manager = this.editForm.value.manager;

      this.usersService.updateUser(this.editingUser.id, updateData).subscribe({
        next: () => {
          this.showMessage('user updata is seccess', 'success');
          this.loadUsers();
          this.cancelEdit();
        },
        error: (error) => {
          this.showMessage(`error updating user: ${error.error?.message }`, 'error');
          console.error('Error updating user:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.editingUser = null;
    this.editForm.reset();
  }

  deleteUser(userId: number) {
    if (confirm('are you sure you want to delete this user?')) {
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
            this.showMessage('the delete this user is success', 'success');
          this.loadUsers();
        },
        error: (error) => {
          this.showMessage('Error deleting user:', 'error');
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  getSiteName(siteId: number): string {
    const site = this.sites.find(s => s.id === siteId);
    return site ? site.location : `site ${siteId}`;
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  clearMessage() {
    this.message = '';
  }
}