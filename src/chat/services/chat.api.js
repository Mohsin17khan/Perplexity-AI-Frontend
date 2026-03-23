import axios from 'axios'

export const api = axios.create({
    baseURL:"https://perplexity-backend-1-rcvm.onrender.com",
    withCredentials:true
    
});


export async function sendmsg({ message,chatId }){
    const response = await api.post("/api/chats/message",{
        message,
        chat: chatId  
    });
    return response.data

}


export async function  getchats() {
    const response = await api.get("/api/chats/getchat");
    return response.data
}


export async function getmsg(chatId){
    const response = await api.get(`/api/chats/getmsg/${chatId}`);
    return response.data
}

export async function deletemsg(chatId){
    const response = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data
}

