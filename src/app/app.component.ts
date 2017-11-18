import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Http, Response } from '@angular/http';
import { Sort } from '@angular/material';

import { FileUploadDialog } from './fileupload-dialog.component'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {

  file: File;
  fileContent: string;
  csv_data = [];
  sortedData = [];

  // Used to call the dialog window for file selection and read the response
  upload() {

    let dialogRef = this.dialog.open(FileUploadDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {

      this.file = result;

      var myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        this.fileContent = myReader.result;
        this.parseCSV();
      }

      if (this.file) myReader.readAsText(this.file);

    });

  }

  // Used to parse the csv file
  parseCSV() {

    let allTextLines = this.fileContent.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');
    let lines = [];

    for (let i = 1; i < allTextLines.length; i++) {
      // split content based on comma
      let data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        let tarr = [];
        for (let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        lines.push(tarr);
      }
    }

    for (let line of lines) {
      const row = { fname: JSON.parse(line[0]), sname: JSON.parse(line[1]), issueCount: JSON.parse(line[2]), dob: new Date(JSON.parse(line[3])), filteredOut: false };
      this.csv_data.push(row)
    }
    this.sortedData = this.csv_data.slice();

  }

  // Filter for issue count
  filterIssueCount(event) {
    this.sortedData.forEach(val => { 
      if ((val.issueCount + '').includes(event.target.value)) {
       val.filteredOut = false; 
      }else{
        val.filteredOut = true; 
      }
    });
  }

  // Opens New Tab
  newWindow() {
    window.open(location.href);
  }

  // clears the table
  clear(){
    this.csv_data = [];
    this.sortedData = [];
  }

  constructor(public dialog: MatDialog, public http: Http) {
    this.sortedData = this.csv_data.slice();
  }

  // Material Sort Meathod
  sortData(sort: Sort) {
    const data = this.csv_data.slice();
    if (!sort.active || sort.direction == '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'fname': return compare(a.fname, b.fname, isAsc);
        case 'sname': return compare(+a.sname, +b.sname, isAsc);
        case 'issueCount': return compare(+a.issueCount, +b.issueCount, isAsc);
        case 'dob': return compare(+a.dob, +b.dob, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}