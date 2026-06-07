import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatCurrency } from "@/lib/site";

export type RoomCardData = {
  slug: string;
  name: string;
  basePrice: number;
  heroImage: string;
  amenities: { icon: string; label: string }[];
};

export function RoomCard({ room }: { room: RoomCardData }) {
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10 group">
      <div className="h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.heroImage}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-md">
        <div className="flex justify-between items-center mb-xs">
          <h4 className="font-headline-sm text-headline-sm text-primary">
            {room.name}
          </h4>
          <span className="font-label-md text-primary">
            {formatCurrency(room.basePrice)}
            <span className="text-on-surface-variant font-normal"> /gece</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-sm mb-md text-on-surface-variant">
          {room.amenities.slice(0, 2).map((a) => (
            <span key={a.label} className="flex items-center gap-xs font-label-sm">
              <Icon name={a.icon} className="text-[16px]" />
              {a.label}
            </span>
          ))}
        </div>
        <Link
          href={`/odalar/${room.slug}`}
          className="block w-full text-center border border-primary text-primary py-sm rounded-lg font-label-md hover:bg-primary hover:text-on-primary transition-all"
        >
          İncele
        </Link>
      </div>
    </div>
  );
}
