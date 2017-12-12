import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core'
import { HttpModule } from '@angular/http';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-face-detect',
  templateUrl: './face-detect.component.html',
  styleUrls: ['./face-detect.component.scss']
})
export class FaceDetectComponent implements OnInit {

  @ViewChild("fileInput") fileInput;

  url:string = '';

  constructor(private dataservice:DataService) {}
  
  ngOnInit() {
  }

  upload() {
    let fileBrowser = this.fileInput.nativeElement,
        reader = new FileReader();

    if (fileBrowser.files && fileBrowser.files[0]) {
          reader.onload = (event:any) => {
            // Contact Face++ API to detect face
            this.url = event.target.result;
            this.dataservice.detectFace(event.target.result).subscribe((response) => {
              console.log(response)
            });
          }
      
          reader.readAsDataURL(fileBrowser.files[0]);
    }
  }

}
