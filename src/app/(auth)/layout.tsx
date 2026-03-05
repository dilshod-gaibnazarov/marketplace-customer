export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-50 via-primary-50/20 to-white flex items-center justify-center p-4">
      {children}
    </div>
  )
}