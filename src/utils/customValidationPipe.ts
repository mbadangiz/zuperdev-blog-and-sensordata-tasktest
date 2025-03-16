import { BadRequestException, ValidationPipe } from "@nestjs/common";

export function customValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const customErrors = errors.map((error) => ({
        field: error.property,
        errMessages: Object.values(error.constraints || {}),
      }));

      throw new BadRequestException({
        success: false,
        message: "Validation failed",
        errors: customErrors,
      });
    },
  });
}
