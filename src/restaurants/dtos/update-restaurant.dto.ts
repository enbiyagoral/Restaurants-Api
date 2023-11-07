import { IsString, IsEmail, IsPhoneNumber, IsEnum, IsOptional, IsEmpty } from "class-validator";
import { Category } from "../schemas/restaurant.schema";
import { User } from "../../auth/schemas/user.schema";

export class UpdateRestaurantDto{

    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsOptional()
    @IsEmail({}, {message: 'Please enter correct email address'})
    readonly email: string;

    @IsOptional()
    @IsPhoneNumber('TR')
    readonly phoneNo: number;

    @IsOptional()
    @IsString()
    readonly address: string;

    @IsOptional()
    @IsEnum(Category, {message: 'Please enter correct category'})
    readonly category: Category

    @IsEmpty({message: 'You cannot provide the user ID'})
    readonly user: User
}