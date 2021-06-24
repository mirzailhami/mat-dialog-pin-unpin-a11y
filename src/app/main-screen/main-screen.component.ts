import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FloatingDialogComponent, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT } from '../floating-dialog/floating-dialog.component';
import { FloatingDialogData } from '../models/floatingDialogData.model';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent {

  pinPositions = [
    { name: 'Top Left', value: TOP_LEFT },
    { name: 'Top Right', value: TOP_RIGHT },
    { name: 'Bottom Right', value: BOTTOM_RIGHT },
    { name: 'Bottom Left', value: BOTTOM_LEFT }
  ];

  position = this.pinPositions[0].value;
  totalOpenedDialog = 0;

  constructor(private dialog: MatDialog) {
  }

  openDialog(): void {
    const floatingDialogData: FloatingDialogData = {
      dialogId: `${new Date().getTime()}`,
      pinPosition: this.position,
    };
    this.dialog.open(FloatingDialogComponent, {
      maxHeight: '100%',
      maxWidth: '100%',
      width: '300px',
      data: floatingDialogData,
      panelClass: ['dialog-window'],
      autoFocus: true,
      hasBackdrop: false,
      restoreFocus: true,
    });
  }

}
