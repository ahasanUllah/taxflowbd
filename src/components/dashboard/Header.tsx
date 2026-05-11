interface HeaderProps {
  userName: string
}

export default function Header({ userName }: HeaderProps) {
  const firstName = userName.split(" ")[0] || "ব্যবহারকারী"

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-foreground">ড্যাশবোর্ড</h1>
      <p className="text-sm text-gray-600">
        স্বাগত, <span className="font-medium text-brand-primary">{firstName}</span>!
      </p>
    </header>
  )
}
