import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  ApiResponseSchemaHost,
  getSchemaPath,
} from '@nestjs/swagger';

class EmptyClass {}

export class ResponseDto<T> {
  data: T;

  @ApiProperty({ default: 200 })
  statusCode: number;

  @ApiProperty({ default: 'success' })
  message: string;

  constructor(statusCode: number, data?: any, message = 'success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  static success(data?: any) {
    return new ResponseDto(200, data);
  }
}

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  results: TData[];
}

export const CustomApiResponse = <
  DataDto extends Type<any>,
  WrapperDataDto extends Type<unknown>,
>(
  dataDto: DataDto,
  wrapperDataDto: WrapperDataDto,
  dataType = 'object',
  options?: Partial<ApiResponseSchemaHost>,
) =>
  applyDecorators(
    ApiExtraModels(wrapperDataDto, dataDto),
    ApiResponse({
      status: 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(wrapperDataDto) },
          {
            properties: {
              data: {
                type: dataType,
                [dataType === 'object' ? '$ref' : 'items']:
                  dataType === 'object'
                    ? getSchemaPath(dataDto)
                    : { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
      ...options,
    }),
  );

export const ApiOkResponseData = <DataDto extends Type<any>>(
  dataDto?: DataDto,
  dataType: 'object' | 'array' = 'object',
  options?: Partial<ApiResponseSchemaHost>,
) => CustomApiResponse(dataDto ?? EmptyClass, ResponseDto, dataType, options);

export const ApiCreatedResponseData = <DataDto extends Type<any>>(
  dataDto?: DataDto,
  dataType: 'object' | 'array' = 'object',
  options?: Partial<ApiResponseSchemaHost>,
) =>
  CustomApiResponse(dataDto ?? EmptyClass, ResponseDto, dataType, {
    status: 201,
    ...options,
  });

export const ApiOkResponsePaginated = <DataDto extends Type<any>>(
  dataDto: DataDto,
) => CustomApiResponse(dataDto, PaginatedDto);
