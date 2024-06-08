import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {API, base_url} from '../Api';
import {Alert} from 'react-native';
import ScreenNameEnum from '../../routes/screenName.enum';
const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  userData: null,
};

// register
export const register = createAsyncThunk(
  'register',
  async (params, thunkApi) => {
    console.log('Register =>>>>>>>>>>', params.data);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      
      const formdata = new FormData();
      formdata.append("full_name",params.data.full_name);
      formdata.append("email", params.data.email);
      formdata.append("mobile_number", params.data.mobile_number);
      formdata.append("password",  params.data.password);
      formdata.append("c_password", params.data.c_password);
      formdata.append("country_code", params.data.country_code);
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
      };
      
 const response =    fetch(base_url.url+"/auth/signup", requestOptions)
        .then((response) => response.text())
        .then((res) => {
          const response = JSON.parse(res)
    console.log(response);      
      if (response.success) {
        params.navigation.navigate(ScreenNameEnum.LOGIN_SCREEN);
        Alert.alert(
          'Success',
          'User Registered Successfully',
          [
            {
              text: 'Please Login',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
        return response
      } else {
        Alert.alert(
          'Failed',
          response.message,
          [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
        return response
      }
        })
        .catch((error) => console.error(error));

      return response;

      
    } catch (error) {
      console.log('🚀 ~ file: RegisterSlice.js:16 ~ register ~ error:', error);
      Alert.alert(
        'Network error',
        'server not responding please try later',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ],
        {cancelable: false},
      );

      return thunkApi.rejectWithValue(error);
    }
  },
);

const RegisterSlice = createSlice({
  name: 'registerSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // register cases
    builder.addCase(register.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
  },
});

export default RegisterSlice.reducer;
