import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router";

const Root = () =>{
    const { user } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() =>{
        if(user){
            if(user.role === "admin"){
                navigate("/admin-dashboard");
            }else if(user.role === "clerk"){
                navigate("/clerk-dashboard");
            }else if(user.role === "receptionist"){
                navigate("/receptionist-dashboard");
            }else if(user.role === "attendant"){
                navigate("/attendant-dashboard");
            }
        }else{
            navigate("/login");
        }
    }, [user, navigate]);

    return null;
}

export default Root;