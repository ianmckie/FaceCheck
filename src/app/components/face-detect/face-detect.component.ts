import { Component, OnInit, HostListener } from '@angular/core';
import { ViewChild } from '@angular/core'
import { HttpModule } from '@angular/http';

import { DataService } from '../../services/data.service';

// Declare jQuery
declare var jquery:any;
declare var $ :any;

// Create error message type
interface errorMessage {
  title: string;
  message: string;
}

@Component({
  selector: 'app-face-detect',
  templateUrl: './face-detect.component.html',
  styleUrls: ['./face-detect.component.scss']
})
export class FaceDetectComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  @ViewChild('videoElement') videoElement;
  
  url:string = ''
  fileLabel:string = '';
  results:string = '';

  videoEl:HTMLVideoElement;
  
  videoEnabled:boolean = true;

  error:errorMessage = {
    title : 'Ooops',
    message : 'Looks like somethin happened'
  }

 
  constructor(private dataservice:DataService) {}

  ngOnInit(){}


  /*
   * Get an image from the webcam
   * 
   */

  loadWebcamVideo(){
    let videoEl =  this.videoElement.nativeElement,
        capture = document.getElementById('capture');
    
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoEl.src = window.URL.createObjectURL(stream);
        videoEl.play();
        capture.addEventListener('click', () => {
            this.takeSnapshot(videoEl);
            
            // Hide video
            $('.video-popup').modal('hide');
        })
      })
      .catch(err => {
        this.videoEnabled = false;
        if(err.name === 'NotFoundError' || err.name === "NotAllowedError"){
          this.error.title = 'Authorisation Issue';
          this.error.message = 'You have to allow the site to use you webcam :P' 
        }
        else if(err.name === 'NotReadableError'){
          this.error.title = 'No Webcam Found';
          this.error.message = 'To use this feature you need to have access to a webcam' 
        }
      });
    }
  }

  /*
   * Take a snapshot of the video
   * 
   */

  takeSnapshot(videoEl:HTMLVideoElement) {
    let context, canvas;

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
        $('.image-popup').modal('show');
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
      let face = response.faces[0].attributes,
          gender = face.gender.value,
          happiness = face.emotion.happiness || 0;
          
      if(response.faces.length === 0){
        this.results = 'No face detected try another image';
      }
      else{
        this.results = 'Faces detected '+response.faces.length+' '+'Your a '+gender;

        if(happiness < 50 || happiness === 0){
          this.results += 'You don\'t look happy, maybe you should try smiling';
        }
      }
    });  
  }
}
