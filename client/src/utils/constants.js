export const HOST=import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES="api/auth"
export const CONTACT_ROUTES="api/contact"
export const MESSAGE_ROUTES="api/message"
export const CHANNEL_ROUTES="api/channel"

export const SIGNUP=`${AUTH_ROUTES}/signup`
export const LOGIN=`${AUTH_ROUTES}/login`
export const GET_USER_INFO=`${AUTH_ROUTES}/get-userInfo`
export const UPDATE_PROFILE=`${AUTH_ROUTES}/update-profile`
export const UPDATE_PROFILE_IMAGE=`${AUTH_ROUTES}/update-profile-image`
export const REMOVE_PROFILE_IMAGE=`${AUTH_ROUTES}/remove-profile-image`
export const LOGOUT=`${AUTH_ROUTES}/logout`


export const SEARCH_CONTACTS=`${CONTACT_ROUTES}/search`
export const GET_DMS=`${CONTACT_ROUTES}/get-contacts-for-dm`
export const GET_ALL_CONTACTS=`${CONTACT_ROUTES}/get-all-contacts`

export const GET_MESSAGES=`${MESSAGE_ROUTES}/get-messages`
export const UPLOAD_FILE=`${MESSAGE_ROUTES}/upload-file`

export const CREATE_CHANNEL=`${CHANNEL_ROUTES}/createChannel`
export const GET_USER_CHANNEL=`${CHANNEL_ROUTES}/getUserChannel`
export const GET_CHANNEL_MESSAGES=`${CHANNEL_ROUTES}/getChannelMessage`