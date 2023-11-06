import { Controller, Body , Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { SignUpDto, LoginDto } from './dtos/index';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('/signup')
    signUp(@Body() signUpDto:SignUpDto): Promise<User>{
        return this.authService.signUp(signUpDto);
    }

    @Post('/login')
    login(@Body() loginDto:LoginDto): Promise<User>{
        return this.authService.login(loginDto);
    }
}
