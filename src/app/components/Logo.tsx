import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "w-8 h-8", size = 32 }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Saim Logo"
      width={size}
      height={size}
      priority
      className={`object-contain ${className}`}
    />
  );
}
