// Ödeme sağlayıcı soyutlaması (pluggable).
// iyzico / Stripe gibi gerçek sağlayıcılar bu arayüzü uygulayarak eklenir.

export type PaymentIntent = {
  amount: number;
  currency: string;
  reference: string; // dahili rezervasyon kodu
  customer: {
    name: string;
    email?: string;
    phone?: string;
  };
};

export type PaymentResult = {
  success: boolean;
  provider: string;
  transactionId?: string;
  // Yönlendirme tabanlı sağlayıcılar için (3D Secure vb.)
  redirectUrl?: string;
  error?: string;
};

export interface PaymentProvider {
  readonly name: string;
  /** Ödeme başlatır. Yönlendirme gerekiyorsa redirectUrl döner. */
  createPayment(intent: PaymentIntent): Promise<PaymentResult>;
  /** Sağlayıcı callback'i sonrası ödemeyi doğrular. */
  verifyPayment(transactionId: string): Promise<PaymentResult>;
}
