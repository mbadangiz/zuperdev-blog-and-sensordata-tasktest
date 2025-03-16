import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerConfig(app: any) {
  const config = new DocumentBuilder()
    .setTitle("Form Generator")
    .setDescription("Api doc for Form Generator")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, documentFactory);
}
