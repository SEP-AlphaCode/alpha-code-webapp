interface RobotPageHeaderProps {
  title: string;
  subtitle: string;
}

export function RobotPageHeader({ title, subtitle }: RobotPageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 mb-6 py-4 px-6 rounded-xl shadow flex items-center justify-between">
      <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{title}</h1>
      <span className="text-base text-gray-500 font-medium">{subtitle}</span>
    </header>
  );
}