import type { ProjectIconKey } from "@/content/profile";
import {
  PlayIcon,
  ShieldIcon,
  CupIcon,
  ScissorsIcon,
  KanbanIcon,
  TicketIcon,
} from "./icons";

const ICONS: Record<ProjectIconKey, (props: { className?: string }) => React.ReactElement> = {
  media: PlayIcon,
  focus: ShieldIcon,
  cafe: CupIcon,
  barber: ScissorsIcon,
  kanban: KanbanIcon,
  ticket: TicketIcon,
};

/**
 * Stands in for a real screenshot: a project-themed icon in its accent
 * colour over the same raw/exposed-grid treatment used everywhere else a
 * screenshot is still missing. Used on both the Work grid card and inside
 * the case study reader, so a project reads as one consistent identity
 * across the site rather than a generic numbered plate.
 */
export function ProjectVisual({
  icon,
  accent,
  index,
  className,
}: {
  icon: ProjectIconKey;
  accent: string;
  /** Shown small, bottom-right — keeps the "raw/unfinished" plate identity. */
  index?: number;
  className?: string;
}) {
  const Icon = ICONS[icon];

  return (
    <div
      className={`absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#f3efe6_0%,#e6ded0_48%,#efe9dd_100%)] ${className ?? ""}`}
    >
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] [background-size:32px_32px]" />

      <div style={{ color: accent }} className="relative">
        <Icon className="size-14 sm:size-16" />
      </div>

      {index !== undefined && (
        <span className="absolute bottom-4 right-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/30 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
