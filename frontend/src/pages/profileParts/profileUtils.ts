export const formatDate = (value?: string | null) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
};

export const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "just now";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const { label, seconds } of intervals) {
    const value = Math.floor(diffInSeconds / seconds);
    if (value >= 1) {
      return rtf.format(-value, label as Intl.RelativeTimeFormatUnit);
    }
  }

  return "just now";
};

export const STATUS_COLORS = {
  COMPLETED: {
    label: "Completed",
    accent: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    bar: "bg-emerald-500",
  },
  PLAYING: {
    label: "Playing",
    accent: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    bar: "bg-blue-500",
  },
  BACKLOG: {
    label: "Backlog",
    accent: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    bar: "bg-purple-500",
  },
  DROPPED: {
    label: "Dropped",
    accent: "border-red-500/30 bg-red-500/10 text-red-300",
    bar: "bg-red-500",
  },
} as const;
