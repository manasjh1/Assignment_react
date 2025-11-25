import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { imageAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const ImageGeneration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setGeneratedImage(null); // Clear previous image while loading
    
    try {
      const response = await imageAPI.generate(prompt);
      
      if (response.data.status === 'error') {
        throw new Error(response.data.error || 'Image generation failed');
      }

      setGeneratedImage(response.data.image_url);
      toast({
        title: "Success!",
        description: "Your image has been generated.",
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      const errorMessage = error.response?.data?.detail || error.message || "Unable to generate image. Please try again.";
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      // Fetch the image to get a blob for downloading
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Image Generation</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-[1fr,1fr] items-start">
          
          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Create with AI</h2>
              <p className="text-muted-foreground">
                Describe the image you want to generate in detail.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <Textarea
                placeholder="A futuristic city with flying cars at sunset, cyberpunk style..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px] text-lg resize-none p-4"
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium" 
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Result Section */}
          <div className="flex flex-col space-y-4">
            <Card className="aspect-square w-full overflow-hidden bg-muted/50 border-2 border-dashed border-muted-foreground/25 flex items-center justify-center relative group">
              {loading ? (
                <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                  <Loader2 className="h-12 w-12 animate-spin" />
                  <p>Creating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt={prompt} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground/50">
                  <ImageIcon className="h-16 w-16" />
                  <p>Your image will appear here</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageGeneration;