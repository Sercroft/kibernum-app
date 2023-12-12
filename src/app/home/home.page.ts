import { Component, EventEmitter, Output } from '@angular/core';
import { DataApi } from '../interfaces/data-api.interface';
import { ApiService } from '../services/api/api-service.service';
import { ResponseEmitter } from '../interfaces/user.interface';

interface Options {
  [key: string]: (() => any) | undefined;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  id: number = 0;

  dataApi : DataApi = {
    id                    : 0,
    fullname              : '',
    type_identification   : '',
    num_identification    : '',
    gender                : '',
    address               : '',
    phone                 : ''
  };

  views = {
    generic_cardview : true,
    user_home: false
  };


  constructor(private apiSrv: ApiService) {}

  recieveData(res: ResponseEmitter){
    const typeRequest = res.type_request;
    const data = res.data;

    const options: Options = {
      'create': () => this.createUser(data),
    };

    return options[typeRequest]?.();
  }

  async createUser(data: any){
    var idReponse: number = 0;

    this.apiSrv.createUser(this.formattedData(data)).subscribe(response => {
      this.id = response.id;
      idReponse = response.id;
      console.log(`RESPONSE CREATE USER: ${JSON.stringify(response.id)}`);
    });
    console.log(`ID CREATE USER: ${idReponse}`);


    this.showHideViews({user_home: true});
  }



  formattedData(data: any){
    const firstname = data.firstname.trim();
    const surname   = data.surname.trim();
    const fullname  = firstname + ' ' + surname;

    return this.dataApi = {
      id                    : data.id,
      fullname              : fullname,
      type_identification   : data.type_identification,
      num_identification    : data.num_identification.toString(),
      gender                : data.gender,
      address               : data.address,
      phone                 : data.phone.toString()
    };
  }

  showHideViews({ generic_cardview = false, user_home = false}){
    return this.views = {
      generic_cardview  : generic_cardview,
      user_home         : user_home
    };
  }

}
