import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IpWhitelistMiddleware } from './middleware/ip-whitelist.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new IpWhitelistMiddleware().use);
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description for your application')
    .setVersion('1.0')
    .addBearerAuth() // Optional: If you use JWT token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
