"use client";

import { useState, useCallback } from "react";

interface PhoneLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  number: string; // e.g. "+15875550142"
  display: string; // e.g. "(587) 555-0142"
  showIcon?: boolean;
}

export function PhoneLink({
  number,
  display,
  className,
  showIcon = true,
  children,
  ...rest
}: PhoneLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // On mobile, let the tel: protocol handle it natively
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        return;
      }
      // On desktop, copy the number
      e.preventDefault();
      navigator.clipboard.writeText(display).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    },
    [display],
  );

  return (
    <a
      href={`tel:${number}`}
      onClick={handleClick}
      className={className}
      title={copied ? "Copied!" : "Click to copy phone number"}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <>
          {showIcon && <span aria-hidden="true">📞</span>}
          {copied ? "Copied!" : display}
        </>
      )}
    </a>
  );
}
