"use client"

import React from "react"
import { AppSidebar } from "@/components/admin-sidebar"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { AuthGuard } from "@/components/auth-guard"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Function to format path segments into a display name
function formatPathToDisplayName(path: string): string {
  return path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
function AdminBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [];

  // Nếu là trang chính admin, hiển thị Quản trị viên -> Bảng điều khiển
  if (pathname === '/admin') {
    breadcrumbItems.push({
      href: '/admin',
      label: 'Quản trị viên',
      isLast: false
    });
    breadcrumbItems.push({
      href: '/admin',
      label: 'Bảng điều khiển',
      isLast: true
    });
  } else {
    // Nếu là trang con, hiển thị Quản trị viên -> Tên trang hiện tại
    breadcrumbItems.push({
      href: '/admin',
      label: 'Quản trị viên',
      isLast: false
    });
    // Lấy tên trang từ segment cuối cùng
    const lastSegment = pathSegments[pathSegments.length - 1];
    // Chuyển đổi segment thành tên hiển thị tiếng Việt
    let currentPageName = '';
    switch (lastSegment) {
      case 'dashboard':
        currentPageName = 'Bảng điều khiển'; break;
      case 'users':
        currentPageName = 'Người dùng'; break;
      case 'settings':
        currentPageName = 'Cài đặt'; break;
      case 'analytics':
        currentPageName = 'Phân tích'; break;
      case 'robots':
        currentPageName = 'Robot'; break;
      case 'classrooms':
        currentPageName = 'Lớp học'; break;
      case 'qrcodes':
        currentPageName = 'Mã QR'; break;
      case 'osmo-cards':
        currentPageName = 'Thẻ Osmo'; break;
      case 'settings':
        currentPageName = 'Cài đặt'; break;
      case 'token-price':
        currentPageName = 'Giá token'; break;
      case 'key-price':
        currentPageName = 'Giá bản quyền'; break;
      case 'actions':
        currentPageName = 'Hành động'; break;
      case 'dances':
        currentPageName = 'Điệu nhảy'; break;
      case 'expressions':
        currentPageName = 'Biểu cảm'; break;
      case 'extended-actions':
        currentPageName = 'Hành động mở rộng'; break;
      case 'skills':
        currentPageName = 'Kỹ năng'; break;
      // Thêm các trường hợp khác nếu cần
      default:
        currentPageName = formatPathToDisplayName(lastSegment);
    }
    breadcrumbItems.push({
      href: pathname,
      label: currentPageName,
      isLast: true
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}-${item.href.replace(/\//g, '-')}`}>
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator className="hidden md:block" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <AuthGuard allowedRoles={['admin']}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <AdminBreadcrumb />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
  )
}
