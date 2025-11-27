"use client"

import { usePathname } from "next/navigation"
import { Fragment } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  const segments = pathname.split("/").filter((segment) => segment !== "")

  // Function to check if a segment is likely an ID (data)
  const isId = (segment: string) => {
    // UUID regex
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    // Simple numeric check
    const numericRegex = /^\d+$/
    // Long alphanumeric strings might be IDs (e.g. mongo ids, or random hashes)
    // Assuming IDs are usually longer than typical route names or contain mixed case/numbers in a way that looks like data
    // For now, let's stick to UUIDs and pure numbers, and maybe very long strings without dashes?
    // Route segments usually use dashes.
    const longAlphanumeric = /^[a-zA-Z0-9]{20,}$/

    return uuidRegex.test(segment) || numericRegex.test(segment) || longAlphanumeric.test(segment)
  }

  const items = []
  let currentPath = ""

  for (const segment of segments) {
    currentPath += `/${segment}`
    if (!isId(segment)) {
      items.push({
        label: segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        href: currentPath
      })
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild><Link href={item.href}>{item.label}</Link></BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
