/* eslint-disable no-unused-vars,no-undef */
const uiReducer = (state = initialState.ui, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return Object.assign({}, state, {
        isDrawerOpened: action.value || !state.isDrawerOpened
      });
    case SET_VIEWPORT_SIZE:
      return Object.assign({}, state, {
        viewport: Object.assign({}, state.viewport, action.value)
      });
    default:
      return state;
  }
};

const routingReducer = (state = initialState.routing, action) => {
  switch (action.type) {
    case SET_ROUTE:
      return Object.assign({}, state, {
        route: action.route,
        subRoute: null
      });
    case SET_SUB_ROUTE:
      return Object.assign({}, state, {
        subRoute: action.subRoute
      });
    default:
      return state;
  }
};

const heroReducer = (state = initialState.hero, action) => {
  switch (action.type) {
    case SET_HERO:
      return action.hero;
    default:
      return state;
  }
};

const dialogsReducer = (state = initialState.dialogs, action) => {
  switch (action.type) {
    case OPEN_DIALOG:
    case SET_DIALOG_DATA:
      return Object.assign({}, state, action.dialog);
    case CLOSE_DIALOG:
      return Object.assign({}, state, {
        [action.dialogName]: initialState.dialogs[action.dialogName]
      });
    default:
      return state;
  }
};

const blogReducer = (state = initialState.blog, action) => {
  switch (action.type) {
    case FETCH_BLOG_LIST:
      return action.list;
    default:
      return state;
  }
};

const galleryReducer = (state = initialState.gallery, action) => {
  switch (action.type) {
    case FETCH_GALLERY:
      return action.gallery;
    default:
      return state;
  }
};

const teamReducer = (state = initialState.team, action) => {
  switch (action.type) {
    case FETCH_TEAM:
      return action.team;
    default:
      return state;
  }
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case SIGN_IN:
    case SIGN_OUT:
      return action.user;
    default:
      return state;
  }
};

const subscribeReducer = (state = initialState.subscribed, action) => {
  switch (action.type) {   
    case SUBSCRIBE:
      return action.subscribed
    default:
      return state;
  }
};

const toastReducer = (state = initialState.toast, action) => {
  switch (action.type) {
    case SHOW_TOAST:
      return action.toast;
    case HIDE_TOAST:
      return initialState.toast;
    default:
      return state;
  }
};