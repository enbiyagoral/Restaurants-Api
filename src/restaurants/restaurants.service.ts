import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dtos/index';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ){}

    async findAll(): Promise<Restaurant[]>{
        const restaurants = await this.restaurantModel.find({});
        return restaurants;
    };

    async create(restaurant:CreateRestaurantDto): Promise<Restaurant>{
        const newRestaurant = await this.restaurantModel.create(restaurant)
        return newRestaurant;
    };

    async findById(id: string): Promise<Restaurant>{
        const restaurant = await this.restaurantModel.findById(id);

        if(!restaurant){
            throw new NotFoundException('Restaurant not found');
        }
        
        return restaurant;
    };


    async updateById(id: string, restaurant: UpdateRestaurantDto): Promise<Restaurant>{
        return await this.restaurantModel.findByIdAndUpdate(id,restaurant,{
            new: true,
            runValidators: true,
        }); 
    };

    async deleteById(id:string): Promise<Restaurant>{
        return await this.restaurantModel.findByIdAndRemove(id);
    }
}
