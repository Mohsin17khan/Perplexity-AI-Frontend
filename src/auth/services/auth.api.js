import axios from 'axios'


export const api = axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true
});


export async function register({username, email, password }){
    const response = await api.post("/register",{
        username,
        email,
        password
    });
    return response.data
}

export async function login({ username, password }){
    const response = await api.post("/login",{
        username,
        password
    })

    return response.data
}


export async function getme() {
    const response = await api.get("/getme")
    return response.data
}

export async function logout(){
    const response = await api.post("/logout");
    return response.data
}