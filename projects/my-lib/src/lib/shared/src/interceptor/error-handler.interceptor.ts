import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NzAlertDialogService } from '@zak-lib/ui-library/elements/ui/alert-dialog';

export const NzHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertDialogService = inject(NzAlertDialogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleHttpError(error, alertDialogService);
      return throwError(() => error);
    }),
  );
};

function handleHttpError(error: HttpErrorResponse, alertDialogService: NzAlertDialogService): void {
  let msg: string | null = '';
  let title = 'Error';
  if (error.error instanceof ErrorEvent) {
    msg = error.error.message;
  } else {
    msg = error.error || error.message || error.error.message || null;

    if (!msg) {
      switch (error.status) {
        case 0:
          msg = 'Network error / CORS issue';
          break;

        case 400:
          msg = 'Bad request';
          break;

        case 401:
          msg = 'Unauthorized access';
          break;

        case 403:
          msg = 'Forbidden';
          break;

        case 404:
          msg = 'API not found';
          break;

        case 422:
          msg = 'Validation error';
          break;

        case 500:
          msg = 'Internal server error';
          break;

        default:
          msg = `HTTP Error ${error.status}`;
      }
    }
  }
  alertDialogService.openDialog({
    title: title,
    message: msg,
    type: 'error',
  });
}
