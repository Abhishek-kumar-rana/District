import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { loginSchema, registerSchema } from "./zod/schema";
import type { LoginForm, RegisterForm } from "./zod/schema";
import { loginReq, registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";




export const LoginSignUp = () => {
    const [role, setRole] = useState("user");
    const [data, setData] = useState();
    const [registerError, setRegisterError] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const navigate=useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    const handleLogin = async(data: LoginForm) => {
        console.log(data);
        const response =await loginReq(data);
        console.log(response)
        if(response.success){
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            window.location.href = "/"; 
           
            navigate("/");
            
        }
    };

    // ---- Register form ----
    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
        reset: resetRegisterForm,
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: "user" },
    });
 
    const handleRegister = async (data: RegisterForm) => {
        setRegisterError("");
        setRegisterSuccess(false);
        try {
            const response = await registerUser(data);
            if (response.success) {
                setRegisterSuccess(true);
                resetRegisterForm( { email: "", password: "", role: "user" });
            } else {
                setRegisterError(response.message || "Registration failed");
            }
        } catch (err: any) {
            setRegisterError(
                err?.response?.data?.message || "Registration failed"
            );
        }
    };
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md lg:mt-30 mt-50 mb-10">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                                Email
                            </label>
                            <input

                                {...register("email")}
                                id="email"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                            />
                            {
                                errors.email &&

                                <p className="text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            }
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                                Password
                            </label>
                            <input {...register("password")} id="password"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password" />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <button className="mt-1 p-2 block bg-violet-400 text-white text-lg w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-blue-500">Login</button>
                        </div>
                    </form>


                    <div className=" w-full h-px bg-gray-200 mt-8 "> </div>



                    <h2 className="mt-6">New account? </h2>
                    <h2 className="text-2xl font-bold mb-2 text-center">Register</h2>

                    <form className="space-y-4" onSubmit={handleRegisterSubmit(handleRegister)}>
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                                Email
                            </label>
                            <input

                                 {...registerRegister("email")}
                                id="email"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                            />
                            {registerErrors.email && (
                                <p className="text-red-500 text-sm">
                                    {registerErrors.email.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                                Password
                            </label>
                            <input  {...registerRegister("password")} id="password"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password" />
                                  {registerErrors.password && (
                                <p className="text-sm text-red-500">
                                    {registerErrors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className=" p-2">
                                <input
                                    type="radio"
                                    value="user"
                                      {...registerRegister("role")}
                                    className=" "
                                />
                                User
                            </label>

                            <label className=" p-2">
                                <input
                                    type="radio"
                                    value="admin"
                                     {...registerRegister("role")}
                                />
                                Admin
                            </label>
                            {registerErrors.role && (
                                <p className="text-sm text-red-500">
                                    {registerErrors.role.message}
                                </p>
                            )}

                        </div>

                         {registerError && (
                            <p className="text-sm text-red-500 text-center">{registerError}</p>
                        )}
                        {registerSuccess && (
                            <p className="text-sm text-green-600 text-center">
                                Account created! You can log in above now.
                            </p>
                        )}

                        <div>
                            <button className="mt-1 p-2 block bg-violet-400 text-white text-lg w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-blue-500">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}