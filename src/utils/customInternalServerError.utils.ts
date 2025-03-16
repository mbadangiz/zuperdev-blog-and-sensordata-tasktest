import { InternalServerErrorException } from "@nestjs/common";

export function customInternalServerError() {
  throw new InternalServerErrorException({
    success: false,
    message: "The operation encountered an error.",
  });
}
