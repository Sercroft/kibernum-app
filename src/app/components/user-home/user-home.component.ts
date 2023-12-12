import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../services/api/api-service.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHomeComponent implements OnInit{
  @Input() data: number = 0;

  @ViewChild('map') mapRef!: ElementRef;

  constructor(private apiSrv: ApiService) { }

  ngOnInit(): void {
    console.log('ID:', this.data);
    //this.getUser();
  }

  ionViewDidEnter(){
    this.createaMap();
  }


  async createaMap(){
    map: google.maps.Map;


   /*
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      config: {
        center:{
          lat: 33.6,
          lng: -117.9
        },
        zoom: 8
      },
    });
    */
  }

  getUser(id: number){

    return this.apiSrv.getUser(id).subscribe(response => {
      console.log(`RESPONSE GETUSER: ${response}`);
    });
  }

}
