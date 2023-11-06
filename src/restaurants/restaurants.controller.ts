import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { Query as ExpressQuery} from 'express-serve-static-core';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dtos/index';
import { FilesInterceptor } from '@nestjs/platform-express';


@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private restauranstService: RestaurantsService
    ){}

    @Get()
    async getAllRestaurants(@Query() query: ExpressQuery):Promise<Restaurant[]>{
        return this.restauranstService.findAll(query);
    };

    @Post()
    async createRestaurants(@Body() restaurant:CreateRestaurantDto): Promise<Restaurant>{
        return this.restauranstService.create(restaurant)
    };

    @Get(':id')
    async getRestaurant(@Param('id') id: string): Promise<Restaurant>{
        return this.restauranstService.findById(id);
    };

    @Put(':id')
    async updateRestaurant(@Param('id') id: string, @Body() restaurant: UpdateRestaurantDto): Promise<Restaurant>{
        await this.restauranstService.findById(id);
        return this.restauranstService.updateById(id, restaurant);
    };

    @Delete(':id')
    async deleteRestaurant(@Param('id') id: string): Promise<{deleted: Boolean}>{
        const restaurant = await this.restauranstService.findById(id);
        const isDeleted = await this.restauranstService.deleteImages(restaurant.images);

        if(isDeleted){
            this.restauranstService.deleteById(id);

            return {
                deleted: true,
            };
        }else{
            return {
                deleted: false,
            };
        }
    };

    @Put('upload/:id')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(@Param('id') id:string, @UploadedFiles() files: Array<Express.Multer.File>){
        await this.restauranstService.findById(id);
        return await this.restauranstService.uploadImages(id,files);
    }
}
