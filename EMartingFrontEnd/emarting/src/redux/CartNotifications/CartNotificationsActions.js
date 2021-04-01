const incrementCartNotification = () => {
    return{
        type: "INC_NOTIFICATION"
    }
}
const decrementCartNotification = () => {
    return{
        type: "DEC_NOTIFICATION"
    }
}

export {incrementCartNotification, decrementCartNotification}