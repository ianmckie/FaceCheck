import { Component, OnInit, HostListener } from '@angular/core';
import { ViewChild } from '@angular/core'
import { HttpModule } from '@angular/http';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-face-detect',
  templateUrl: './face-detect.component.html',
  styleUrls: ['./face-detect.component.scss']
})
export class FaceDetectComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  
  url:string = ''
  fileLabel:string = '';

  videoEl:HTMLVideoElement;

  constructor(private dataservice:DataService) {}

  ngOnInit(){
    //this.loadWebcamVideo();
  }


  /*
   * Get an image from the webcam
   * 
   */

  loadWebcamVideo(){
    let videoEl = document.querySelector('video') ;
    
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoEl.src = window.URL.createObjectURL(stream);
        videoEl.play();
        videoEl.addEventListener('click', () => {
            this.takeSnapshot(videoEl);
        });
      });
    }
  }

  /*
   * Take a snapshot of the video
   * 
   */

  takeSnapshot(videoEl:HTMLVideoElement) {
    var img = document.querySelector('img') || document.createElement('img');
    var context, canvas;

    canvas = canvas || document.createElement('canvas');
    canvas.width = videoEl.width;
    canvas.height = videoEl.height;

    // Add video to canvas element 
    context = canvas.getContext('2d');
    context.drawImage(videoEl, 0, 0, videoEl.width, videoEl.height);

    this.sendImage(canvas.toDataURL()); // Send base64
  }


  /*
   * Get an image from the file upload and bade is to send image
   * 
   */

  getUploadedImage(){
    let fileBrowser = this.fileInput.nativeElement,
        reader = new FileReader();

    if (fileBrowser.files && fileBrowser.files[0]) {
      this.fileLabel = fileBrowser.files[0].name;
      reader.onload = (event:any) => {
        // Contact Face++ API to detect face
        this.sendImage(event.target.result);
      }
  
      reader.readAsDataURL(fileBrowser.files[0]);
    }
  }


  /*
   * Send an image detectFace
   * 
   * @param url:string the base64 image 
   */

  sendImage(url:string){
    this.url = url;
    this.dataservice.detectFace(url).subscribe((response) => {
      console.log(response)
    });  
  }
}
