import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loggedIn: false,
    checkTokenLoading: true,
    token: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            // if(state.token) {
            //     state.loggedIn = true;
            // }
            state.loggedIn = !!action.payload;
            localStorage.setItem('token', action.payload || '');
        },
        logout: (state) => {
            state.loggedIn = false;
            state.token=null;
            localStorage.removeItem('token');
        },
        setCheckTokenLoading: (state, action) => {
            state.checkTokenLoading = action.payload
        }
    }
})

export const { setToken, logout, setCheckTokenLoading } = userSlice.actions;

export default userSlice.reducer;