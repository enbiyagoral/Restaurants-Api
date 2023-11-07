import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseInterceptors, UploadedFiles, UseGuards, ForbiddenException, } from '@nestjs/common';
import { Query as ExpressQuery} from 'express-serve-static-core';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dtos/index';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private restauranstService: RestaurantsService
    ){}

    @Get()
    @UseGuards(AuthGuard())
    async getAllRestaurants(
        @Query() query: ExpressQuery,
        ):Promise<Restaurant[]>{
        return this.restauranstService.findAll(query);
    };

    @Post()
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles('admin', 'user')
    async createRestaurants(
        @Body() restaurant:CreateRestaurantDto, 
        @CurrentUser() user:User
        ): Promise<Restaurant>{
        return this.restauranstService.create(restaurant, user)
    };

    @Get(':id')
    @UseGuards(AuthGuard())
    async getRestaurant(@Param('id') id: string): Promise<Restaurant>{
        return this.restauranstService.findById(id);
    };

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateRestaurant(
        @Param('id') id: string, 
        @Body() restaurant: UpdateRestaurantDto,
        @CurrentUser() user:User
        ): Promise<Restaurant>{
        const res = await this.restauranstService.findById(id);

        if(res.user.toString() !== user._id.toString()){
            throw new ForbiddenException('You can not this!');
        }
        return this.restauranstService.updateById(id, restaurant);
    };

    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteRestaurant(
        @Param('id') id: string,
        @CurrentUser() user:User
        ): Promise<{deleted: Boolean}>{
        const restaurant = await this.restauranstService.findById(id);
        
        if(restaurant.user.toString() !== user._id.toString()){
            throw new ForbiddenException('You can not this!');
        }
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
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(@Param('id') id:string, @UploadedFiles() files: Array<Express.Multer.File>){
        await this.restauranstService.findById(id);
        return await this.restauranstService.uploadImages(id,files);
    }
}
