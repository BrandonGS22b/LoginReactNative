
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface UserCredentials {
    email: string;
    password: string;
  }