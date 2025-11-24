import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Mic, Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Here you would typically perform the search
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button */}
      <header className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </header>

      {/* Main search area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        {/* Logo */}
        <h1 className="text-6xl font-normal mb-8 text-foreground">
          MCP Search
        </h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MCP..."
              className="w-full h-12 pl-12 pr-24 rounded-full border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              type="submit"
              variant="secondary"
              className="px-6"
            >
              MCP Search
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="px-6"
            >
              I'm Feeling Lucky
            </Button>
          </div>
        </form>

        {/* Language options */}
        <div className="mt-8 text-sm text-muted-foreground">
          MCP offered in:{' '}
          <button className="text-primary hover:underline">हिन्दी</button>
          {' '}
          <button className="text-primary hover:underline">বাংলা</button>
          {' '}
          <button className="text-primary hover:underline">తెలుగు</button>
          {' '}
          <button className="text-primary hover:underline">मराठी</button>
          {' '}
          <button className="text-primary hover:underline">தமிழ்</button>
          {' '}
          <button className="text-primary hover:underline">ગુજરાતી</button>
          {' '}
          <button className="text-primary hover:underline">ಕನ್ನಡ</button>
          {' '}
          <button className="text-primary hover:underline">മലയാളം</button>
          {' '}
          <button className="text-primary hover:underline">ਪੰਜਾਬੀ</button>
        </div>
      </main>
    </div>
  );
};

export default Search;
