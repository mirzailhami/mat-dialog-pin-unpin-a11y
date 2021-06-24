import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PinDialogService {

  private pinnedDialog$$ = new BehaviorSubject<string>('');

  public get pinnedDialog$(): Observable<string> {
    return this.pinnedDialog$$.asObservable();
  }

  public pinDialog(dialogId: string): void {
    this.pinnedDialog$$.next(dialogId);
  }

  public unPinDialog(dialogId: string): void {
    if (this.pinnedDialog$$.value === dialogId) {
      this.pinnedDialog$$.next('');
    }
  }
}
