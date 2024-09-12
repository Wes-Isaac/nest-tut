import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type ResponseObject = {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new CustomLoggerService(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObj: ResponseObject = {
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: '',
    };
    if (exception instanceof HttpException) {
      responseObj.statusCode = exception.getStatus();
      responseObj.message = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      responseObj.statusCode = 422;
      responseObj.message = exception.message.replaceAll(/\n/g, ' ');
    } else {
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObj.message = 'Internal Server Error';
    }
    response.status(responseObj.statusCode).json(responseObj);
    this.logger.error(responseObj.message, AllExceptionsFilter.name);
    super.catch(exception, host);
  }
}
