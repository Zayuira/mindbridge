/**
 * SMS илгээх модуль.
 * Бодит SMS гарц (Twilio, Vonage гэх мэт) нь төлбөртэй байдаг тул 
 * "Үнэгүй" шийдлийн хүрээнд хөгжүүлэлтийн явцад кодоор консол дээр хэвлэнэ.
 */
export async function sendSMS({ to, message }: { to: string; message: string }) {
  // Энд бодит API-г холбож болно (Жишээ нь: Twilio, SMS.mn гэх мэт)
  console.log('--- SIMULATED SMS ---');
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  console.log('-------------------------');

  // Хэрэв ирээдүйд API холбох бол доорх хэсгийг идэвхжүүлнэ:
  /*
  const response = await fetch('YOUR_SMS_GATEWAY_URL', {
    method: 'POST',
    body: JSON.stringify({ to, message }),
    headers: { 'Content-Type': 'application/json' }
  });
  return response.ok;
  */

  return { success: true, simulated: true };
}
