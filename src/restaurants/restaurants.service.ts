import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dtos/index';
import { Query } from 'express-serve-static-core';
import APIFeatures from '../utils/apiFeatures.util';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ){}

    async findAll(query:Query): Promise<Restaurant[]>{
        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = (currentPage-1) * resPerPage;


        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        }: {}

        const restaurants = await this.restaurantModel
            .find({...keyword})
            .limit(resPerPage)
            .skip(skip);

        return restaurants;
    };

    async create(restaurant:CreateRestaurantDto, user:User): Promise<Restaurant>{
        const location = await APIFeatures.getRestaurantLocation(restaurant.address)

        const data = Object.assign(restaurant, { user: user._id, location})

        const newRestaurant = await this.restaurantModel.create(data)
        return newRestaurant;
    };

    async findById(id: string): Promise<Restaurant>{
        const isValidId = mongoose.isValidObjectId(id);

        if(!isValidId){
            throw new NotFoundException('Restaurant not found');
        }

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

    async uploadImages(id, files){
        const images = await APIFeatures.upload(files);
        const restaurant = await this.restaurantModel.findByIdAndUpdate(id,{
            images: images as Object[]
        },{
            new: true,
            runValidators: true
        })

        return restaurant;
    };

    async deleteImages(images){
        if(images.length === 0) return true;
        return await APIFeatures.deleteImages(images);
    }
}
