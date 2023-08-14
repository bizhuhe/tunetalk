import { registerAs } from '@nestjs/config';

export default registerAs('spotify', () => ({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
}));
