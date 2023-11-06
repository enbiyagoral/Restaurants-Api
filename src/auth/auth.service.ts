import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto, LoginDto } from './dtos/index';
import * as bcrypt from 'bcryptjs';
import APIFeatures from 'src/utils/apiFeatures.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel: Model<User>,
        private jwtService: JwtService
        ){}

    async signUp(signUpDto: SignUpDto):Promise<{token:string}>{
        const { name, email, password } = signUpDto;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userModel.create({
            name, email, password:hashedPassword
            })
            const token = await APIFeatures.assignJwtToken(user._id, this.jwtService)
            return { token };
        } catch (error) {
           if(error.code === 11000){
            throw new ConflictException('Duplicate Email Entered')
           }
        }   

    }

    async login(loginDto: LoginDto):Promise<{token:string}>{
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({email}).select('+password');

        if(!user) {
            throw new UnauthorizedException('Invalid email and password');
        }
            
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email and password');
        }
        
        const token = await APIFeatures.assignJwtToken(user._id, this.jwtService)
        return {token};
        
    }
}
