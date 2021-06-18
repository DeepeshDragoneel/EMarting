import './App.css';
import AddProduct from './Containers/admin/AddProduct/AddProduct';
import ErrorPage from './Containers/customer/404ErrorPage/ErrorPage';
import Shop from './Containers/customer/shop/shop';
import HomePage from './Containers/customer/HomePage/HomePage';
import Cart from './Containers/customer/Cart/Cart';
import AdminProducts from './Containers/admin/adminShop/AdminShop';
import ProductDetailes from './Containers/customer/ProductDetailes/ProductDetailes';
import EditProduct from './Containers/admin/EditProduct/EditProduct';
import {Switch, Route} from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import { Provider } from 'react-redux';
import store from './redux/store';
import LoginPage from './Containers/customer/LoginPage/LoginPage';
import SignUpPage from "./Containers/customer/SignUpPage/SignUpPage";
import { useSelector, useDispatch } from "react-redux";
import {logoutUser, loginUser} from "./redux/LoginLogoutFeatues/LoginLogoutFeaturesActions";
import CheckOut from './Containers/customer/CheckOutPage/checkOut/CheckOut.jsx';
import Orders from './Containers/customer/Orders/Orders';

function App() {
  const userLoggedIn = useSelector((state) => state.loggedIn.loggedIn);
  return (
      <div className="App">
          <NavBar />
          <Switch>
              <Route exact path="/home" component={HomePage}></Route>
              <Route
                  exact
                  path="/admin/addProduct"
                  component={AddProduct}
              ></Route>
              <Route
                  exact
                  path="/admin/editProduct/:id"
                  component={EditProduct}
              ></Route>
              <Route exact path="/shop" component={Shop}></Route>
              <Route
                  exact
                  path="/shop/detailes/:id"
                  component={ProductDetailes}
              ></Route>
              <Route exact path="/EMarting" component={HomePage}></Route>
              <Route exact path="/cart" component={Cart}></Route>
              <Route exact path="/admin/shop" component={AdminProducts}></Route>
              <Route exact path="/order/:msg?" component={CheckOut}></Route>
              <Route exact path="/" component={HomePage}></Route>
              {!userLoggedIn ? (
                  <>
                      <Route exact path="/login" component={LoginPage}></Route>
                      <Route
                          path="/signUp/:msg?"
                          component={SignUpPage}
                      ></Route>
                  </>
              ) : (
                  <>
                      <Route exact path="/orders" component={Orders}></Route>
                  </>
              )}
              <Route component={ErrorPage}></Route>
          </Switch>
      </div>
  );
}

export default App;
