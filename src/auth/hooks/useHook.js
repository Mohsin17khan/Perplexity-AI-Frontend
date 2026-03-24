import { setLoading, setUser, setError } from "../auth.slice";
import { register, login, getme, logout } from "../services/auth.api";
import { useDispatch } from 'react-redux'



export function useAuth(){
    const dispatch = useDispatch();

    async function handleRegister({username, email, password}){
       try {
        dispatch(setLoading(true));
        const data = await register({ username, email, password });
        return data;
    } catch (error) {
        const msg = error.response?.data?.message || "Registration Failed";
        dispatch(setError(msg));
        throw new Error(msg);  // ← rethrow so Register.jsx catch block runs
    } finally {
        dispatch(setLoading(false));
    }
    }

    async function handleLogin({username, password}){
        try {
            dispatch(setLoading(true));
            const data = await login({username, password});
             localStorage.setItem("token", data.token);  //
            dispatch(setUser(data.user))
        } catch (error) {
             dispatch(setError(error.response?.data?.message || "Login Failed "))
        }finally{
            dispatch(setLoading(false))
        }
    }


    async function handleGetme() {
        try {
            dispatch(setLoading(true));
            const data = await getme();
            dispatch(setUser(data.user))
            console.log(data);
        } catch (error) {
           dispatch(setError(error.response?.data?.message || "Login Failed "))   
        }finally{
            dispatch(setLoading(false))
        }
        
    }

    async function handleLogout(){
        try {
            const data = await logout();
            localStorage.removeItem("token"); //
        } catch (error) {
          dispatch(setError(error.response?.data?.message || "logout Failed "))  
        }
    }
    return{
        handleRegister,
        handleLogin,
        handleGetme,
        handleLogout
    }

}