import { User } from 'src/app/user/shared/user.model';
import { Prompt } from './prompt.model';

export class Comment {
  _id?: string;
  createdAt?: Date;
  comment?: string;
  // isReported?: any[];
  prompt?: Prompt;
  user?: User;
}
