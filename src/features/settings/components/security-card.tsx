"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LoginEvent, SecuritySession } from "@/features/settings/types";
import { formatRelativeTime } from "@/lib/utils";

export function SecurityCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[14px] border border-line-strong bg-surface p-5 shadow-s">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-ink">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-ink-soft">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export function SessionRow({
  session,
  onLogout,
}: {
  session: SecuritySession;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-line py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-ink">{session.device}</p>
          {session.current ? <Badge variant="default">This device</Badge> : null}
        </div>
        <p className="text-[0.78rem] text-ink-faint">
          {session.location} · {formatRelativeTime(session.lastActive)}
        </p>
      </div>
      {!session.current ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          shape="soft"
          className="rounded-[8px]"
          onClick={onLogout}
        >
          Log out
        </Button>
      ) : null}
    </div>
  );
}

export function LoginHistoryRow({ event }: { event: LoginEvent }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-0">
      <div>
        <p className="text-sm text-ink">{event.device}</p>
        <p className="text-[0.72rem] text-ink-faint">
          {event.location} · {formatRelativeTime(event.at)}
        </p>
      </div>
      <Badge variant={event.status === "success" ? "default" : "gold"}>
        {event.status}
      </Badge>
    </div>
  );
}
