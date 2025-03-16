export function generateRandomNumberByLength(length: number) {
  let otpCode = Math.ceil(Math.random() * Math.pow(10, length)).toString();

  while (otpCode.length < length) {
    otpCode = Math.ceil(Math.random() * length).toString();
  }

  return otpCode;
}
