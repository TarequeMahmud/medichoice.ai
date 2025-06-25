import { InternalServerErrorException } from '@nestjs/common';

export function rethrowIfError(error: unknown): never {
  if (error instanceof Error) {
    console.log(error);
    throw error;
  }
  throw new InternalServerErrorException('An unexpected error occurred');
}
