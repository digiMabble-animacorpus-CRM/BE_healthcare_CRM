import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fs from "fs";
import { PRODUCTION } from './src/core/constants';
export function setupSwagger(app: INestApplication, type: string) {
    const options = new DocumentBuilder()
        .setTitle('Anima API')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    document.security = [{ bearer: [] }];

    SwaggerModule.setup('api-docs', app, document);
    // if (type == 'user') process.env.NODE_ENV != PRODUCTION && fs.writeFileSync('user-swagger.json', JSON.stringify(document, null, 2));
    // else process.env.NODE_ENV != PRODUCTION && fs.writeFileSync('admin-swagger.json', JSON.stringify(document, null, 2));
}
