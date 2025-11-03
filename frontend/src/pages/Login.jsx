import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                email, password,
            });
            console.log(response.data);

            if(response.data.success){
                await login(response.data.user, response.data.token);
                if(response.data.user.role === "admin"){
                    navigate("/admin-dashboard");
                }else if(response.data.user.role === "clerk"){
                    navigate("/clerk-dashboard");
                }else if(response.data.user.role === "receptionist"){
                    navigate("/receptionist-dashboard");
                }
                else if(response.data.user.role === "attendant"){
                    navigate("/attendant-dashboard");
                }
            }else{
                alert(response.data.error);
            }

        } catch (error) {
            if(error.response){
                setError(error.response.data.message);
            }
        } finally{
            setLoading(false);
        }
    }

  return (
    <div id="layoutAuthentication">
            <div id="layoutAuthentication_content">
                <main>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-5">
                                <div class="card shadow-lg border-0 rounded-lg mt-5">
                                    <div class="card-header"><h3 class="text-center font-weight-light my-4">Login</h3></div>
                                    <div class="card-body">
                                        {error && (
                                            <div>{error}</div>
                                        )}
                                        <form onSubmit={handleSubmit}>
                                            <div class="form-floating mb-3">
                                                <input class="form-control" id="inputEmail" type="email" name="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} required />
                                                <label for="inputEmail">Email address</label>
                                            </div>
                                            <div class="form-floating mb-3">
                                                <input class="form-control" id="inputPassword" type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                                                <label for="inputPassword">Password</label>
                                            </div>
                                            <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                <button class="btn btn-primary" type='submit'>{loading ? "Loading..." : "Login"}</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
  )
}

export default Login;
