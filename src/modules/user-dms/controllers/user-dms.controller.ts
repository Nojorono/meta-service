import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserDmsService } from '../services/user-dms.service';
import { UserDmsDto, UserDmsQueryDto } from '../dtos/user-dms.dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('User DMS')
@Controller('user-dms')
export class UserDmsController {
  constructor(private readonly userDmsService: UserDmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user DMS records' })
  @ApiResponse({
    status: 200,
    description: 'Return all user DMS records',
    type: [UserDmsDto],
  })
  @ApiQuery({
    name: 'userName',
    required: false,
    description: 'Filter by user name',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    description: 'Filter by description',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: UserDmsQueryDto): Promise<any> {
    const data = await this.userDmsService.findAllUserDms(query);
    const total = await this.userDmsService.countUserDms(query);
    return {
      success: true,
      statusCode: 200,
      message: 'User DMS records retrieved successfully',
      data,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        total,
        totalPages: Math.ceil(total / (query.limit || 10)),
      },
    };
  }

  @Get('user-name/:userName')
  @ApiOperation({ summary: 'Get user DMS records by user name' })
  @ApiParam({ name: 'userName', description: 'User name' })
  @ApiResponse({
    status: 200,
    description: 'Return user DMS records with the specified user name',
    type: [UserDmsDto],
  })
  async findByUserName(@Param('userName') userName: string): Promise<any> {
    const data = await this.userDmsService.findAllUserDms({ userName });
    return {
      success: true,
      statusCode: 200,
      message: 'User DMS records retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user DMS record by ID' })
  @ApiParam({ name: 'id', description: 'User DMS ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user DMS record',
    type: UserDmsDto,
  })
  async findById(@Param('id') id: number): Promise<any> {
    const data = await this.userDmsService.findUserDmsById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'User DMS record retrieved successfully',
      data,
    };
  }

  // Microservice endpoints
  @MessagePattern('user-dms.findAll')
  async findAllMicroservice(): Promise<UserDmsDto[]> {
    return await this.userDmsService.findAllUserDms();
  }

  @MessagePattern('user-dms.findById')
  async findByIdMicroservice(@Payload() id: number): Promise<UserDmsDto> {
    return await this.userDmsService.findUserDmsById(id);
  }

  @MessagePattern('user-dms.findByUserName')
  async findByUserNameMicroservice(
    @Payload() userName: string,
  ): Promise<UserDmsDto[]> {
    return await this.userDmsService.findAllUserDms({ userName });
  }
}
