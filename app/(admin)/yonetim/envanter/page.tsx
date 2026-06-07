import { PageHeader } from "@/components/admin/PageHeader";
import { InventoryEditor } from "@/components/admin/InventoryEditor";
import { SyncButton } from "@/components/admin/SyncButton";
import { getInventory } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const inventory = await getInventory();

  return (
    <>
      <PageHeader
        title="Envanter"
        subtitle="Oda müsaitliği, fiyatları ve kısıtlamaları yönetin. Değişiklikler HotelRunner'a gönderilir."
        action={<SyncButton />}
      />

      <div className="flex flex-col gap-md">
        {inventory.map((room) => (
          <InventoryEditor key={room.id} room={room} />
        ))}
      </div>
    </>
  );
}
