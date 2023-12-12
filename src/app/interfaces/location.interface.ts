export interface InfoLocation{
  latitude                : number;
  longitude               : number;
  countryCode             : string;
  countryName             : string;
  postalCode              : string;
  administrativeArea      : string;
  subAdministrativeArea   : string;
  locality                : string;
  subLocality             : string;
  thoroughfare            : string;
  subThoroughfare         : string;
  areasOfInterest         : string[];
  addressLines            : string[];
}

export interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}
