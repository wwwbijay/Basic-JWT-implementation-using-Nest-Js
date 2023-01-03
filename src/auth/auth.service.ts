import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {

    refreshTokens:RefreshToken[] = [];

    constructor(private readonly _users: UsersService){}

    async refresh(refreshStr: string): Promise<string | undefined> {
        // need to create this helper function.
       const refreshToken = await this.retrieveRefreshToken(refreshStr);
       if (!refreshToken) {
         return undefined;
       }
    
       const user = await this._users.findOne(refreshToken.userId);
       if (!user) {
         return undefined;
       }
    
       const accessToken = {
         userId: refreshToken.userId,
       };
    
       // sign is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
       return sign(accessToken, process.env.ACCESS_SECRET, { expiresIn: '1h' });
     }

     private retrieveRefreshToken(
        refreshStr: string,
      ): Promise<RefreshToken | undefined> {
        try {
          // verify is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
          const decoded = verify(refreshStr, process.env.REFRESH_SECRET);
          if (typeof decoded === 'string') {
            return undefined;
          }
          return Promise.resolve(
            this.refreshTokens.find((token) => token.id === decoded.id),
          );
        } catch (e) {
          return undefined;
        }
      }

      

    async login(
        email: string,
        password: string,
        values: { userAgent: string; ipAddress: string }
      ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
        // need to import userService
        const user = await this._users.findByEmail(email);
        if (!user)  throw new ForbiddenException('Access Denied');
        // verify your user -- use argon2 for password hashing!!
        if (user.password !== password)  throw new ForbiddenException('Access Denied');
        // need to create this method
        return this.newRefreshAndAccessToken(user, values);
      }
      
    newRefreshAndAccessToken(user: User, values: { userAgent: string; ipAddress: string; }) {
        const refreshObject = new RefreshToken({
            id:
              this.refreshTokens.length === 0
                ? 0
                : this.refreshTokens[this.refreshTokens.length - 1].id + 1,
            userId: user.id,
            ...values,
            
          });
          // add refreshObject to your db in real app
          this.refreshTokens.push(refreshObject);
      
          return {
            refreshToken: refreshObject.sign(),
          // sign is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
            accessToken: sign(
              {
                userId: user.id,
              },
              process.env.ACCESS_SECRET,
              {
                expiresIn: '1h',
              },
            ),
          };
    }

    async logout(refreshStr: string): Promise<void> {
        const refreshToken = await this.retrieveRefreshToken(refreshStr);
    
        if (!refreshToken) {
          return;
        }
        // delete refreshtoken from db
        this.refreshTokens = this.refreshTokens.filter(
          (refreshToken) => refreshToken.id !== refreshToken.id,
        );
      }
}
