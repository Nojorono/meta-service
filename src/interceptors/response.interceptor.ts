import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  HTTP_SUCCESS_STATUS_MESSAGES,
  RESPONSE_SERIALIZATION_META_KEY,
} from 'src/app/app.constant';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18nService: I18nService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const status =
      this.reflector.get<number>('__httpCode__', context.getHandler()) || 200;
    const request = context.switchToHttp().getRequest();

    const classSerialization: ClassConstructor<any> = this.reflector.get<
      ClassConstructor<any>
    >(RESPONSE_SERIALIZATION_META_KEY, context.getHandler());

    return next.handle().pipe(
      map((body: unknown) => {
        let responseData: unknown = body;

        if (classSerialization?.name === GenericResponseDto?.name) {
          const getData = body as GenericResponseDto;
          getData.message = this.i18nService.translate(getData.message, {
            lang: request.headers['accept-language'] || 'en',
            defaultValue: 'Operation successful.',
          });
          responseData = plainToInstance(classSerialization, getData);
        } else if (classSerialization) {
          responseData = plainToInstance(classSerialization, body);
        }

        const wrappedBody = responseData as Record<string, unknown>;
        if (
          wrappedBody &&
          typeof wrappedBody === 'object' &&
          Object.prototype.hasOwnProperty.call(wrappedBody, 'data')
        ) {
          // Avoid nested data.data in global response envelope.
          responseData = wrappedBody.data;
        }

        return {
          statusCode: status,
          message: HTTP_SUCCESS_STATUS_MESSAGES[status] || 'OK',
          data: responseData,
        };
      }),
    );
  }
}
