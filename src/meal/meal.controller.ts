import { Body, Controller, ForbiddenException, Get, Param, Post, Put, Delete,UseGuards } from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto, UpdateMealDto } from './dtos/index';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { Meal } from './schemas/meal.schema';

@Controller('meals')
export class MealController {
    constructor(private mealService: MealService){}

    @Get()
    @UseGuards(AuthGuard())
    async getAllMeals(
        @CurrentUser() user: User
        ): Promise<Meal[]>{
        return this.mealService.findAll();
    }

    @Get('restaurant/:id')
    @UseGuards(AuthGuard())
    async getMealsByRestaurant(
        @Param('id') id:string,
    ): Promise<Meal[]>{
        return this.mealService.findByRestaurant(id);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async getMealsById(
        @Param('id') id:string,
    ): Promise<Meal>{
        return this.mealService.findById(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    createMeal(
        @Body() meal: CreateMealDto,
        @CurrentUser() user: User
        ): Promise<Meal>{
        return this.mealService.create(meal, user)
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateMeal(
        @Body() updateMealDto: UpdateMealDto,
        @Param('id') id:string,
        @CurrentUser() user: User
    ): Promise<Meal>{
        const meal = await this.mealService.findById(id);
        if(meal.user.toString()!== user._id.toString()){
           throw new ForbiddenException('You can not update this meal');
        }
        return this.mealService.updateById(id, updateMealDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteMeal(
        @Param('id') id:string,
        @CurrentUser() user: User
    ): Promise<{deleted:Boolean}>{
        const meal = await this.mealService.findById(id);
        if(meal.user.toString()!== user._id.toString()){
           throw new ForbiddenException('You can not update this meal');
        }
        return this.mealService.deleteById(id);
    }
}
