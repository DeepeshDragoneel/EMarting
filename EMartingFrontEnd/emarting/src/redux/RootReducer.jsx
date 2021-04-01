import {combineReducers} from 'redux';
import cartNotificationReducer from './CartNotifications/CartNotificationReducer';

const RootReducer = combineReducers({
    notifications: cartNotificationReducer
})

export default RootReducer;