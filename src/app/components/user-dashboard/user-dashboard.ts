import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
 
import { OrdersService } from '../../services/orders.service';
import { Sits } from '../../models/sits.model';
import { Order, CreateOrderModel } from '../../models/order.model';
import { SitesService } from '../../services/sits.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private sitesService = inject(SitesService);
  private ordersService = inject(OrdersService);
  private fb = inject(FormBuilder);

  currentUser = this.authService.getCurrentUser();
  userSites: Sits[] = [];
  userOrders: Order[] = [];
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  orderForm: FormGroup = this.fb.group({
    siteId: ['', [Validators.required]],
    product: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.showMessage('Please login to access this page', 'error');
      return;
    }
    this.loadUserSites();
    this.loadUserOrders();
  }

  loadUserSites() {
    this.sitesService.getSites().subscribe({
      next: (sites) => {
        this.userSites = sites;
      },
      error: (error) => {
        this.showMessage('Error loading sites', 'error');
        console.error('Error loading sites:', error);
      }
    });
  }

  loadUserOrders() {
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.userOrders = orders.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },
      error: (error) => {
        this.showMessage('Error loading orders', 'error');
        console.error('Error loading orders:', error);
      }
    });
  }

  onSubmitOrder() {
    if (this.orderForm.valid) {
      this.isLoading = true;
      
      const orderData: CreateOrderModel = {
        siteId: parseInt(this.orderForm.value.siteId),
        product: this.orderForm.value.product,
        quantity: this.orderForm.value.quantity
      };

      this.ordersService.createOrder(orderData).subscribe({
        next: (order) => {
          this.showMessage('Order submitted successfully', 'success');
          this.loadUserOrders();
          this.orderForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          this.showMessage('Error submitting order', 'error');
          console.error('Error creating order:', error);
          this.isLoading = false;
        }
      });
    }
  }

  getSiteName(siteId: number): string {
    const site = this.userSites.find(s => s.id === siteId);
    return site ? site.location : `Site ${siteId}`;
  }

  getTotalOrders(): number {
    return this.userOrders.length;
  }

  getPendingOrders(): number {
    return this.userOrders.filter(order => !order.status).length;
  }

  getCompletedOrders(): number {
    return this.userOrders.filter(order => order.status).length;
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