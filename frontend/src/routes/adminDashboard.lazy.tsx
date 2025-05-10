// src/routes/adminDashboard.lazy.tsx
import React from 'react'
import adminDashboard from '@/Pages/adminDashboard'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/adminDashboard')({
  component: adminDashboard,
})
