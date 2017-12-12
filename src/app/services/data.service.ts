import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  private key:string = 'fsIx4uFA7fmvKaHfy5A6DMWQE3jbeVnj';
  private secret:string = 'sJJuBgwb7Er3_ZHHkWZJK763tt3_MpLq';

  url:string = 'https://api-us.faceplusplus.com/facepp/v3/detect';

  constructor(public http:Http) { 
    console.log('Connected');
  }

  detectFace(image){
    let formData: FormData = new FormData(); 
    formData.append('api_key', this.key); 
    formData.append('api_secret', this.secret); 
    formData.append('image_base64', image.split(',')[1]);
    formData.append('return_attributes', 'gender,age,smiling,headpose,facequality,blur,eyestatus,emotion,ethnicity,beauty,mouthstatus,eyegaze,skinstatus');

    return this.http.post(this.url,formData).map(res => res.json());
  }

}
