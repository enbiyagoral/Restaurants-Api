import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meal } from './schemas/meal.schema';
import * as mongoose from 'mongoose';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class MealService {
    constructor(
        @InjectModel(Meal.name)
        private mealModel: mongoose.Model<Meal>,

        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ){}


    async create(meal:Meal, user:User): Promise<Meal>{
        const data = Object.assign(meal, {user: user._id});
        const mealCreated = await this.mealModel.create(data);
        const restaurant = await this.restaurantModel.findById(meal.restaurant);

        if(!restaurant){
            throw new NotFoundException('Restaurant not found!');
        }

        if(restaurant.user.toString() !== user._id.toString()){
            throw new ForbiddenException('You can not add meal to this restaurant.');
        }
        
        restaurant.menu.push(mealCreated._id as any);
        await restaurant.save();
        return mealCreated;
    }

    async findAll(): Promise<Meal[]>{
        const meals = await this.mealModel.find({});
        return meals;
    }

    async findByRestaurant(id:string): Promise<Meal[]>{
        const meal = await this.mealModel.find({restaurant: id});
        return meal;
    }

    async findById(id:string): Promise<Meal>{
        const isValidId = mongoose.isValidObjectId(id);
        if(!isValidId){
            throw new BadRequestException('Wrong mongoose Id error')
        }
        const meal = await this.mealModel.findById(id);
        if(!meal){
            throw new NotFoundException('Meal not found with this Id')
        }

        return meal;
    };

    async updateById(id:string, meal: Meal): Promise<Meal>{
        return await this.mealModel.findByIdAndUpdate(id,meal,{
            new: true,
            runValidators: true
        });

    }


    async deleteById(id:string): Promise<{deleted: Boolean}>{
        const meal = await this.mealModel.findById(id);
 
        const restaurant = await this.restaurantModel.findById(meal.restaurant);
 
        if (!restaurant) {
            throw new NotFoundException('Restaurant not found with this id');
        }
 
         const index = restaurant.menu.indexOf(restaurant.menu.find((item) => item.toString() === id));
 
       if (index > -1) {
            restaurant.menu.splice(index, 1);
       }
 
       await restaurant.save();
       const res = await this.mealModel.findByIdAndDelete(id);
       if(!res){
        return { deleted: false}

       }
        return { deleted: true}
    }
}
