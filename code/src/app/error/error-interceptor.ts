import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error.component';

@Injectable() // required when injecting a service to a service
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // use pipe to add the catchError operator to the stream

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = error.message || 'An unknown error ocurred!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        return throwError(error); // return obervable to the stream
      })
    );
  }
}
