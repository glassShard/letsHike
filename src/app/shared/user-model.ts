export class UserModel {
  id: string;
  email: string;
  nick: string;
  dateOfBirth?: number;
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
      dateOfBirth: 152365245223,
      tel: '+36306478394'
    };
  }
}
