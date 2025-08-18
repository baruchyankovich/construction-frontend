export interface Sits {
    id: number;
    location: string;
    usersId: number[];
  }
  export interface CreateSiteModel {
    location: string;
    usersId: number[];
  }