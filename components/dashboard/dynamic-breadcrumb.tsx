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
import { Badge } from "../ui/badge"
import Link from "next/link"

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  const segments = pathname.split("/").filter((segment) => segment !== "")

  const isId = (segment: string) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    const numericRegex = /^\d+$/
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
    <Breadcrumb className="hidden lg:block">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                  <Badge variant={"outline"}>{item.label}</Badge></BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild><Link href={item.href}>
                    <Badge variant={"outline"}>{item.label}</Badge></Link></BreadcrumbLink>
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
