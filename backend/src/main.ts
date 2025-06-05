import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Medichoice.AI api doc')
    .setDescription(
      'This is the api documentation of all routes of Medichoice.AI api. Use these carefully',
    )
    .setVersion('1.0')
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
