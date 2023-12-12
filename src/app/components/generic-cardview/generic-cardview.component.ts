import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { ApiService } from 'src/app/services/api/api-service.service';
import { ToastService } from 'src/app/services/utilities/toast.service';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-generic-cardview',
  templateUrl: './generic-cardview.component.html',
  styleUrls: ['./generic-cardview.component.scss'],
})
export class GenericCardviewComponent  implements OnInit {
  @Output()  emitter = new EventEmitter();

  address: string = '';
  isLoading : boolean = false;

  listIdentifications = [
    {value: 'CC', identfication: 'Cédula de Ciudadanía'},
    {value: 'TI', identfication: 'Tarjeta de Identidad'},
    {value: 'PA', identfication: 'Pasaporte'},
    {value: 'CN', identfication: 'Contraseña'}
  ];


  // Form
  formCardview: FormGroup;

  constructor(private locationAccuracy: LocationAccuracy, private nativeGeocoder: NativeGeocoder, private formBuilder: FormBuilder, private toast: ToastService, private apiSrv: ApiService){
    this.formCardview = this.formBuilder.group({
      type_identification : ['', Validators.required],
      num_identification  : ['', Validators.required],
      firstname           : ['', Validators.required],
      surname             : ['', Validators.required],
      gender              : ['', Validators.required],
      address             : ['', Validators.required],
      phone               : ['', Validators.required],
    });

  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(){
  }

  // Type -> 0: type identification | 1: gender
  selectOption(response: any, type: number){
    console.log(response.detail.value);

    if(type === 0){
      this.formCardview.patchValue({
        type_identification: response.detail.value,
      });
    }else{
      this.formCardview.patchValue({
        gender: response.detail.value,
      });
    }
  }


  async getLocation(){
   try{
    const permissionStatus = await Geolocation.checkPermissions();
    const options: PositionOptions = {
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: true
    };

    console.log(`PERMISSION STATUS: ${JSON.stringify(permissionStatus)}`);

    if(permissionStatus.location !== 'granted'){
      const requestStatus = await Geolocation.requestPermissions();

      if(requestStatus.location != 'granted'){
        return null;
      }
    }

    if(Capacitor.getPlatform() === 'android'){
      this.enableGps();
    }

    this.isLoading = true;

    const pos = await Geolocation.getCurrentPosition(options);
    this.getAddress(pos.coords.latitude, pos.coords.longitude);

    console.log(pos);
    return pos;

   }catch(error: any){
    if(error.message === 'Location services are not enabled'){
      await this.openSettings();
    }
    console.log(error.message);
    return { error: `${error}`}
   }
  }

  openSettings(app = false){
    console.log('Open settings...');
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });
  }

  async enableGps(){
    const canRequest = await this.locationAccuracy.canRequest();

    if(canRequest){
      await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
    }

  }

  getAddress(lat: number, lon: number){
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lat, lon, options)
    .then((result: NativeGeocoderResult[]) => {
      console.log(JSON.stringify(result[0]));
      this.address = result[0].thoroughfare + ' ' + result[0].subThoroughfare;
    })
    .catch((error: any) => console.log(error));

    this.isLoading = false;
  }


  sendData(){
    this.formCardview.patchValue({
      address: this.address
    });

    console.log(this.formCardview.value);
    if(!this.formCardview.valid){
      this.toast.presentToast('Todos los campos son obligatorios.', 1500);
      return;
    }

    this.emitter.emit({source: 'generic-cardview', data: this.formCardview.value, type_request: 'create'});
    this.toast.presentToast('¡Te has registrado!', 1500);
  }
}
