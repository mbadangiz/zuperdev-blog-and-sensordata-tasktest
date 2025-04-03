import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { customValidationPipe } from "./utils/customValidationPipe";
import { swaggerConfig } from "./configs/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(customValidationPipe());
  swaggerConfig(app);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  await app.listen(1420);
  console.log("Click to view the project document=> http://localhost:1420/api");
}
bootstrap();
