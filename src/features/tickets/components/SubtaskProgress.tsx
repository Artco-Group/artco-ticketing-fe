import { type SubtaskProgress as SubtaskProgressType } from '@artco-group/artco-ticketing-sync';

interface SubtaskProgressProps {
  progress: SubtaskProgressType;
}

export function SubtaskProgress({ progress }: SubtaskProgressProps) {
  const { total, completed, percentage } = progress;

  if (total === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-muted-foreground text-sm">
        {completed}/{total} ({percentage}%)
      </span>
    </div>
  );
}
