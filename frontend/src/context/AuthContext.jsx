import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";


const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);

    }, []);



    const login = async (email, password) => {

        const response = await api.post("/auth/login", {
            email,
            password
        });


        const { token, user } = response.data;


        localStorage.setItem(
            "token",
            token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        setUser(user);


        return user;
    };



    const signup = async (name, email, password) => {

        const response = await api.post("/auth/signup", {
            name,
            email,
            password
        });


        return response.data;

    };



    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

    };



    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );

}



export function useAuth(){

    return useContext(AuthContext);

}