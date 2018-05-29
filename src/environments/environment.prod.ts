export const environment = {
  production: true,
  firebase: {
    baseUrl: 'https://turazzunk-2400c.firebaseio.com',
    registrationUrl: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser',
    loginUrl: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword',
    apiKey: 'AIzaSyDEj7AY_j5Ru6P5VzTW8UM8hn3jJc9wTfc',
    authDomain: 'turazzunk-2400c.firebaseapp.com',
    databaseURL: 'https://turazzunk-2400c.firebaseio.com',
    projectId: 'turazzunk-2400c',
    storageBucket: 'turazzunk-2400c.appspot.com',
    messagingSenderId: '638528513500'
  },
  links: {
    root: 'https://turazzunk.hu/',
    home: 'turazzunk.hu'
  },
  quillToolbar: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ header: [3, 4, 5, false] }],
      ['clean'],
      ['link']
    ]
  }
};
