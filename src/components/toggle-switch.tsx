"use client";

import React, { useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function ToggleSwitch({
  label,
  enabled,
  setEnabled,
}: {
  label: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}) {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("running");
    setEnabled(!enabled);
  };
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <input
        type="checkbox"
        defaultChecked={enabled}
        onChange={handleToggle}
        className="ml-2"
      />
    </div>
  );
}
