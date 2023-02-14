export interface AuthModel {
  data:  UserModel;
  error: Error;
}

export interface UserModel {
  verified:            boolean;
  zoomUserid:          null;
  role:                string;
  dob?:                 Date;
  isFirstTimeLogin:    boolean;
  meetings:            any[];
  expertise:           string | any[];
  favouriteInstructor: any[];
  hostIds:             any[];
  firstname:           string;
  firstName?:               string;
  mobileNumber?:               string;
  lastName:            string;
  email:               string;
  username:            string;
  createdDate:         Date;
  updatedDate:         Date;
  id:                  string;
  token:               string;
  profilePic?:         string
  profilePic_delete_token?: string;
  phone?:               string;
}

export interface ProfileUserModel {
  verified?:            boolean;
  zoomUserid?:          null;
  role?:                string;
  dob?:                 Date;
  isFirstTimeLogin?:    boolean;
  meetings?:            any[];
  expertise?:           string | any[];
  favouriteInstructor?: any[];
  hostIds?:             any[];
  firstname?:           string;
  firstName?:               string;
  lastName?:            string;
  username?:            string;
  createdDate?:         Date;
  updatedDate?:         Date;
  id?:                  string;
  profilePic?:         string
  profilePic_delete_token?: string;
  phone?:               string;
  mobileNumber?:               string;
}

export interface Image {
  name: string
  data: ImgData
}

export interface ImgData {
  type: string
  data: number[]
}

//Forgot Password Model
export interface ForgotPasswordModel {
  data:  ForgotPasswordData;
  error: string;
}

export interface ForgotPasswordData {
  message: string;
}


// export interface AuthModel {
//   api_token: string
//   refreshToken?: string
// }

export interface UserChangePasswordModel {
  newPassword: string
  confirmPassword: string
}

export const UserChangePasswordinitialValues = {
  newPassword: '',
  confirmPassword: ''
}
export interface Error {
}

export interface ILogin {
  email: string
  password: string
  toc: boolean
}
