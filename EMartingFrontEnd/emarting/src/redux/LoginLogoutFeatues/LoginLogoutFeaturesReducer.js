const axios = require("axios");

const initialState = {
    loggedIn: false,
    userName: "",
};

const checkAuthorization = async (token) => {
    try {
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/auth",
            headers: {
                "content-type": "application/json",
                accept: "application/json",
            },
            data: JSON.stringify({
                token: token,
            }),
        });
        return result.data.username;
    } catch (error) {
        console.log(error);
    }
};

const LoginLogoutFeaturesReducer = (state = initialState, action) => {
    const token = localStorage.getItem("JWT");
    let username = localStorage.getItem("username");
    if (username.length > 12) {
        username = username.substring(0, 12);
        username = username.concat("...");
    }
    console.log(token);
    if (token !== null) {
        action.type = "LOGIN_USER";
    } else if (token === null) {
        action.type = "LOGOUT_USER";
    }
    switch (action.type) {
        case "LOGOUT_USER":
            return {
                ...state,
                loggedIn: false,
            };
        case "LOGIN_USER":
            return {
                ...state,
                loggedIn: true,
                userName: username,
            };
        default:
            return state;
    }
};

export default LoginLogoutFeaturesReducer;
