import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Edit, Filter, Sparkles, Plug } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  results: number;
}

interface ImageHistoryItem {
  id: string;
  prompt: string;
  timestamp: string;
  imageUrl: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Search History State
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([
    { id: '1', query: 'React hooks tutorial', timestamp: '2024-01-20 10:30', results: 142 },
    { id: '2', query: 'TypeScript best practices', timestamp: '2024-01-19 15:45', results: 89 },
    { id: '3', query: 'Tailwind CSS components', timestamp: '2024-01-18 09:15', results: 256 },
  ]);
  const [searchFilter, setSearchFilter] = useState('');
  const [editingSearch, setEditingSearch] = useState<SearchHistoryItem | null>(null);
  const [editSearchQuery, setEditSearchQuery] = useState('');

  // Image History State
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([
    { id: '1', prompt: 'Beautiful sunset over mountains', timestamp: '2024-01-20 14:20', imageUrl: '/placeholder.svg' },
    { id: '2', prompt: 'Modern office workspace', timestamp: '2024-01-19 11:30', imageUrl: '/placeholder.svg' },
    { id: '3', prompt: 'Abstract geometric patterns', timestamp: '2024-01-18 16:45', imageUrl: '/placeholder.svg' },
  ]);
  const [imageFilter, setImageFilter] = useState('');
  const [editingImage, setEditingImage] = useState<ImageHistoryItem | null>(null);
  const [editImagePrompt, setEditImagePrompt] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Search History Functions
  const filteredSearchHistory = searchHistory.filter(item =>
    item.query.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleDeleteSearch = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
    toast.success('Search history deleted');
  };

  const handleEditSearch = (item: SearchHistoryItem) => {
    setEditingSearch(item);
    setEditSearchQuery(item.query);
  };

  const handleSaveSearch = () => {
    if (editingSearch) {
      setSearchHistory(prev =>
        prev.map(item =>
          item.id === editingSearch.id ? { ...item, query: editSearchQuery } : item
        )
      );
      setEditingSearch(null);
      toast.success('Search history updated');
    }
  };

  // Image History Functions
  const filteredImageHistory = imageHistory.filter(item =>
    item.prompt.toLowerCase().includes(imageFilter.toLowerCase())
  );

  const handleDeleteImage = (id: string) => {
    setImageHistory(prev => prev.filter(item => item.id !== id));
    toast.success('Image history deleted');
  };

  const handleEditImage = (item: ImageHistoryItem) => {
    setEditingImage(item);
    setEditImagePrompt(item.prompt);
  };

  const handleSaveImage = () => {
    if (editingImage) {
      setImageHistory(prev =>
        prev.map(item =>
          item.id === editingImage.id ? { ...item, prompt: editImagePrompt } : item
        )
      );
      setEditingImage(null);
      toast.success('Image history updated');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/search')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.first_name}!
          </h2>
          <p className="text-muted-foreground">
            Here's your account information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.first_name} {user.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phone_number}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
              <CardDescription>Your current account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="secondary" className="mt-1">
                  {user.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge 
                  variant={user.is_active ? "default" : "destructive"}
                  className="mt-1"
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/image-gen')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Image Generation
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/search')}
              >
                <Plug className="mr-2 h-4 w-4" />
                MCP Servers
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Update Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search History Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Search History</CardTitle>
                <CardDescription>View and manage your recent searches</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter searches..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSearchHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No search history found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSearchHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.query}</TableCell>
                      <TableCell>{item.timestamp}</TableCell>
                      <TableCell>{item.results} results</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditSearch(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Search Query</DialogTitle>
                                <DialogDescription>
                                  Update your search query below
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="query">Search Query</Label>
                                  <Input
                                    id="query"
                                    value={editSearchQuery}
                                    onChange={(e) => setEditSearchQuery(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSaveSearch}>Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Search History</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this search? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSearch(item.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Image Generation History Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Image Generation History</CardTitle>
                <CardDescription>View and manage your generated images</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter prompts..."
                  value={imageFilter}
                  onChange={(e) => setImageFilter(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImageHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No image generation history found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredImageHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.imageUrl}
                          alt={item.prompt}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.prompt}</TableCell>
                      <TableCell>{item.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditImage(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Image Prompt</DialogTitle>
                                <DialogDescription>
                                  Update your image generation prompt below
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="prompt">Image Prompt</Label>
                                  <Input
                                    id="prompt"
                                    value={editImagePrompt}
                                    onChange={(e) => setEditImagePrompt(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Current Image</Label>
                                  <img
                                    src={item.imageUrl}
                                    alt={item.prompt}
                                    className="w-full rounded-lg"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleSaveImage}>Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Image History</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this image? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteImage(item.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;