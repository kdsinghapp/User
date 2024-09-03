

// import IniializeData from '../screens/WelcomeScreen/IniializeData';

import CartRoutes from "../navigators/Cart_Stack";
import ProfileRoutes from "../navigators/Profile_Stack";
import TabNavigator from "../navigators/TabNavigator";
import AskLocation from "../screen/AskLocation";
import CategoryDishes from "../screen/CategoryDishes";
import AddNewCard from "../screen/FeaturesScreen/AddNewCard";
import AddressPicker from "../screen/FeaturesScreen/Addaddressmap";
import Address from "../screen/FeaturesScreen/Address";
import AllCategories from "../screen/FeaturesScreen/AllCategories";
import AllPopularDishes from "../screen/FeaturesScreen/AllPopularDishes";

import Cart from "../screen/FeaturesScreen/Cart";
import ChangePassword from "../screen/FeaturesScreen/ChangePassword";
import DishInformation from "../screen/FeaturesScreen/DishInformation";

import EditProfile from "../screen/FeaturesScreen/EditProfile";
import Favorites from "../screen/FeaturesScreen/Favorites";
import Home from "../screen/FeaturesScreen/Home";
import MapScreen from "../screen/FeaturesScreen/Map";
import MsgNotification from "../screen/FeaturesScreen/MsgNotification";
import MyOrder from "../screen/FeaturesScreen/MyOrder";
import MyOrders from "../screen/FeaturesScreen/Myorders";
import Notification from "../screen/FeaturesScreen/Notification";
import Payment from "../screen/FeaturesScreen/Payment";
import PaymnetCard from "../screen/FeaturesScreen/PaymnetCard";
import Profile from "../screen/FeaturesScreen/Profile";
import RestaurantDetails from "../screen/FeaturesScreen/RestaurantDetails";
import Search_Restaurants from "../screen/FeaturesScreen/SearchRestaurant";
import TrackOrder from "../screen/FeaturesScreen/TrackOrder";
import getTopRatedRestaurants from "../screen/FeaturesScreen/getTopRatedRestaurants";
import Location from "../screen/Location";
import Login from "../screen/Login";
import OtpScreen from "../screen/OtpScreen";
import PasswordRest from "../screen/PasswordReset";
import PrivacyPolicy from "../screen/PrivacyPolicy";
import SignUp from "../screen/SignUp";
import TermConditions from "../screen/TermConditions";
import WELCOME_SCREEN from "../screen/WELCOME_SCREEN";
import CreatePassword from "../screen/createPassword";
import SelectLocation from "../screen/location/SelectLocation";
import ScreenNameEnum from "./screenName.enum";

const _routes = {
  REGISTRATION_ROUTE: [
    {
      name: ScreenNameEnum.SPLASH_SCREEN,
      Component:WELCOME_SCREEN,
    },
    {
      name: ScreenNameEnum.LOGIN_SCREEN,
      Component:Login,
    },
    {
      name: ScreenNameEnum.SIGNUP_SCREEN,
      Component:SignUp,
    },
    {
      name: ScreenNameEnum.PASSWORD_RESET,
      Component:PasswordRest,
    },
    {
      name: ScreenNameEnum.OTP_SCREEN,
      Component:OtpScreen,
    },
    {
      name: ScreenNameEnum.CREATE_PASSWORD,
      Component:CreatePassword,
    },
    {
      name: ScreenNameEnum.ASK_LOCATION,
      Component:AskLocation,
    },
    {
      name: ScreenNameEnum.LOCATION_SCREEN,
      Component:Location,
    },
    {
      name: ScreenNameEnum.BOTTOM_TAB,
      Component:TabNavigator,
    },
    {
      name: ScreenNameEnum.RESTAURANT_DETAILS,
      Component:RestaurantDetails ,
    },
    {
      name: ScreenNameEnum.DISH_INFORMATION,
      Component:DishInformation ,
    },
    {
      name: ScreenNameEnum.SEARCH_RESTAURANT,
      Component:Search_Restaurants ,
    },
    {
      name: ScreenNameEnum.TERMS_CONDITIONS,
      Component:TermConditions,
    },
    {
      name: ScreenNameEnum.PRIVACY_POLICY,
      Component:PrivacyPolicy,
    },
    {
      name: ScreenNameEnum.MY_ORDER,
      Component:MyOrder,
    },
   
    {
      name: ScreenNameEnum.TRACK_ORDER,
      Component:TrackOrder,
    },
    {
      name: ScreenNameEnum.PAYMENT_CARD,
      Component:PaymnetCard,
    },
    {
      name: ScreenNameEnum.ADDNEW_CARD,
      Component:AddNewCard,
    },
    {
      name: ScreenNameEnum.EDIT_PROFILE,
      Component:EditProfile ,
    },
    {
      name: ScreenNameEnum.CHANGE_PASSWORD,
      Component:ChangePassword ,
    },
    {
      name: ScreenNameEnum.ADDRESS_SCREEN,
      Component:Address ,
    },
    {
      name: ScreenNameEnum.NOTIFICATION_SCREEN,
      Component:Notification ,
    },
    
    {
      name: ScreenNameEnum.CATEGORY_DISHES,
      Component:CategoryDishes ,
    },
    {
      name: ScreenNameEnum.AllPopularDishes,
      Component:AllPopularDishes ,
    },
    {
      name: ScreenNameEnum.MsgNotification,
      Component:MsgNotification ,
    },
    {
      name: ScreenNameEnum.getTopRatedRestaurants,
      Component:getTopRatedRestaurants ,
    },
    {
      name: ScreenNameEnum.AddressPicker,
      Component:AddressPicker ,
    },
    {
      name: ScreenNameEnum.SelectLocation,
      Component:SelectLocation ,
    },
    {
      name: ScreenNameEnum.MAP_SCREEN,
      Component:MapScreen ,
    },
    {
      name: ScreenNameEnum.AllCategories,
      Component:AllCategories ,
    },
    {
      name: ScreenNameEnum.PAYMENT_SCREEN,
      Component:Payment ,
    },
    
  ],
  CART_ROUTE: [
    
    {
      name: ScreenNameEnum.CART_SCREEN,
      Component:Cart ,
    },
    
    
  ],
  PROFILE_ROUTE: [
    
    {
      name: ScreenNameEnum.PROFILE_SCREEN,
      Component:Profile,
    },
   
   
    
  ],


  BOTTOMTAB_ROUTE:[
    {
      name: ScreenNameEnum.HOME_SCREEN,
      Component:Home,
      logo:require('../assets/croping/HomeUnactive3x.png'),
      lable:'Home'
    },
    {
      name: ScreenNameEnum.BOOKING_SCREEN,
      Component:MyOrders,
      logo:require('../assets/croping/Booking3x.png'),
      lable:'Booking'
    },
    {
      name: ScreenNameEnum.CART_STACK,
      Component:CartRoutes,
      logo:require('../assets/croping/Cart3x.png'),
      lable:'Cart'
    },
    {
      name: ScreenNameEnum.FAVORITE_SCREEN,
      Component:Favorites,
      logo:require('../assets/croping/Favorites3x.png'),
      lable:'Favorites'
    },
    {
      name: ScreenNameEnum.PROFILE_STACK,
      Component:ProfileRoutes,
      logo:require('../assets/croping/Profile3x.png'),
      lable:'Profile'
    },
  ]

};

export default _routes;
