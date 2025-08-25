import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mime from 'mime-types'; // 👈 Add this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // ✅ Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Swagger Test')
    .setDescription('API documentation for managing all api')
    .setVersion('1.0')
    .addTag('swagger api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads'), {
     setHeaders: (res, path) => {
  let contentType = mime.lookup(path);
  if (!contentType) {
    if (path.endsWith('.mp4')) contentType = 'video/mp4';
    else if (path.endsWith('.pdf')) contentType = 'application/pdf';
    else if (path.endsWith('.jpg') || path.endsWith('.jpeg'))
      contentType = 'image/jpeg';
    else if (path.endsWith('.png')) contentType = 'image/png';
  }

  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range');
  res.setHeader(
    'Access-Control-Expose-Headers',
    'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
  );
  res.setHeader('Accept-Ranges', 'bytes');
}

    }),
  );

// app.enableCors({
//   origin: 'http://192.168.2.115:5173',
//   credentials: true,
// });
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://172.24.112.1:5173',
      'http://localhost:5173',
      "http://172.16.0.24:5173"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: origin ${origin} not allowed`));
    }
  },
  credentials: true,
});


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
await app.listen(3000, '0.0.0.0');
}
bootstrap();
