export interface User {
    name: string;
    email: string;
  }
  
  export interface UserCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  