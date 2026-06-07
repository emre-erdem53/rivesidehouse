import { PageHeader } from "@/components/admin/PageHeader";
import { SyncButton } from "@/components/admin/SyncButton";
import { Icon } from "@/components/ui/Icon";
import { getHotelRunner } from "@/lib/hotelrunner/client";
import { getSyncLogs } from "@/lib/admin/queries";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/site";
import { clsx } from "@/lib/clsx";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const hr = getHotelRunner();
  const logs = await getSyncLogs();

  return (
    <>
      <PageHeader
        title="Ayarlar"
        subtitle="Entegrasyon durumu ve sistem yapılandırması."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* HotelRunner bağlantısı */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-lg shadow-sm">
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-headline-sm text-headline-sm text-primary">
              HotelRunner Entegrasyonu
            </h3>
            <span
              className={clsx(
                "inline-flex items-center gap-1 px-sm py-xs rounded-full text-xs font-bold",
                hr.isMock
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-primary-fixed-dim/30 text-on-primary-fixed-variant"
              )}
            >
              <Icon
                name={hr.isMock ? "science" : "cloud_done"}
                className="text-[14px]"
              />
              {hr.isMock ? "MOCK Mod" : "CANLI Bağlantı"}
            </span>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant mb-md">
            {hr.isMock
              ? "Şu anda örnek (mock) veriyle çalışıyor. Canlı bağlantı için .env dosyasına HOTELRUNNER_HR_ID ve HOTELRUNNER_TOKEN değerlerini girin ve HOTELRUNNER_FORCE_MOCK değerini false yapın."
              : "HotelRunner API'sine bağlı. Çift yönlü senkronizasyon aktif."}
          </p>

          <div className="bg-surface-container-low rounded-lg p-md mb-md text-sm font-body-md text-on-surface-variant space-y-xs">
            <p>
              <span className="font-bold text-on-surface">Webhook URL:</span>{" "}
              <code className="text-primary">/api/webhooks/hotelrunner</code>
            </p>
            <p>
              <span className="font-bold text-on-surface">Senkron endpoint:</span>{" "}
              <code className="text-primary">/api/hotelrunner/sync</code>
            </p>
            <p>
              <span className="font-bold text-on-surface">Limitler:</span> 5
              istek/dk, 250 istek/gün (property başına)
            </p>
          </div>

          <SyncButton />
        </section>

        {/* Tesis bilgileri */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-lg shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-md">
            Tesis Bilgileri
          </h3>
          <dl className="space-y-md font-body-md text-body-md">
            <div className="flex justify-between border-b border-outline-variant/10 pb-sm">
              <dt className="text-on-surface-variant">Tesis Adı</dt>
              <dd className="text-on-surface font-medium">{site.name}</dd>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-sm">
              <dt className="text-on-surface-variant">Telefon</dt>
              <dd className="text-on-surface font-medium">
                {site.contact.phone}
              </dd>
            </div>
            <div className="flex justify-between border-b border-outline-variant/10 pb-sm">
              <dt className="text-on-surface-variant">E-posta</dt>
              <dd className="text-on-surface font-medium">
                {site.contact.email}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Para Birimi</dt>
              <dd className="text-on-surface font-medium">{site.currency}</dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Senkron geçmişi */}
      <section className="mt-lg bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-lg shadow-sm">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-md">
          Senkronizasyon Geçmişi
        </h3>
        {logs.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant">
            Henüz senkronizasyon kaydı yok.
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant/10">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between py-sm font-body-md text-body-md"
              >
                <span className="flex items-center gap-sm">
                  <Icon
                    name={log.direction === "PULL" ? "download" : "upload"}
                    className="text-secondary text-[20px]"
                  />
                  <span className="capitalize">{log.entity}</span>
                  <span className="text-on-surface-variant text-sm">
                    ({log.itemCount} kayıt)
                  </span>
                </span>
                <span className="flex items-center gap-md">
                  <span
                    className={clsx(
                      "text-xs font-bold",
                      log.status === "SUCCESS"
                        ? "text-primary"
                        : "text-error"
                    )}
                  >
                    {log.status}
                  </span>
                  <span className="text-on-surface-variant text-sm">
                    {formatDate(log.createdAt)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
