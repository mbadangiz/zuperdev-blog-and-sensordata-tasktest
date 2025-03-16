var Kavenegar = require("kavenegar");
var api = Kavenegar.KavenegarApi({
  apikey:
    "38542B496F2B496E6E4869515254572F763855346A4E563742424A796346797431505876352B4D2B77726F3D",
});

export async function sendSms(message: string, receptor: string) {
  return await api.Send({
    sender: "2000660110",
    message,
    receptor,
  });
}
