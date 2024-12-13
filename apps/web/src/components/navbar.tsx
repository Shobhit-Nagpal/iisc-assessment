export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto p-2">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="font-bold text-xl text-primary">
              Maps
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
