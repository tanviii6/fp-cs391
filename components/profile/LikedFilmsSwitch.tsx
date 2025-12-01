"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface LikedOnlySwitchProps {
  onToggle?: (checked: boolean) => void;
  className?: string;
}

export function LikedOnlySwitch({ onToggle, className }: LikedOnlySwitchProps) {
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  const handleChange = (checked: boolean) => {
    setShowLikedOnly(checked);
    onToggle?.(checked);
  };

  return (
    <div className="mr-0 float-right py-2 pb-0 inline-flex items-center gap-1">
      Show Liked Only
      <Switch
        className={className}
        checked={showLikedOnly}
        onCheckedChange={handleChange}
      />
    </div>
  );
}
