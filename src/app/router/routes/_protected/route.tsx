import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/app/layout/app-layout'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context, location }) => {
    if (context.auth().status !== 'authenticated') {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AppLayout,
})
