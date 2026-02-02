import { useContext } from "react"
import AuthContext from "./AuthContex";

 const useAuth = ()=>{
  const context = useContext(AuthContext)
  if(!context){
    throw new Error("no context exsist");
    
  }
  return context
}

export default useAuth;