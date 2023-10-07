// import { User } from './types'

export type User= {
    MemberId    :   string|null;
    MemberName	:	string;
    Email		:	string|null;
    PassWord	:	string;
    CreatedAt	:	Date |null;		
  };

  
export type LoginUser= {
  Email		:	string|null;
  Password	:	string;	
};

  
export type SingupUser= {
  Name		:	string|null;
  Email		:	string|null;
  Password	:	string;	
};