"use client";

import { Camera, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SettingsProfile } from "@/features/settings/types";

export function ProfileHeader({
  profile,
  onEdit,
  onChangePhoto,
}: {
  profile: SettingsProfile;
  onEdit?: () => void;
  onChangePhoto?: () => void;
}) {
  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`;

  return (
    <div className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-s">
      <div className="h-24 bg-gradient-to-br from-emerald via-emerald-bright to-emerald/80 md:h-28" />
      <div className="relative px-5 pb-5 sm:px-6">
        <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <AvatarUploader
              initials={initials}
              photoUrl={profile.photoUrl}
              onChangePhoto={onChangePhoto}
            />
            <div className="pb-1">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-ink-soft">{profile.title}</p>
              <p className="mt-0.5 text-[0.78rem] text-ink-faint">
                {profile.location} · {profile.careerLevel.replace("-", " ")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <Badge variant="default">
              Profile {profile.profileCompletion}%
            </Badge>
            <Button
              type="button"
              variant="outline"
              shape="soft"
              className="rounded-[8px]"
              onClick={onEdit}
            >
              Edit Profile
            </Button>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper-dim">
          <motion.div
            className="h-full rounded-full bg-emerald"
            initial={{ width: 0 }}
            animate={{ width: `${profile.profileCompletion}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </div>
  );
}

export function AvatarUploader({
  initials,
  photoUrl,
  onChangePhoto,
  className,
}: {
  initials: string;
  photoUrl?: string;
  onChangePhoto?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-[18px] border-4 border-surface bg-emerald-wash text-emerald shadow-m sm:size-24">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="font-serif text-2xl font-semibold" aria-hidden>
            {initials || <UserRound className="size-8" />}
          </span>
        )}
      </div>
      <Button
        type="button"
        size="icon-sm"
        shape="soft"
        className="absolute -right-1 -bottom-1 rounded-full shadow-s"
        aria-label="Change photo"
        onClick={onChangePhoto}
      >
        <Camera className="size-3.5" />
      </Button>
    </div>
  );
}
