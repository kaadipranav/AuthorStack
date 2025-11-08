'use client';

import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

interface RemindersToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function RemindersToggle({ enabled, onChange }: RemindersToggleProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300"
        />
        <div className="flex-1">
          <p className="font-medium flex items-center gap-2">
            {enabled ? (
              <>
                <Bell className="w-4 h-4 text-primary" />
                Email Reminders Enabled
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4 text-gray-400" />
                Email Reminders Disabled
              </>
            )}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {enabled
              ? 'You\'ll receive email reminders 7, 3, and 1 day(s) before each task is due, plus a launch day notification.'
              : 'You won\'t receive any email reminders for this launch.'}
          </p>
        </div>
      </label>
    </div>
  );
}
