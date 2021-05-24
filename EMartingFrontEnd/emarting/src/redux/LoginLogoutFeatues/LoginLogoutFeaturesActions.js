const logoutUser = () => {
    return{
        type: "LOGOUT_USER"
    }
}
const loginUser = () => {
    return{
        type: "LOGIN_USER"
    }
}

export {logoutUser, loginUser}