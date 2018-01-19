export class UserModel {
  id: string;
  email: string;
  nick: string;
  dateOfBirth?: string;
  tel?: string;

  constructor(param?: UserModel) {
    if (param) {
      Object.assign(this, param);
    }
  }
  static get exampleUser(): UserModel {
    return {
      id: '',
      email: 'info@uvegszilank.hu',
      nick: 'Eva',
      dateOfBirth: '1966-05-18',
      tel: '+36306478394'
    };
  }

  static get emptyUser(): UserModel {
    return {
      id: '',
      email: '',
      nick: '',
      dateOfBirth: '',
      tel: ''
    };
  }
}
