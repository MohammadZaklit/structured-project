import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../../admin-generator/src/app/environments/environment';
import { GenericRecord } from '@zak-lib/ui-library/shared';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- Helper to build request options (e.g., headers) ---
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Add any authorization headers here if needed, e.g.:
        // 'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }),
    };
  }

  // --- POST (Create) ---
  /**
   * Creates a new record for a given module.
   * @param moduleName The name of the module (e.g., 'users', 'products', 'staticUsers').
   * @param payload The data for the new record.
   * @returns An Observable of the created record.
   */
  create<T extends GenericRecord>(moduleName: string, payload: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${moduleName}`, payload, this.getHttpOptions());
  }

  // --- GET (Retrieve) ---
  /**
   * Retrieves records for a given module, with optional search parameters.
   * @param moduleName The name of the module.
   * @param searchParams Optional object for query parameters (e.g., { firstName: 'John', age: 30 }).
   * @returns An Observable of an array of records.
   */
  getAll<T extends GenericRecord>(
    moduleName: string,
    searchParams?: { [key: string]: any }
  ): Observable<T[]> {
    let params = new HttpParams();
    if (searchParams) {
      for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key)) {
          params = params.append(key, searchParams[key].toString());
        }
      }
    }
    return this.http.get<T[]>(`${this.apiUrl}/${moduleName}`, {
      params,
      headers: this.getHttpOptions().headers,
    });
  }

  /**
   * Retrieves a single record by its ID for a given module.
   * This assumes your Node.js GET /api/:moduleName endpoint can also handle /api/:moduleName/:id
   * You might need a separate endpoint in Node.js for this if not.
   * For now, we'll assume `getAll` can handle `id` as a search param, or your Node.js supports `/api/:moduleName/:id`.
   * Given your current Node.js `getRecords` function expects `searchParams`, this method will utilize that.
   * If you prefer a dedicated `/api/:moduleName/:id` endpoint on Node.js, you'd adjust the `getAll` route accordingly.
   *
   * @param moduleName The name of the module.
   * @param id The ID of the record to retrieve.
   * @returns An Observable of the single record.
   */
  getById<T extends GenericRecord>(moduleName: string, id: string | number): Observable<T> {
    // Assuming your Node.js GET /api/:moduleName endpoint handles `id` as a search parameter
    // Or you can directly call /api/:moduleName/:id if your backend supports it.
    // For now, let's use the search parameter approach as per `getRecords` in Node.js.
    // If your backend specifically has /api/:moduleName/:id route, change this:
    // return this.http.get<T>(`${this.apiUrl}/${moduleName}/${id}`, this.getHttpOptions());

    return this.http
      .get<T[]>(`${this.apiUrl}/${moduleName}`, {
        params: new HttpParams().set('id', id.toString()),
        headers: this.getHttpOptions().headers,
      })
      .pipe(
        // Assuming the backend returns an array and we want the first item
        // You might want to add error handling if no item is found
        map((records) => records[0])
      );
  }

  // --- PUT (Update) ---
  /**
   * Updates an existing record for a given module.
   * @param moduleName The name of the module.
   * @param id The ID of the record to update.
   * @param payload The updated data for the record.
   * @returns An Observable of the updated record.
   */
  update<T extends GenericRecord>(
    moduleName: string,
    id: string | number,
    payload: T
  ): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${moduleName}/${id}`, payload, this.getHttpOptions());
  }

  // --- DELETE ---
  /**
   * Deletes a record by its ID for a given module.
   * @param moduleName The name of the module.
   * @param id The ID of the record to delete.
   * @returns An Observable of the deletion result (often an empty object or a message).
   */
  delete(moduleName: string, id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${moduleName}/${id}`, this.getHttpOptions());
  }
}
