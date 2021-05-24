const initialState = {
    notification: 0
}

const cartNotificationReducer = (state = initialState, action) => {
    switch(action.type){
        case "INC_NOTIFICATION":
            return{
                ...state,
                notification: state.notification + 1
            }
        case "DEC_NOTIFICATION":
            return{
                ...state,
                notification: 0
            }
        default:
            return state
    }
}

export default cartNotificationReducer;