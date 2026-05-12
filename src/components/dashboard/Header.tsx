interface HeaderProps {
  userName: string
}

export default function Header({ userName }: HeaderProps) {
  const firstName = userName.split(" ")[0] || "ব্যবহারকারী"
  const initials = firstName.slice(0, 1)

  return (
    <header className="flex items-center justify-between h-16 px-6 md:px-8 bg-[#f3f3f3] border-b border-[#e2e2e2] sticky top-0 z-10">
      <span className="text-sm font-medium text-[#5e5e5e]">TaxFlowBD</span>
      <div className="flex items-center gap-3">
        <p className="text-sm text-[#5e5e5e] hidden sm:block">
          {firstName}
        </p>
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold select-none">
          {initials}
        </div>
      </div>
    </header>
  )
}
