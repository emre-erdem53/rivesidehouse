import type { PaymentProvider } from "./types";
import { MockPaymentProvider } from "./mock";

export * from "./types";

/**
 * Yapılandırılmış ödeme sağlayıcısını döner.
 * PAYMENT_PROVIDER env değişkeni ile seçilir (varsayılan: mock).
 *
 * Gerçek sağlayıcı eklemek için:
 *   1. PaymentProvider arayüzünü uygulayan bir sınıf yazın (örn. IyzicoProvider).
 *   2. Aşağıdaki switch'e ekleyin.
 *   3. .env içine PAYMENT_PROVIDER=iyzico ve ilgili anahtarları girin.
 */
export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? "mock";
  switch (provider) {
    // case "iyzico":
    //   return new IyzicoProvider();
    // case "stripe":
    //   return new StripeProvider();
    case "mock":
    default:
      return new MockPaymentProvider();
  }
}
