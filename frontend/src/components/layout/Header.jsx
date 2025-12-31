const Header = () => {
  return (
    <header className="bg-ink-900 border-b border-ink-700">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sand-400 border border-sand-600"></div>
            <div>
              <h1 className="text-lg font-semibold text-sand-50">
                AI Aggregator
              </h1>
              <p className="text-xs text-sand-400">IT for Green & Data Sovereignty</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-xs text-sand-400">Active APIs</p>
              <p className="text-sm font-medium text-sand-50">Gemini · Mistral</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
