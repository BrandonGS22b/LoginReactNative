
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface User {
    _id: string; // Cambiar de 'id' a '_id' si la API usa este formato
    name: string;
    email: string;
  }
  
  
  export interface UserCredentials {
    email: string;
    password: string;
  }