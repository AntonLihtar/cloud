const SET_USER = 'SET_USER'
const LOGOUT = 'LOGOUT'

const initialState = {
    currentUser: {},
    isAuth: false
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isAuth: true
            }
        case LOGOUT:
            console.log('disp LOGOUT')
            localStorage.removeItem('token')
            return {
                ...state,
                currentUser: {},
                isAuth: false
            }
        default:
            return state
    }
}

export const setUser = (user) => ({type: SET_USER, payload: user})
export const logout = () => {
    return {type: LOGOUT}
}