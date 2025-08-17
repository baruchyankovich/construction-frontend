export interface LoginModel {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: {
      id: number;
      username: string;
      email: string;
      manager: boolean;
    };
  }