import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sits, CreateSiteModel } from '../models/sits.model';

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/Sites`;

  getSites(): Observable<Sites[]> {
    return this.http.get<Sites[]>(this.apiUrl);
  }

  createSite(site: CreateSiteModel): Observable<Sites> {
    return this.http.post<Sites>(this.apiUrl, site);
  }

  updateSite(id: number, site: Partial<Sites>): Observable<Sites> {
    return this.http.put<Sites>(`${this.apiUrl}/${id}`, site);
  }

  deleteSite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addUserToSite(siteId: number, userId: number): Observable<Sites> {
    return this.http.post<Sites>(`${this.apiUrl}/${siteId}/add-user/${userId}`, {});
  }

  removeUserFromSite(siteId: number, userId: number): Observable<Sites> {
    return this.http.delete<Sites>(`${this.apiUrl}/${siteId}/remove-user/${userId}`);
  }
}