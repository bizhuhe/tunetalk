import * as mongoose from 'mongoose';


export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb+srv://bizhuhe:bizhuhe@cluster0.lb4oacn.mongodb.net/?retryWrites=true&w=majority'),
  },
];
