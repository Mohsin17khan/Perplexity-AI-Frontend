import axios from 'axios'


export const api = axios.create({
    baseURL:"https://perplexity-backend-1-rcvm.onrender.com",
    withCredentials:true
});




export async function register({username, email, password }){
    const response = await api.post("/api/auth/register",{
        username,
        email,
        password
    });
    return response.data
}

    export async function login({ username, password }){
        const response = await api.post("/api/auth/login",{
            username,
            password
        })

        return response.data
    }


export async function getme() {
    const response = await api.get("/api/auth/getme")
    return response.data
}

export async function logout(){
    const response = await api.post("/api/auth/logout");
    return response.data
}