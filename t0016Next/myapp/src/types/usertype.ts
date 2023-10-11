// import { User } from './types'

export type User= {
  ListenerId    :  number|null;
  ListenerName	:	string;
  Email		:	string|null;
  Password	:	string;
  CreatedAt	:	Date |null;		
};

export type LoginUser= {
  Email		:	string|null;
  Password	:	string;	
};