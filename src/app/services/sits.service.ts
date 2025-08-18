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

  getSites(): Observable<Sits[]> {
    return this.http.get<Sits[]>(this.apiUrl);
  }

  createSite(site: CreateSiteModel): Observable<Sits> {
    return this.http.post<Sits>(this.apiUrl, site);
  }

  updateSite(id: number, site: Partial<Sits>): Observable<Sits> {
    return this.http.put<Sits>(`${this.apiUrl}/${id}`, site);
  }

  deleteSite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addUserToSite(siteId: number, userId: number): Observable<Sits> {
    return this.http.post<Sits>(`${this.apiUrl}/${siteId}/add-user/${userId}`, {});
  }

  removeUserFromSite(siteId: number, userId: number): Observable<Sits> {
    return this.http.delete<Sits>(`${this.apiUrl}/${siteId}/remove-user/${userId}`);
  }
}