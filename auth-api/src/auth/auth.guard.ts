import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JWK {
  keys: {
    kty: string;
    use: string;
    kid: string;
    alg: string;
    e: string;
    n: string;
    [key: string]: string;
  }[];
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const jwk = await this.getPublicJWK(token);
      const jwkToPem = require('jwk-to-pem');
      const certString: string = jwkToPem(jwk.keys[0]);

      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: certString,
        algorithms: ['RS256'],
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async getPublicJWK(token: string): Promise<JWK> {
    const decodedToken = this.jwtService.decode(token) as any;

    const res = await fetch(`${decodedToken.iss}/.well-known/jwks.json`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  }
}