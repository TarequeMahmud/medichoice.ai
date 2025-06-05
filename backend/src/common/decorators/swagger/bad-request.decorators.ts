import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

export function ApiValidationError() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Validation failed',
      schema: {
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'email must be an email',
              'password must be at least 8 characters',
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
  );
}
