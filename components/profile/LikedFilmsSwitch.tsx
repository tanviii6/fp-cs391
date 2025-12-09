/*
  Created By: Christian Gonzalez
*/

"use client";

import { Switch } from "@/components/ui/switch";

interface LikedOnlySwitchProps {
  onToggle?: (checked: boolean) => void;
  className?: string;
  checked?: boolean;
}

export function LikedOnlySwitch({
  onToggle,
  className,
  checked,
}: LikedOnlySwitchProps) {
  const handleChange = (newChecked: boolean) => {
    onToggle?.(newChecked);
  };

  return (
    <div className="mr-0 float-right py-2 pb-0 inline-flex items-center gap-1">
      Show Liked Only
      <Switch
        className={className}
        checked={checked ?? false}
        onCheckedChange={handleChange}
      />
    </div>
  );
}
