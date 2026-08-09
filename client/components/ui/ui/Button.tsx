import Link from 'next/link'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

interface ButtonBase {
  children: React.ReactNode
  href?: string
  className?: string
}

type ButtonProps = ButtonBase & ButtonHTMLAttributes<HTMLButtonElement>
type AnchorProps = ButtonBase & AnchorHTMLAttributes<HTMLAnchorElement>

export function ButtonPrimary({ children, href, className = "", style, ...props }: ButtonProps | AnchorProps) {
  const cls = `
    inline-flex items-center justify-center gap-2
    px-7 py-3.5 rounded-xs
    text-[var(--color-text-primary)] font-semibold text-sm
    hover:brightness-110
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `.trim()

  const mergedStyle = {
    backgroundImage: "url('/btnbg.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    ...style,
  }

  if (href) return <Link href={href} className={cls} style={mergedStyle}>{children}</Link>
  return <button className={cls} style={mergedStyle} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
}

export function ButtonSecondary({ children, href, className = "", ...props }: ButtonProps | AnchorProps) {
  const cls = `
    inline-flex items-center justify-center gap-2
    px-7 py-3.5 rounded-xs
    border border-[var(--color-primary)]
    text-[var(--color-primary)] font-semibold text-sm
    bg-transparent
    hover:bg-[var(--color-primary)]/8
    hover:-translate-y-0.5
    active:translate-y-0
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
    ${className}
  `.trim()

  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
}

export function ButtonDark({ children, href, className = "", style, ...props }: ButtonProps | AnchorProps) {
  const cls = `
    inline-flex items-center justify-center gap-2
    px-4 py-2 rounded-xs
    text-[var(--color-text-primary)] font-medium text-sm
    hover:brightness-110
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `.trim()

  const mergedStyle = {
    backgroundImage: "url('/btnbg.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    ...style,
  }

  if (href) return <Link href={href} className={cls} style={mergedStyle}>{children}</Link>
  return <button className={cls} style={mergedStyle} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
}
