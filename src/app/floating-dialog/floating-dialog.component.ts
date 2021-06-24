import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PinDialogService } from '../services/pin-dialog-service.service';
import { FloatingDialogData, PinPosition } from '../models/floatingDialogData.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export const TOP_LEFT = { top: '0px', left: '0px' };
export const TOP_RIGHT = { top: '0px', right: '0px' };
export const BOTTOM_LEFT = { bottom: '0px', left: '0px' };
export const BOTTOM_RIGHT = { bottom: '0px', right: '0px' };
export const ANNOUNCE_TIME = 1000;

@Component({
  selector: 'app-floating-dialog',
  templateUrl: './floating-dialog.component.html',
  styleUrls: ['./floating-dialog.component.scss']
})
export class FloatingDialogComponent implements OnInit, AfterViewInit {

  public id = '';
  public isPinned = false;
  private cdkGlobalOverlay: any;
  private pinPosition: PinPosition = TOP_LEFT;
  public minimized = false;
  public fullScreen = false;
  @ViewChild('dialogContainer') dialogContainer: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: FloatingDialogData,
    private dialogRef: MatDialogRef<any>,
    private pinDialogSvc: PinDialogService,
    private liveAnnouncer: LiveAnnouncer
  ) {
  }



  ngOnInit(): void {
    this.dialogRef.updatePosition({ top: '0px' });
    this.id = this.data.dialogId ? this.data.dialogId : `${new Date().getTime()}`;
    if (this.data.pinPosition) {
      this.pinPosition = this.data.pinPosition;
    }
    this.pinDialogSvc.pinnedDialog$.subscribe((dialogId) => {
      if (dialogId === this.id) {
        this.isPinned = true;
        this.setPinPosition();
      } else if (this.isPinned) {
        this.isPinned = false;
        this.setUnPinPosition();
      }
    });
  }

  private setPinPosition(): void {
    this.dialogRef.addPanelClass('pinned');
    this.dialogRef.updatePosition({ ...this.pinPosition });
    this.liveAnnouncer.announce('dialog pinned');
    this.focusFirstButton();
  }

  private setUnPinPosition(): void {
    this.dialogRef.removePanelClass('pinned');
    if (this.cdkGlobalOverlay) {
      // setting the z-index of the overly bake to 1000.
      const parentStlyle = this.cdkGlobalOverlay.attributes.style.value;
      this.cdkGlobalOverlay.setAttribute('style', parentStlyle + `z-index: 1000`);
    }
    // updating the position to center
    this.dialogRef.updatePosition({ top: '0px' });
    this.liveAnnouncer.announce('dialog unpinned');
    this.focusFirstButton();
  }

  public pinDialog(event: any): void {
    // setting the overlay z-index to lower than other overlays.
    const dragRootElement = event.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement;
    this.cdkGlobalOverlay = dragRootElement.parentElement.parentElement;
    const parentStlyle = this.cdkGlobalOverlay.attributes.style.value;
    this.cdkGlobalOverlay.setAttribute('style', parentStlyle + `z-index: 999`);
    this.pinDialogSvc.pinDialog(this.id);
  }

  public unPinDialog(): void {
    this.pinDialogSvc.unPinDialog(this.id);
  }

  public minimize(): void {
    this.dialogRef.addPanelClass('minimized');
    this.minimized = true;
    this.liveAnnouncer.announce('dialog minimized');
    this.focusFirstButton();
  }

  public restore(event: any): void {
    if (this.minimized) {
      this.dialogRef.removePanelClass('minimized');
      this.minimized = false;
    }
    if (this.fullScreen) {
      this.dialogRef.removePanelClass('fullscreen');
      this.fullScreen = false;
    }
    if (this.isPinned) {
      this.dialogRef.updatePosition(this.pinPosition);
      this.liveAnnouncer.announce('dialog restored');
      this.focusFirstButton();
      return;
    }
    this.dialogRef.updatePosition({ top: '0px' });
    this.liveAnnouncer.announce('dialog restored');
    this.focusFirstButton();
  }

  public enableFullScreen(): void {
    if (this.cdkGlobalOverlay) {
      // setting the z-index of the overly bake to 1000.
      const parentStlyle = this.cdkGlobalOverlay.attributes.style.value;
      this.cdkGlobalOverlay.setAttribute('style', parentStlyle + `z-index: 1000`);
    }
    this.dialogRef.addPanelClass('fullscreen');
    this.fullScreen = true;
    this.liveAnnouncer.announce('dialog maximized');
    this.focusFirstButton();
  }

  public close(): void {
    this.liveAnnouncer.announce('dialog closed');
    this.dialogRef.close();
  }

  private focusFirstButton(): void {
    setTimeout(() => {
      this.dialogContainer.nativeElement.firstChild.lastChild.children[0].focus();
    }, ANNOUNCE_TIME + 100);
  }

  ngAfterViewInit(): void {
    this.dialogContainer.nativeElement.parentElement.parentElement.setAttribute('role', 'alertdialog');
  }
}



