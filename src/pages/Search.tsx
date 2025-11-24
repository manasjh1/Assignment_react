import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Changed: Import searchAPI (named export) and SearchResult type
import { searchAPI, type SearchResult } from '@/services/api';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

const Search = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Changed: Call the search method which performs a POST request
      const response = await searchAPI.search(searchQuery);
      setResults(response.data.results);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to fetch results. Please try again.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="p-4 flex items-center relative z-50 justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <ThemeToggle />
      </header>

      {/* Main search area */}
      <main className={`flex-1 flex flex-col items-center px-4 transition-all duration-500 ease-in-out ${hasSearched ? 'pt-8 justify-start' : 'justify-center -mt-20'}`}>
        
        {/* Logo - Only visible when NOT searching/hasn't searched yet */}
        {!hasSearched && (
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-foreground transition-all tracking-tight">
            MCP Search
          </h1>
        )}

        {/* Search form */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
          <div className="relative mb-8 group">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-14 pl-6 pr-14 rounded-full border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm text-lg transition-all"
            />
            
            {/* Right Icon (Blue Arrow Button) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {isLoading ? (
                <div className="flex items-center justify-center h-10 w-10">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                <Button 
                  type="submit" 
                  size="icon" 
                  onClick={() => handleSearch()}
                  className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center justify-center"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Results Section */}
        {hasSearched && (
          <div className="w-full max-w-3xl mt-2 space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-16 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Found {results.length} results for "{searchQuery}"
                </p>
                {results.map((result, index) => (
                  <Card key={index} className="border-none shadow-none bg-transparent p-0">
                    <CardHeader className="p-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span className="truncate max-w-[200px] font-semibold">{result.source}</span>
                        <span>•</span>
                        <a href={result.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                          {new URL(result.url).hostname}
                        </a>
                      </div>
                      <CardTitle className="text-xl text-primary font-medium hover:underline p-0">
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          {result.title}
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-2">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {result.snippet}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <p>No results found for "{searchQuery}".</p>
                <p className="text-sm mt-2">Try different keywords.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MCP Search. All rights reserved.</p>
        <p className="mt-1">Made by <span className="font-medium text-foreground">Manas Jha</span></p>
      </footer>
    </div>
  );
};

export default Search;