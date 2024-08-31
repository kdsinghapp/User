import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API, base_url } from '../Api';

import { Alert } from 'react-native';
import { errorToast, successToast } from '../../configs/customToast';
import ScreenNameEnum from '../../routes/screenName.enum';
const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  DashboardList: null,
  ResturantDetails: null,
  Privacypolicy: null,
  TermsCondition: null,
  getProfile: null,
  FavoriteList: null,
  cartItem: null,
  addresList: null,
  OrderDetails: null,
  generalInfo: null,
  coupon_list: null,
  CouponCodeData: null,
  CategoryDish: null,
  PopularDish: null,
  getTopRated_restaurants: null,
  Orderlocations: [],
  PayMentStatus: [],
  NotificationList: [],
  AllCategory:[],

};
export const Food_categories = createAsyncThunk(
  'Food_categories',
  async (params, thunkApi) => {
    console.log('=============Food_categories=======================',params);
    try {

      
      
      // Create form data with identity and otp
    
      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);
      // Create request options
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: null,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/home/get-categories`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();

      console.log('Response restaurant/get-restaurant-categories=>>>>>>>>>>>>> :', responseData.success);

      // Handle successful response
      if (responseData.success) {
        //successToast(responseData.message);
       
      } else {
       // errorToast(responseData.message); 
       
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const get_HomeDashBoard = createAsyncThunk(
  'get_HomeDashBoard',
  async (params, thunkApi) => {
   
    try {
      const response = await API.post('/home/get-home', null, {
        headers: {
          'Accept': 'application/json', 
          Authorization: `Bearer ${params.token}`,
        },
      });
      console.log('DashBoardData api',response.data.success);
      if (response.data.success) {
        console.log('User Get_Home Succesfuly');
      }
      return response.data.data;
    } catch (error) {
      console.log(
        '🚀 ~ file: get_HomeDashBoard .js:16 ~ get_HomeDashBoard ~ error:',
        error,
      );

      return thunkApi.rejectWithValue(error);
    }
  },
);
export const get_notifications = createAsyncThunk(
  'get_notifications',
  async (params, thunkApi) => {
    try {
      const response = await API.post('/user/get-notifications', null, {
        headers: {
          Authorization: `Bearer ${params.token}`,
        },
      });

      if (response.data.success) {
        console.log('User get_notifications Succesfuly');
      }
      return response.data.data;
    } catch (error) {
      console.log(
        '🚀 ~ file:  .js:16 ~ get_notifications ~ error:',
        error,
      );

      return thunkApi.rejectWithValue(error);
    }
  },
);
export const get_RestauRantDetails = createAsyncThunk(
  'get_RestauRantDetails',
  async (params, thunkApi) => {
    console.log('================RestauRantDetails=APi===================');
    try {
      const response = await API.post(
        '/restaurant/get-restaurant-by-id',
        params.data,
        {
          headers: {
            Authorization: `Bearer ${params.token}`,
          },
        },
      );
      console.log(
        '================RestauRantDetails=APi===================',
        response.data,
      );
      if (response.data.success) {
        console.log('User get_RestauRantDetails Succesfuly');
      }
      return response.data.data;
    } catch (error) {
      console.log(
        '🚀 ~ file: get_RestauRantDetails .js:16 ~ get_RestauRantDetails ~ error:',
        error,
      );

      return thunkApi.rejectWithValue(error);
    }
  },
);


export const get_terms_conditions = createAsyncThunk(
  'get_terms_conditions',
  async (params, thunkApi) => {
    try {
      const response = await API.get('/home/get-terms-and-conditions', null, {
        headers: {
          Authorization: `Bearer ${params.token}`,
        },
      });

      if (response.data.success) {
        console.log('User get_terms_conditions Succesfuly');
      }
      return response.data.data;
    } catch (error) {
      console.log('🚀 ~ : get_terms_conditions error:', error);

      return thunkApi.rejectWithValue(error);
    }
  },
);
export const get_Profile = createAsyncThunk(
  'get-profile',
  async (params, thunkApi) => {
    console.log(params);
    try {
      const response = await API.post('/auth/get-profile', null, {
        headers: {
          Authorization: `Bearer ${params.token}`,
        },
      });

      if (response.data.success) {
        console.log('User get-profile Succesfuly');
      }
      return response.data.data;
    } catch (error) {
      console.log('🚀 ~ :auth/get-profile error:', error);

      return thunkApi.rejectWithValue(error);
    }
  },
);

export const get_FavoriteList = createAsyncThunk(
  'get_FavoriteList',
  async (params, thunkApi) => {
    console.log(params);
    try {
      const response = await API.post(
        '/favorite/list-favorite-restaurant',
        null,
        {
          headers: {
            Authorization: `Bearer ${params.token}`,
          },
        },
      );

      if (response.data.success) {
        console.log('User get_FavoriteList Succesfuly');
      }
      return response.data.data;
    } catch (error) {
      console.log('get_FavoriteList error:', error);

      return thunkApi.rejectWithValue(error);
    }
  },
);


export const Add_FavoriteList = createAsyncThunk(
  'Add_FavoriteList',
  async (params, thunkApi) => {


    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      const formdata = new FormData();
      formdata.append('fav_id', params.fav_id);
      formdata.append('fav_type', params.fav_type);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url + '/favorite/add-favorite-restaurant', requestOptions
      )
        .then(response => response.text())
        .then(res => {
          const response = JSON.parse(res);
          console.log(response.message);
          if (response.success) {

            successToast(response.message)
            // params.navigation.goBack()
        

            return response.data;
          } else {
            errorToast(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const get_privacy_policy = createAsyncThunk(
  'get_privacy_policy',
  async (params, thunkApi) => {
    try {
      const response = await API.get('/home/get-privacy-policy', null, {
        headers: {
          Authorization: `Bearer ${params.token}`,
        },
      });

 

      if (response.data.success) {
        console.log('User get_privacy_policy Succesfuly');
      }
      return response.data.data;
    } catch (error) {
      console.log('🚀 ~ : get_privacy_policy error:', error);

      return thunkApi.rejectWithValue(error);
    }
  },
);

export const get_cart = createAsyncThunk(
  'get_cart',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp


      const formdata = new FormData();

      formdata.append("user_id", params.data.user_id);

      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/user/cart/item-get`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();

   

      if (responseData.success) {
        console.log('restaurant/get-order-data-by-id',);
      } else {
        //errorToast(responseData.message); 
        console.log('restaurant/get-order-data-by-id', );
      }


      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const get_coupon_list = createAsyncThunk(
  'get_coupon_list',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp

      console.log('get_coupon_list=>>>>', );


      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: null,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/user/get-coupon-list`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();

      console.log('get_coupon_list=>>>>>>>>>>>>> :', );


      if (responseData.success) {
        console.log('get_coupon_list', responseData.message);
      } else {
        //errorToast(responseData.message); 
        console.log('get_coupon_list', responseData.message);
      }


      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const addres_list = createAsyncThunk(
  'addres_list',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp

    
      const formdata = new FormData();

      formdata.append("user_id", params.user_id);

      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/user/addres/list`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();




      if (responseData.success) {
        console.log('addres_list ', responseData.message);
      } else {
        //errorToast(responseData.message); 
        console.log('addres_list ', responseData.message);
      }


      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const user_order_status = createAsyncThunk(
  'user_order_status',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp


      const formdata = new FormData();

      formdata.append("order_id", params.order_id);

      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/user/order/user-order-status`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();




      if (responseData.success) {
        console.log('user_order_status ', responseData.message);
        successToast("Your order has been successfully canceled.")
      } else {
        //errorToast(responseData.message); 
        console.log('user_order_status ', responseData.message);
      }


      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const get_order_locations = createAsyncThunk(
  'get_order_locations',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp





      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');


      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: params.data,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/driver/get-locations`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();




      if (responseData.success) {
        console.log('get_order_locations ', responseData.message);
        // successToast("Your order has been successfully canceled.")
      } else {
        //errorToast(responseData.message); 
        console.log('get_order_locations ', responseData.message);
      }


      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      //  errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);


export const add_cart = createAsyncThunk(
  'add_cart',
  async (params, thunkApi) => {


    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      const formdata = new FormData();
      formdata.append('user_id', params.data.user_id);
      formdata.append('dish_id', params.data.dish_id);
      formdata.append('quantity', params.data.quantity);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url + '/user/cart/item-add', requestOptions
      )
        .then(response => response.text())
        .then(res => {
          const response = JSON.parse(res);
          console.log(response.message);
          if (response.success) {

            successToast(response.message)
            // params.navigation.goBack()
            console.log('=>>>>>>>update cart ', response.message);

            return response.data;
          } else {
            errorToast(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const apply_coupon = createAsyncThunk(
  'apply_coupon',
  async (params, thunkApi) => {


    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      const formdata = new FormData();
      formdata.append('coupon_code', params.coupon_code);


      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url + '/user/apply-coupon', requestOptions
      )
        .then(response => response.text())
        .then(res => {
          const response = JSON.parse(res);
          console.log(response.message);
          if (response.success) {

            successToast("Coupon Apply Successfuly")
            // params.navigation.goBack()
            console.log('=>>>>>>>apply_coupon cart ', response.message);

            return response.data;
          } else {
            errorToast(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const add_address = createAsyncThunk(
  'add_address',
  async (params, thunkApi) => {
 
    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);


      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: params.data,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url + '/user/addres/create', requestOptions
      )
        .then(response => response.text())
        .then(res => {
          const response = JSON.parse(res);
     
          if (response.success) {

            successToast(response.message)
            // params.navigation.goBack()
            console.log('=>>>>>>>update cart ', response.message);

            return response.data;
          } else {
            errorToast(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const create_order = createAsyncThunk(
  'create_order',
  async (params, thunkApi) => {
 

    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);


      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: params.data,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url +'/user/order/create-restaurant-order', requestOptions
      )
        .then(response => response.text())
        .then(res => {
          const response = JSON.parse(res);
          console.log('/user/order/create-restaurant-order===============create_order=====================', response);
          if (response.success) {

            successToast("Your Order Successfuly Create")
            params.navigation.navigate(ScreenNameEnum.BOOKING_SCREEN)


            return response.data;
          } else {
            errorToast(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const update_address = createAsyncThunk(
  'update_address',
  async (params, thunkApi) => {



    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);


      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: params.data,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url + '/user/addres/update', requestOptions
      )
        .then(response => response.text())
        .then(res => {

          const response = JSON.parse(res);
  
          if (response.success) {
            if (params.isSelectes) {

              successToast('Address Update Successfuly')
            }

            // params.navigation.goBack()
            console.log('=>>>>>>>update_address cart ', response);

            return response.data;
          } else {
            errorToast(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const remove_cart = createAsyncThunk(
  'remove_cart',
  async (params, thunkApi) => {
 

    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      const formdata = new FormData();
      formdata.append('user_id', params.data.user_id);
      formdata.append('cart_id', params.data.cart_id);


      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url + '/user/cart/item-delete', requestOptions
      )
        .then(response => response.text())
        .then(res => {
          const response = JSON.parse(res);
          console.log(response.message);
          if (response.success) {



            successToast(response.message);

            return response.data;
          } else {
            errorToast(response.message);
            console.log('=============response.message=======================');
            console.log(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const addres_delete = createAsyncThunk(
  'addres_delete',
  async (params, thunkApi) => {


    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      const formdata = new FormData();
      formdata.append('address_id', params.address_id);



      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url + '/user/addres/delete', requestOptions
      )
        .then(response => response.text())
        .then(res => {
          const response = JSON.parse(res);
          console.log(response.message);
          if (response.success) {



            successToast(response.message);

            return response.data;
          } else {
            errorToast(response.message);
            console.log('=============address_id.message=======================');
            console.log(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const get_order_data_by_id = createAsyncThunk(
  'get_order_data_by_id',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp

      const formdata = new FormData();

      formdata.append("user_id", params.data.user_id);
      formdata.append("status", params.data.status);


      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/user/order/all-order-details`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();


      // Handle successful response
      if (responseData.success) {
        //successToast(responseData.message);
        //params.navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
      } else {
        //errorToast(responseData.message); 
        console.log('restaurant/get-order-data-by-id', responseData.message);
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);

export const get_category_dish = createAsyncThunk(
  'get_category_dish',
  async (params, thunkApi) => {
    console.log('================get_category_dish=APi===================', params);
    try {
      // Create form data with identity and otp
    
      const formdata = new FormData();

      formdata.append("category_id", params.category_id);


      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/home/get-dish-by-category`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();



      // Handle successful response
      if (responseData.success) {
        //successToast(responseData.message);
        //params.navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
      } else {
        //errorToast(responseData.message); 
        console.log('restaurant/get-order-data-by-id', responseData.message);
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const add_review = createAsyncThunk(
  'add_review',
  async (params, thunkApi) => {
 
    try {
      // Create form data with identity and otp

      const formdata = new FormData();

      formdata.append("resrev_restaurants_id", params.resrev_restaurants_id);
      formdata.append("resrev_rating", params.resrev_rating);
      formdata.append("resrev_review_text", params.resrev_review_text);


      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/home/add-review`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();




      if (responseData.success) {
        successToast(responseData.message);
        //params.navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
      } else {
        //errorToast(responseData.message); 
        console.log('radd_review', responseData.message);
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const get_popular_dish = createAsyncThunk(
  'get_popular_dish',
  async (params, thunkApi) => {
   
    try {
      // Create form data with identity and otp


      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: null,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/home/get-popular-dish`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();



      // Handle successful response
      if (responseData.success) {
        //successToast(responseData.message);
        //params.navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
      } else {
        //errorToast(responseData.message); 
        console.log('get_popular_dish', responseData.message);
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const get_top_rated_restaurants = createAsyncThunk(
  'get_top_rated_restaurants',
  async (params, thunkApi) => {

    try {
      // Create form data with identity and otp


      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: null,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/home/get-top-rated-restaurants`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();



      // Handle successful response
      if (responseData.success) {
        //successToast(responseData.message);
        //params.navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
      } else {
        //errorToast(responseData.message); 
        console.log('get_top_rated_restaurants', responseData.message);
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const general_setting = createAsyncThunk(
  'general_setting',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp

      const formdata = new FormData();



      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: null,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/user/general-setting`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();



      // Handle successful response
      if (responseData.success) {
        //successToast(responseData.message);
        //params.navigation.navigate(ScreenNameEnum.BOTTOM_TAB);
      } else {
        //errorToast(responseData.message); 
        console.log('general_setting', responseData.message);
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.error('Error:', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const update_cart = createAsyncThunk(
  'update_cart',
  async (params, thunkApi) => {
  

    try {
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      const formdata = new FormData();
      formdata.append('user_id', params.data.user_id);
      formdata.append('cart_id', params.data.cart_id);
      formdata.append('quantity', params.data.quantity);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      const respons = fetch(
        base_url.url + '/user/cart/item-update', requestOptions
      )
        .then(response => response.text())
        .then(res => {
          const response = JSON.parse(res);

          if (response.success) {


            //  successToast(response.message);

            return response.data;
          } else {
            errorToast(response.message);

            return response.data;
          }
        })
        .catch(error => console.error(error));

      return respons;
    } catch (error) {
      console.log('Error:', error);
      errorToast('Network error');
      return thunkApi.rejectWithValue(error);
    }
  },
);
export const update_profile = createAsyncThunk(
  'update_profile',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp



      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);


      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: params.data,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/auth/update-profile`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();

      console.log('Response update_profile=>>>>>>>>>>>>> :', responseData.success);

      // Handle successful response
      if (responseData.success) {
        if(params.msg){

          successToast(responseData.message);
        }


      } else {
        errorToast(responseData.message);
        console.log('==============update_profile======================');
        console.log(responseData.message);
        console.log('====================================');
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.log('==========update_profile==========================', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const Payment_api = createAsyncThunk(
  'Payment_api',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp



      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: params.data,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/auth/create-checkout-session`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();



      // Handle successful response
      if (responseData.data) {
        // successToast(responseData.message);


      } else {
      

      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.log('==========Payment_api==========================', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);

export const delete_favorite_restaurant = createAsyncThunk(
  'delete_favorite_restaurant',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp



      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);

      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: params.data,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/favorite/delete-favorite-restaurant`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();

      console.log('delete_favorite_restaurant=>>>>>>>>>>>>> :', responseData.success);

      // Handle successful response
      if (responseData.success) {
        successToast("Item Remove successfuly");


      } else {
        errorToast(responseData.message);
        console.log('==============delete_favorite_restaurant======================');
        console.log(responseData.message);
        console.log('====================================');
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.log('==========update_profile==========================', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);
export const create_new_password = createAsyncThunk(
  'create_new_password',
  async (params, thunkApi) => {
    try {
      // Create form data with identity and otp


      const data = new FormData();

      data.append('password', params.password);
      data.append('c_password', params.c_password);
      data.append('old_password', params.old_password);

      // Configure request headers
      const myHeaders = new Headers();
      myHeaders.append('Accept', 'application/json');
      myHeaders.append('Authorization', `Bearer ${params.token}`);


      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: data,
        redirect: 'follow',
      };

      // Make POST request to verify OTP
      const response = await fetch(
        `${base_url.url}/auth/create-new-password`,
        requestOptions,
      );

      // Parse response as JSON
      const responseData = await response.json();

      console.log('Response create_new_password=>>>>>>>>>>>>> :', responseData.success);

      // Handle successful response
      if (responseData.success) {
        successToast(responseData.message);


      } else {
        errorToast(responseData.message);
        console.log('==============create_new_password======================');
        console.log(responseData.message);
        console.log('====================================');
      }

      // Return response data
      return responseData.data;
    } catch (error) {
      console.log('==========create_new_password==========================', error);
      errorToast('Network error');
      // Reject with error
      throw error;
    }
  },
);


const FeatureSlice = createSlice({
  name: 'featureSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(Food_categories.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(Food_categories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.AllCategory = action.payload;
    });
    builder.addCase(Food_categories.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
     
    });
   
    builder.addCase(Payment_api.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(Payment_api.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.PayMentStatus = action.payload;
    });
    builder.addCase(Payment_api.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_notifications.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_notifications.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.NotificationList = action.payload;
    });
    builder.addCase(get_notifications.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_order_data_by_id.pending, state => {
      state.isLoading = false;
    });
    builder.addCase(get_order_data_by_id.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.OrderDetails = action.payload;
    });
    builder.addCase(get_order_data_by_id.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_order_locations.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_order_locations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.Orderlocations = action.payload;
    });
    builder.addCase(get_order_locations.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_top_rated_restaurants.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_top_rated_restaurants.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.getTopRated_restaurants = action.payload;
    });
    builder.addCase(get_top_rated_restaurants.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(user_order_status.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(user_order_status.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;

    });
    builder.addCase(user_order_status.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(add_review.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(add_review.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;

    });
    builder.addCase(add_review.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_category_dish.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_category_dish.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.CategoryDish = action.payload;
    });
    builder.addCase(get_category_dish.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_popular_dish.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_popular_dish.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.PopularDish = action.payload;
    });
    builder.addCase(get_popular_dish.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(delete_favorite_restaurant.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(delete_favorite_restaurant.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;

    });
    builder.addCase(delete_favorite_restaurant.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(Add_FavoriteList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(Add_FavoriteList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;

    });
    builder.addCase(Add_FavoriteList.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(update_profile.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(update_profile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;

    });
    builder.addCase(update_profile.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(create_new_password.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(create_new_password.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;

    });
    builder.addCase(create_new_password.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(create_order.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(create_order.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.CouponCodeData = []

    });
    builder.addCase(create_order.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(apply_coupon.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(apply_coupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.CouponCodeData = action.payload

    });
    builder.addCase(apply_coupon.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    // DashboardSlice cases
    builder.addCase(get_HomeDashBoard.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_HomeDashBoard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.DashboardList = action.payload;
    });
    builder.addCase(get_HomeDashBoard.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_coupon_list.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_coupon_list.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.coupon_list = action.payload

    });
    builder.addCase(get_coupon_list.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_RestauRantDetails.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_RestauRantDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.ResturantDetails = action.payload;
    });
    builder.addCase(get_RestauRantDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(general_setting.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(general_setting.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.generalInfo = action.payload;
    });
    builder.addCase(general_setting.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(addres_list.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(addres_list.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.addresList = action.payload;
    });
    builder.addCase(addres_list.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_cart.pending, state => {
      state.isLoading = false;
    });
    builder.addCase(get_cart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.cartItem = action.payload

    });
    builder.addCase(get_cart.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_privacy_policy.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_privacy_policy.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.Privacypolicy = action.payload;
    });
    builder.addCase(get_privacy_policy.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_terms_conditions.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_terms_conditions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.TermsCondition = action.payload;
    });
    builder.addCase(get_terms_conditions.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_Profile.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(add_cart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(add_cart.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(add_cart.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(add_address.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(add_address.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(add_address.pending, state => {
      state.isLoading = false;
    });
    builder.addCase(update_address.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(update_address.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(update_address.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(update_cart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });

    builder.addCase(update_cart.pending, state => {
      state.isLoading = false;
    });
    builder.addCase(remove_cart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(update_cart.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(remove_cart.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(remove_cart.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(addres_delete.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(addres_delete.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(addres_delete.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_Profile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.getProfile = action.payload;
    });
    builder.addCase(get_Profile.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(get_FavoriteList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(get_FavoriteList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.FavoriteList = action.payload;
    });
    builder.addCase(get_FavoriteList.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
  },
});

export default FeatureSlice.reducer;
