import { Restaurant } from "src/restaurants/schemas/restaurant.schema";
import { Category } from "../schemas/meal.schema";
import { User } from "src/auth/schemas/user.schema";
import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateMealDto{
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsNumber()
    readonly price: number;

    @IsOptional()
    @IsEnum(Category, { message: 'Please enter correct category for this meal'})
    readonly category: Category;

    @IsOptional()
    readonly restaurant: Restaurant;

    @IsEmpty({message: 'You cannot provide a user Id!'})
    readonly user: User;
}