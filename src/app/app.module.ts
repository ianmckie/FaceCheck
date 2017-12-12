import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { FaceDetectComponent } from './components/face-detect/face-detect.component';


@NgModule({
  declarations: [
    AppComponent,
    FaceDetectComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    DataService  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
