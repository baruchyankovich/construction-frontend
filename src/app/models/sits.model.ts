export interface Sites {
    id: number;
    location: string;
    usersId: number[];
  }
  export interface CreateSiteModel {
    location: string;
    usersId: number[];
  }