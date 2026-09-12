import { useId } from "react";

export default function BrandMark({ size = 40 }: { size?: number }) {
  const gid = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF8A45" />
          <stop offset="1" stopColor="#EE5D0F" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11.5" fill={`url(#${gid})`} />
      <rect x="6" y="15.4" width="3.4" height="9.2" rx="1.7" fill="#fff" opacity="0.8" />
      <rect x="12.15" y="11.6" width="3.4" height="16.8" rx="1.7" fill="#fff" opacity="0.9" />
      <rect x="18.3" y="7" width="3.4" height="26" rx="1.7" fill="#fff" />
      <rect x="24.45" y="11.6" width="3.4" height="16.8" rx="1.7" fill="#fff" opacity="0.9" />
      <rect x="30.6" y="15.4" width="3.4" height="9.2" rx="1.7" fill="#fff" opacity="0.8" />
    </svg>
  );
}
