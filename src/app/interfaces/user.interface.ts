export interface User{
  id                    : number;
  fullname              : string;
  type_identification   : string;
  num_identification    : string;
  gender                : string;
  address               : string;
  phone                 : string;
}

export interface ResponseEmitter{
  from          : string;
  data          : string[];
  type_request  : string;
}
