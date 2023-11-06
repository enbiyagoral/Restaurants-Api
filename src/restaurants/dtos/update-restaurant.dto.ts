import { IsString, IsEmail, IsPhoneNumber, IsEnum, IsOptional } from "class-validator";
import { Category } from "../schemas/restaurant.schema";
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

}