"use client";

import { useState } from "react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  placeholder?: string;
}

const datePresets = [
  {
    label: "Today",
    value: "today",
    getRange: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Yesterday",
    value: "yesterday",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    label: "Last 7 days",
    value: "last7days",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 days",
    value: "last30days",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "This week",
    value: "thisweek",
    getRange: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "This month",
    value: "thismonth",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "This year",
    value: "thisyear",
    getRange: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
  {
    label: "Custom range",
    value: "custom",
    getRange: () => ({
      from: undefined,
      to: undefined,
    }),
  },
];

export function DateFilter({ value, onChange, className, placeholder = "Select date range" }: DateFilterProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePresetChange = (presetValue: string) => {
    setSelectedPreset(presetValue);
    if (presetValue !== "custom") {
      const preset = datePresets.find(p => p.value === presetValue);
      if (preset) {
        const range = preset.getRange();
        onChange(range);
        setIsCalendarOpen(false);
      }
    } else {
      setIsCalendarOpen(true);
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      onChange(range);
      setSelectedPreset("custom");
    }
  };

  const formatDateRange = () => {
    if (!value.from) {
      return placeholder;
    }

    if (value.from && value.to) {
      // Check if it matches any preset
      const matchingPreset = datePresets.find(preset => {
        if (preset.value === "custom") return false;
        const presetRange = preset.getRange();
        return (
          presetRange.from?.getTime() === value.from?.getTime() &&
          presetRange.to?.getTime() === value.to?.getTime()
        );
      });

      if (matchingPreset) {
        return matchingPreset.label;
      }

      // Format custom range
      if (value.from.toDateString() === value.to.toDateString()) {
        return format(value.from, "MMM dd, yyyy");
      }
      return `${format(value.from, "MMM dd")} - ${format(value.to, "MMM dd, yyyy")}`;
    }

    return format(value.from, "MMM dd, yyyy");
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {/* Preset Selector */}
      <Select value={selectedPreset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[100]">
          {datePresets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range Display/Picker */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "h-8 text-xs justify-start text-left font-normal min-w-[200px]",
              !value.from && "text-muted-foreground"
            )}
            onClick={() => setIsCalendarOpen(true)}
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            {formatDateRange()}
            <ChevronDown className="ml-auto h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[90]" align="start" side="bottom" sideOffset={4}>
          <div className="p-3">
            <div className="space-y-3">
              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-2">
                {datePresets.slice(0, -1).map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      const range = preset.getRange();
                      onChange(range);
                      setSelectedPreset(preset.value);
                      setIsCalendarOpen(false);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              
              {/* Divider */}
              <div className="border-t" />
              
              {/* Custom Calendar */}
              <div>
                <p className="text-sm font-medium mb-2">Custom range</p>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={value.from}
                  selected={value}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 