import { Connection } from 'mongoose';
import { ReplySchema } from './reply.schema';
export const replyProviders = [
  {
    provide: 'REPLY_MODEL',
    useFactory: (connection: Connection) => connection.model('Reply', ReplySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];