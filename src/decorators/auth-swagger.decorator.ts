import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function AuthSwagger() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - JWT token is required',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
          timestamp: {
            type: 'string',
            example: '2025-07-22T05:45:00.000Z',
          },
        },
      },
    }),
  );
}
