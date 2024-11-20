import { configureStore } from "@reduxjs/toolkit";
import MyUserSlice from "./MyUserSlice";
import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "@react-native-async-storage/async-storage";

let persistConfig = {
    key: 'root',
    storage,
    whitelist:['user']
  };
  let rootReducer=combineReducers({
    user:MyUserSlice,
  
  });
  let persistedReducer=persistReducer(persistConfig, rootReducer)

const Mystore = configureStore({
    reducer:persistedReducer
});
export default Mystore