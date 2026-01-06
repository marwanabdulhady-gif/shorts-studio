import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  TestTube2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Volume2,
  Image,
  Video,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type ProviderType = 'llm' | 'tts' | 'image' | 'video';

interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  status: 'active' | 'error' | 'inactive';
  baseUrl: string;
  lastTested?: string;
  languages: string[];
}

const mockProviders: Provider[] = [
  { 
    id: '1', 
    name: 'OpenAI GPT-4', 
    type: 'llm', 
    status: 'active', 
    baseUrl: 'https://api.openai.com/v1',
    lastTested: '2 hours ago',
    languages: ['en', 'ar']
  },
  { 
    id: '2', 
    name: 'ElevenLabs', 
    type: 'tts', 
    status: 'active', 
    baseUrl: 'https://api.elevenlabs.io/v1',
    lastTested: '5 hours ago',
    languages: ['en', 'ar']
  },
  { 
    id: '3', 
    name: 'DALL-E 3', 
    type: 'image', 
    status: 'active', 
    baseUrl: 'https://api.openai.com/v1',
    lastTested: '1 day ago',
    languages: ['en']
  },
  { 
    id: '4', 
    name: 'Replicate SD', 
    type: 'image', 
    status: 'inactive', 
    baseUrl: 'https://api.replicate.com/v1',
    languages: ['en']
  },
  { 
    id: '5', 
    name: 'Pexels Stock', 
    type: 'video', 
    status: 'error', 
    baseUrl: 'https://api.pexels.com/videos',
    lastTested: '3 days ago',
    languages: ['en']
  },
];

const providerTypeIcons: Record<ProviderType, React.ElementType> = {
  llm: Sparkles,
  tts: Volume2,
  image: Image,
  video: Video,
};

const providerTypeBadgeClass: Record<ProviderType, string> = {
  llm: 'provider-badge-llm',
  tts: 'provider-badge-tts',
  image: 'provider-badge-image',
  video: 'provider-badge-video',
};

const statusStyles = {
  active: 'bg-success/10 text-success',
  error: 'bg-destructive/10 text-destructive',
  inactive: 'bg-muted text-muted-foreground',
};

export default function Providers() {
  const { t } = useLanguage();
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | ProviderType>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [manifestJson, setManifestJson] = useState('');

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || provider.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleTestProvider = (provider: Provider) => {
    toast({
      title: "Testing provider...",
      description: `Sending test request to ${provider.name}`,
    });
    // Simulate test
    setTimeout(() => {
      toast({
        title: "Test successful",
        description: `${provider.name} is responding correctly.`,
      });
    }, 2000);
  };

  const handleAddProvider = () => {
    try {
      const manifest = JSON.parse(manifestJson);
      toast({
        title: "Provider added",
        description: `${manifest.name || 'New provider'} has been configured.`,
      });
      setIsAddDialogOpen(false);
      setManifestJson('');
    } catch (e) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON for the provider manifest.",
        variant: "destructive",
      });
    }
  };

  const sampleManifest = `{
  "id": "openai-gpt4",
  "name": "OpenAI GPT-4",
  "providerType": "LLM",
  "baseUrl": "https://api.openai.com/v1",
  "auth": {
    "type": "bearer",
    "headerName": "Authorization"
  },
  "endpoints": [{
    "name": "generateScript",
    "method": "POST",
    "path": "/chat/completions",
    "bodyTemplate": {
      "model": "gpt-4",
      "messages": "{{input.messages}}"
    },
    "responseExtract": {
      "mappings": {
        "text": "$.choices[0].message.content"
      }
    }
  }],
  "capabilities": {
    "languageSupport": ["en", "ar"],
    "maxOutputTokens": 4096
  }
}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('providers.title')}</h1>
          <p className="text-muted-foreground mt-1">Configure AI providers for content generation</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          {t('providers.add')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10"
          />
        </div>
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="llm">{t('providers.llm')}</TabsTrigger>
            <TabsTrigger value="tts">{t('providers.tts')}</TabsTrigger>
            <TabsTrigger value="image">{t('providers.image')}</TabsTrigger>
            <TabsTrigger value="video">{t('providers.video')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map((provider) => {
          const TypeIcon = providerTypeIcons[provider.type];
          return (
            <Card key={provider.id} className="card-interactive">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      provider.type === 'llm' && "bg-violet-100 dark:bg-violet-900/30",
                      provider.type === 'tts' && "bg-amber-100 dark:bg-amber-900/30",
                      provider.type === 'image' && "bg-pink-100 dark:bg-pink-900/30",
                      provider.type === 'video' && "bg-cyan-100 dark:bg-cyan-900/30",
                    )}>
                      <TypeIcon className={cn(
                        "h-5 w-5",
                        provider.type === 'llm' && "text-violet-600 dark:text-violet-400",
                        provider.type === 'tts' && "text-amber-600 dark:text-amber-400",
                        provider.type === 'image' && "text-pink-600 dark:text-pink-400",
                        provider.type === 'video' && "text-cyan-600 dark:text-cyan-400",
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {provider.baseUrl}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 me-2" />
                        {t('common.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTestProvider(provider)}>
                        <TestTube2 className="h-4 w-4 me-2" />
                        {t('providers.test')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 me-2" />
                        {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <Badge className={cn("provider-badge", providerTypeBadgeClass[provider.type])}>
                    {t(`providers.${provider.type}`)}
                  </Badge>
                  <Badge className={statusStyles[provider.status]}>
                    {provider.status === 'active' && <CheckCircle2 className="h-3 w-3 me-1" />}
                    {provider.status === 'error' && <AlertCircle className="h-3 w-3 me-1" />}
                    {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex gap-1">
                    {provider.languages.map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang === 'ar' ? 'عربي' : 'EN'}
                      </Badge>
                    ))}
                  </div>
                  {provider.lastTested && (
                    <span className="text-xs text-muted-foreground">
                      Tested {provider.lastTested}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Provider Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('providers.add')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Add a new provider by pasting its manifest JSON. The manifest defines how to communicate with the provider's API.
            </p>
            
            <div className="space-y-2">
              <Label>Provider Manifest (JSON)</Label>
              <Textarea
                placeholder="Paste your provider manifest JSON here..."
                value={manifestJson}
                onChange={(e) => setManifestJson(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Example manifest:</Label>
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                {sampleManifest}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleAddProvider}>
                {t('providers.add')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
