'use client'
import dynamic from 'next/dynamic';
import React from 'react'
const ClientSideComponent = dynamic(
    () => import('./use-me'),
    { ssr: false }
);
export default function page() {
    return (
        <div>
            <ClientSideComponent />
        </div>
    )
}
