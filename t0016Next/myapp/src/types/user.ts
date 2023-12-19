import { VtuberId, KaraokeId, SongId } from './vtuber_content'


export type ListenerId = number;

export type User = {
  ListenerId: ListenerId | null;
  ListenerName: string;
  Email: string | null;
  Password: string;
  CreatedAt: Date | null;
};

export type LoginUser = {
  Email: string | null;
  Password: string;
};

export type SignupListener = {
  ListenerName: string;
  Email: string;
  Password: string;
};