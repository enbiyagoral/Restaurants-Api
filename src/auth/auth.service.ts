import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto, LoginDto } from './dtos/index';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    async signUp(signUpDto: SignUpDto):Promise<User>{
        const { name, email, password } = signUpDto;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userModel.create({
            name, email, password:hashedPassword
            })
            return user;
        } catch (error) {
           if(error.code === 11000){
            throw new ConflictException('Duplicate Email Entered')
           }
        }   

    }

    async login(loginDto: LoginDto):Promise<User>{
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({email}).select('+password');

        if(!user) {
            throw new UnauthorizedException('Invalid email and password');
        }
            
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email and password');
        }
            
        return user;
        
    }
}
