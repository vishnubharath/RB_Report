import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'fileupload-dialog',
  templateUrl: 'fileupload-dialog.html',
})
export class FileUploadDialog {

  filePath: string;
  file: File;

  constructor(
    public dialogRef: MatDialogRef<FileUploadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  updateFilePath(event) {
    this.filePath = event.target.value;
    this.file = event.target.files[0];
  }

}