export interface User {
    id: number;
    username: string;
    email: string;
    manager: boolean;
    sitesId: number[];
  }
  
  export interface CreateUserModel {
    username: string;
    email: string;
    password: string;
    manager: boolean;
  }
  
  export interface UpdateUserModel {
    username?: string;
    email?: string;
    password?: string;
    manager?: boolean;
  }
  
  export interface UpdateProfileModel {
    username?: string;
    email?: string;
    password?: string;
  }
  