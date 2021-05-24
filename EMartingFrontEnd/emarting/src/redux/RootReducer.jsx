import {combineReducers} from 'redux';
import cartNotificationReducer from './CartNotifications/CartNotificationReducer';
import LoginLogoutFeaturesReducer from './LoginLogoutFeatues/LoginLogoutFeaturesReducer';

const RootReducer = combineReducers({
    notifications: cartNotificationReducer,
    loggedIn: LoginLogoutFeaturesReducer
})

export default RootReducer;