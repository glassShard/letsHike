export class UserModel {
  id: number;
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
      id: 0,
      email: 'info@uvegszilank.hu',
      nick: 'Eva',
      dateOfBirth: '1966-05-18',
      tel: '+36306478394'
    };
  }

  static get emptyUser(): UserModel {
    return {
      id: 0,
      email: '',
      nick: '',
      dateOfBirth: '',
      tel: ''
    };
  }
}
