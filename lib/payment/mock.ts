import type { PaymentProvider, PaymentIntent, PaymentResult } from "./types";

/**
 * Geliştirme/demo için mock ödeme sağlayıcısı.
 * Her ödemeyi başarılı kabul eder. Gerçek entegrasyon eklenene kadar kullanılır.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async createPayment(intent: PaymentIntent): Promise<PaymentResult> {
    return {
      success: true,
      provider: this.name,
      transactionId: `MOCK-PAY-${intent.reference}-${Date.now()}`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return { success: true, provider: this.name, transactionId };
  }
}
