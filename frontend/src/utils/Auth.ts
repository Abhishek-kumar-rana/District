// import type { User } from "../api/api";


// export interface CurrentUser {
//   id: number;
//   name?: string;
//   email: string;
//   role: "user" | "admin" |"superadmin";
//   createdAt?: string;
// }
 
// export const getCurrentUser = (): User | null => {
//   const raw = localStorage.getItem("currentUser");
//   const res= raw ? JSON.parse(raw) : null;
//   console.log("login data",res);
//   return res;
// };

// export type permission = "CREATE"|"DELETE" | "UPDATE";


// export const getPermissions=(): permission[] | null =>{
//     const raw = localStorage.getItem("currentUser");
//     const res= raw ? JSON.parse(raw) : null;
//     if(res?.role=="superadmin"){
//         return ["CREATE","DELETE","UPDATE"];
//     }
//     else if(res?.role=="admin"){
//         return ["CREATE","UPDATE"];
//     }
//     return [];
// }