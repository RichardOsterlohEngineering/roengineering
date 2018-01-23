/* eslint-disable no-unused-vars,no-undef */
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
  },
  setHero: (hero, route) => {
    store.dispatch({
      type: SET_HERO,
      hero: hero || (heroSettings ? heroSettings[route || 'home'] : null)
    });
  },
};

const routingActions = {
  setRoute: (routeFromAction) => {
    const route = routeFromAction || 'home';
    store.dispatch({
      type: SET_ROUTE,
      route,
    });
  },
  setSubRoute: subRoute => {
    store.dispatch({
      type: SET_SUB_ROUTE,
      subRoute,
    });
  },
  setLocation: (url) => {
    window.history.pushState({}, '', url);
    Polymer.Base.fire('location-changed', {}, { node: window });
  },
};

const dialogsActions = {
  openDialog: (dialogName, data) => {
    store.dispatch({
      type: OPEN_DIALOG,
      dialog: {
        [dialogName]: {
          isOpened: true,
          data,
        }
      }
    });
  },
  closeDialog: (dialogName) => {
    store.dispatch({
      type: CLOSE_DIALOG,
      dialogName,
    });
  }
};

let toastHideTimeOut;
const toastActions = {
  showToast: (toast) => {
    const duration = toast.duration || 5000;
    store.dispatch({
      type: SHOW_TOAST,
      toast: Object.assign({}, toast, {
        duration,
        visible: true,
      }),
    });

    clearTimeout(toastHideTimeOut);
    toastHideTimeOut = setTimeout(() => {
      toastActions.hideToast();
    }, duration);
  },

  hideToast: () => {
    clearTimeout(toastHideTimeOut);
    store.dispatch({
      type: HIDE_TOAST,
    });
  },
};

const blogActions = {
  fetchList: () => {
    return firebase.database()
      .ref('/blog/list')
      .on('value', (snapshot) => store.dispatch({
        type: FETCH_BLOG_LIST,
        list: snapshot.val(),
      }));
  }
};


const galleryActions = {
  fetchGallery: () => {
    return firebase.database()
      .ref('/gallery')
      .on('value', (snapshot) => {
        store.dispatch({
          type: FETCH_GALLERY,
          gallery: snapshot.val(),
        });
      });
  }
};

const teamActions = {
  fetchTeam: () => {
    return firebase.database()
      .ref('/team')
      .on('value', (snapshot) => {
        store.dispatch({
          type: FETCH_TEAM,
          team: snapshot.val(),
        });
      });
  }
};

const userActions = {
  signIn: (providerName) => {
    const firebaseProvider = helperActions.getFederatedProvider(providerName);

    return firebase.auth()
      .signInWithPopup(firebaseProvider)
      .then((signInObject) => {
        if (navigator.credentials) {
          var cred = new FederatedCredential({
            id: signInObject.user.email ||  signInObject.user.providerData[0].email,
            name: signInObject.user.displayName,
            iconURL: signInObject.user.photoURL,
            provider: providerName
          });

          navigator.credentials.store(cred);
        }

         helperActions.storeUser(signInObject.user);
      });
  },

  autoSignIn: (providerUrls) => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {      
      helperActions.storeUser(currentUser);
    }
    else {
      if (navigator.credentials) {
        return navigator.credentials.get({
          password: true,
          federated: {
            providers: providerUrls.split(','),
            mediation: 'silent'
          }
        }).then((cred) => {
          (() => {
            if (cred) {
              const provider = helperActions.getFederatedProvider(cred.provider);

              if (!provider) return;

              return firebase.auth().signInWithPopup(provider)
                .then((signInObject) => {
                  helperActions.storeUser(signInObject.user);
                });
            }
          })();
        });
      }
    }
  },

  signOut: () => {
    return firebase.auth()
      .signOut()
      .then(() => {
        helperActions.storeUser();
        subscribeActions.resetSubscribed();

        if (navigator.credentials) {
          navigator.credentials.preventSilentAccess();
        }
      });
  }
};

const subscribeActions = {
   subscribe: (data) => {
    const id = data.email.replace(/[^\w\s]/gi, '');

    firebase.database().ref(`subscribers/${id}`).set({
      email: data.email,
      firstName: data.firstName || '',
      lastName: data.lastName || ''
    })
    .then(() => {
       store.dispatch({
          type: SUBSCRIBE,
          subscribed: true
        });
    })
    .catch(() => {
      store.dispatch({
        type: SET_DIALOG_DATA,
        dialog: {
          ['subscribe']: {
            isOpened: true,
            data: Object.assign(data, { errorOccurred: true }),
          },
        },
      });

      store.dispatch({
        type: SUBSCRIBE,
        subscribed: false,
      });
    });
  },
  resetSubscribed: () => {
     store.dispatch({
        type: SUBSCRIBE,
        subscribed: false
     });
  }
};


const helperActions = {
  storeUser: (user) => {
    let userToStore = { signedIn: false };

    if (user) {
      const { uid, displayName, photoURL, refreshToken } = user;
      const email = user.email || user.providerData[0].email;

      userToStore = {
        signedIn: true,
        uid,
        email,
        displayName,
        photoURL,
        refreshToken,
      };
    }

    store.dispatch({
      type: SIGN_IN,
      user: userToStore
    });
  },

  getFederatedProvider: (provider) => {
    switch(provider) {
      case 'https://accounts.google.com': 
        return new firebase.auth.GoogleAuthProvider();
      case 'https://www.facebook.com': {
        let provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('email');
        provider.addScope('public_profile');
        return provider;
      }       
      case 'https://twitter.com': 
        return new firebase.auth.TwitterAuthProvider();
    }
  }
};

