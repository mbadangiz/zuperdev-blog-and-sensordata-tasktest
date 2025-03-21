import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export function swaggerConfig(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Blog App")
    .setDescription("API Documentation for BlogApp")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);
}
