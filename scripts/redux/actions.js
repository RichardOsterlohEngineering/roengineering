const uiActions = {
  toggleDrawer: (value = null) => {
    store.dispatch({
      type: TOGGLE_DRAWER,
      value
    });
  },
  setViewportSize: value => {
    store.dispatch({
      type: SET_VIEWPORT_SIZE,
      value
    });
  }
};

const routeActions = {
  setRoute: routeFromAction => {
    const route = routeFromAction || 'home';
    store.dispatch({
      type: SET_ROUTE,
      route
    });
    store.dispatch({
      type: SET_HERO,
      hero: heroSettings[route]
    });
  }
};

const blogActions = {
  fetchList: () => {
    return firebase.database()
      .ref('/blog/list')
      .on('value', snapshot => store.dispatch({
        type: FETCH_BLOG_LIST,
        list: snapshot.val()
      }));
  },
  fetchPost: (id) => {
    return firebase.database()
      .ref(`/blog/posts/${id}`)
      .on('value', snapshot => store.dispatch({
        type: FETCH_BLOG_POST,
        post: snapshot.val()
      }));
  }
};
