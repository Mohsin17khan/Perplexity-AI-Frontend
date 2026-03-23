import axios from 'axios'

export const api = axios.create({
    baseURL:"http://localhost:3000/api/chats",
    withCredentials:true
    
});


export async function sendmsg({ message,chatId }){
    const response = await api.post("/message",{
        message,
        chat: chatId  
    });
    return response.data

}


export async function  getchats() {
    const response = await api.get("/getchat");
    return response.data
}


export async function getmsg(chatId){
    const response = await api.get(`/getmsg/${chatId}`);
    return response.data
}

export async function deletemsg(chatId){
    const response = await api.delete(`/delete/${chatId}`);
    return response.data
}

