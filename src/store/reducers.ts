import { combineReducers } from '@reduxjs/toolkit';
import formFieldsReducer from './slice/form-field-slice';

const rootReducer = combineReducers({
  forms: formFieldsReducer,
});

export default rootReducer;
