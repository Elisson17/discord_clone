import {
  Avatar as AvatarBase,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";
import { STATUS_COLOR } from "@/utils/statusUtils";
import { cn } from "@/lib/utils";

interface AvatarProps {
  url?: string;
  name: string;
  size?: number;
  /** 0=online 1=ausente 2=não perturbe 3=offline */
  status?: number;
  className?: string;
}

export default function Avatar({ url, name, size = 40, status, className }: AvatarProps) {
  return (
    <AvatarBase
      style={{ width: size, height: size, minWidth: size }}
      className={cn("shrink-0", className)}
    >
      <AvatarImage src={url ?? ""} alt={name} />
      <AvatarFallback className="bg-[#36393f] text-[#dbdee1] text-xs font-semibold">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
      {status !== undefined && (
        <AvatarBadge
          style={{ backgroundColor: STATUS_COLOR[status] ?? STATUS_COLOR[3] }}
          className="border-2 border-[#232428]"
        />
      )}
    </AvatarBase>
  );
}
