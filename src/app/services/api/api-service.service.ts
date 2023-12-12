import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService{

  private readonly url: string = 'https://api-rest-nodejs-mysql-production-8a0b.up.railway.app/api/users';


  constructor(private http: HttpClient){}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

   //Handle API Error
   handleError(error: HttpErrorResponse){

    if(error.error instanceof ErrorEvent){
      console.error('An error occurred:', error.error.message);
    }else{
      console.error(`API returned code ${error.status} | Body was: ${JSON.stringify(error.error)}`);
    }
    return throwError('Something bad happened; please, try again!');
  };

  createUser(data: any): Observable<User>{
    console.log(`DATA CREATE USER: ${JSON.stringify(data)}`);

    return this.http
    .post<User>(this.url, JSON.stringify(data), this.httpOptions)
    .pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getUser(id: number): Observable<User>{
    return this.http
    .get<User>(this.url + '/' + id)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<User>{
    return this.http
    .get<User>(this.url)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateUser(id: number, data: any): Observable<User>{
    return this.http
    .patch<User>(this.url + '/' + id, JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  deleteUser(id: number){
    return this.http
    .delete<User>(this.url + '/' + id, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }


}
