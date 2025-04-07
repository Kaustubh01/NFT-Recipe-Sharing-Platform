export const isAuthenticated = ()=>{
    const token = localStorage.getItem("user_token")
    return !!token
}