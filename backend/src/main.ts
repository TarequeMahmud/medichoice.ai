import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Medichoice.AI api doc')
    .setDescription(
      'This is the api documentation of all routes of Medichoice.AI api. Use these carefully',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addCookieAuth('access-token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access-token',
      description: 'JWT access token stored in cookie',
    })
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
      content: {
        'application/json': {
          example: {
            statusCode: 500,
            message: 'Internal server error',
          },
        },
      },
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
