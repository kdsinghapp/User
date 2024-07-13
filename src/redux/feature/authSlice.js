import {createSlice, createAsyncThunk, createAction} from '@reduxjs/toolkit';
import { API, base_url } from '../Api';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenNameEnum from '../../routes/screenName.enum';
import { errorToast, successToast } from '../../configs/customToast';


const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  userData: null,
  isLogin: false,
  isLogOut: false,
};

export const login = createAsyncThunk('login', async (params, thunkApi) => {
  console.log('===============login=====================');
  console.log(params.data);

  try {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    
    const formdata = new FormData();
    formdata.append("identity", params.data.identity);
    formdata.append("password", params.data.password);
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };
    
  const respons =   fetch(base_url.url+"/auth/login", requestOptions)
      .then((response) => response.text())
      .then((res) =>{
        const response = JSON.parse(res)
        console.log(response.message);
        if (response.success) {
          thunkApi.dispatch(loginSuccess(response.data));
          params.navigation.navigate(ScreenNameEnum.ASK_LOCATION);
         successToast(
            response.message,
           
          );
          return response.data
        } else {
         errorToast(
           
            response.message,
           
          );

          return response.data
        }
      })
      .catch((error) => console.error(error));

  
return  respons
  } catch (error) {
    console.log('Error:', error);
  errorToast(
      'Network error',
     
     
    );
    return thunkApi.rejectWithValue(error);
  }
});
export const sendOtpRestPass = createAsyncThunk(
  'auth/sendOtpRestPass',
  async (params, thunkApi) => {
    const { data, navigation } = params;

    try {
      // Create a new FormData object
      const formData = new FormData();
      formData.append('identity', data.identity); // Adjust field names as per your API requirements

      const response = await API.post('/auth/password-reset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set appropriate content type for form data
        },
      });

      if (response.data.status) {
    successToast(
          'OTP Sent Successfully',
         
        );
   
        navigation.navigate(ScreenNameEnum.OTP_SCREEN, { identity: data.identity });
      } else {
        errorToast(
          response.data.message,
         
        );
      }

      return response.data;
    } catch (error) {
      console.log('Error:', error);
      Alert.alert(
        'Network Error',
        'Server not responding, please try again later',
       
      );
      return thunkApi.rejectWithValue(error);
    }
  }
);
export const validOtp = createAsyncThunk(
  'auth/validOtp',
  async (params, thunkApi) => {
    const { data, navigation } = params;

    console.log('parms:', data.identity,data.otp);
    try {
      // Create a new FormData object
      const formData = new FormData();
      formData.append('identity', data.identity);
      formData.append('otp', data.otp);

      const response = await API.post('/auth/verify-otp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set appropriate content type for form data
        },
      });

      console.log('Response:', response.data);

      if (response.data.success) {
      successToast(
          'OTP Verified Successfully',
         
        );

        navigation.navigate(ScreenNameEnum.CREATE_PASSWORD, { identity: data });
      } else {
       errorToast(
          response.data.message,
          );
      }

      return response.data;
    } catch (error) {
      console.log('Error:', error);

      Alert.alert(
        'Network Error',
        'Server not responding, please try again later',
       
      );
      navigation.goBack()

      return thunkApi.rejectWithValue(error);
    }
  }
);
export const CreateNewPassword = createAsyncThunk(
  'create-new-password-without-login',
  async (params, thunkApi) => {
    const { identity, password, otp, } = params.data;
console.log('identity, password, otp,',identity, password, otp,);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      
      const formdata = new FormData();
      formdata.append("password", password);
      formdata.append("c_password", password);
      formdata.append("identity", identity);
      formdata.append("otp", otp);
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
      };
      
 const response=     fetch("https://server-php-8-3.technorizen.com/loveeat/api/auth/create-new-password-without-login", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const  response = JSON.parse(result)
          console.log(response);
          if (response.success) {
            params.navigation.navigate(ScreenNameEnum.LOGIN_SCREEN);
            Alert.alert('Success', 'Password updated successfully');
           return response
          } else {
            Alert.alert('Failed', response.message);
            params.navigation.navigate(ScreenNameEnum.PASSWORD_RESET);
            return response
          }
        })
        .catch((error) => console.error(error));
     

      return response;
    } catch (error) {
      console.log('Error:', error);

      Alert.alert('Network Error', 'Server not responding, please try again later');

      return thunkApi.rejectWithValue(error);
    }
  }
);


export const logout = createAsyncThunk('logout', async (params, thunkApi) => {
  try {
    const response = await API.post('/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    });

    console.log(
      '🚀 ~ file: AuthSlice.js:29 ~ logout ~ response:',
      response.data,
    );

    if (response.data.status == '1') {
      successToast('User LogOut Successfuly');
      params.navigation.navigate(ScreenNameEnum.LOGIN_SCREEN)
    } else {
      errorToast('User LogOut Faild');
    }

    params.navigation.navigate('Login');
  } catch (error) {
    errorToast('Network error');
    console.log('🚀 ~ file: AuthSlice.js:32 ~ logout ~ error:', error);
    return thunkApi.rejectWithValue(error);
  }
});


const AuthSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.isLogin = true;
      state.isLogOut = false;
      state.userData = action.payload;
    },
  },
  extraReducers: builder => {
    // login cases
    builder.addCase(login.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.isLogOut = false;
      state.userData = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.isLogin = false;
    });
    builder.addCase(logout.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.isLogin = false;
      state.isLogOut = true;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.isLogin = true;
    });
    builder.addCase(sendOtpRestPass.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(sendOtpRestPass.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;

    });
    builder.addCase(sendOtpRestPass.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      
    });
    builder.addCase(validOtp.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(validOtp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;

    });
    builder.addCase(validOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      
    });
    builder.addCase(CreateNewPassword.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(CreateNewPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;

    });
    builder.addCase(CreateNewPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      
    });
  },


});

export const { loginSuccess } = AuthSlice.actions;

export default AuthSlice.reducer;
