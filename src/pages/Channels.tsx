import { Youtube, Plus, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Channel {
  id: string;
  name: string;
  handle: string;
  thumbnail: string;
  subscribers: string;
  status: 'connected' | 'expired';
  lastUpload?: string;
}

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'Tech Tips Daily',
    handle: '@techtipsdaily',
    thumbnail: '',
    subscribers: '125K',
    status: 'connected',
    lastUpload: '2 hours ago',
  },
];

export default function Channels() {
  const { t } = useLanguage();

  const handleConnect = () => {
    toast({
      title: "Connect YouTube Channel",
      description: "This will redirect you to YouTube for authorization.",
    });
  };

  const handleRefresh = (channelId: string) => {
    toast({
      title: "Refreshing token...",
      description: "Please wait while we refresh your connection.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('channels.title')}</h1>
          <p className="text-muted-foreground mt-1">Connect and manage your YouTube channels</p>
        </div>
        <Button onClick={handleConnect} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('channels.connect')}
        </Button>
      </div>

      {/* OAuth Info */}
      <Card className="card-elevated border-info/20 bg-info/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
              <Youtube className="h-5 w-5 text-info" />
            </div>
            <div>
              <h3 className="font-medium">YouTube OAuth Connection</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Shorts Studio uses YouTube's official OAuth 2.0 to securely connect to your channel. 
                We only request permissions needed for uploading videos and managing your content.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">youtube.upload</Badge>
                <Badge variant="outline">youtube.readonly</Badge>
                <Badge variant="outline">youtube.force-ssl</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Channels */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Connected Channels</h2>
        
        {mockChannels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockChannels.map((channel) => (
              <Card key={channel.id} className="card-interactive">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                      <Youtube className="h-7 w-7 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{channel.name}</h3>
                          <p className="text-sm text-muted-foreground">{channel.handle}</p>
                        </div>
                        <Badge className={cn(
                          channel.status === 'connected' 
                            ? "bg-success/10 text-success" 
                            : "bg-warning/10 text-warning"
                        )}>
                          {channel.status === 'connected' ? (
                            <CheckCircle2 className="h-3 w-3 me-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 me-1" />
                          )}
                          {t(`channels.status.${channel.status}`)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{channel.subscribers} subscribers</span>
                        {channel.lastUpload && (
                          <span>Last upload: {channel.lastUpload}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleRefresh(channel.id)}
                        >
                          <RefreshCw className="h-3 w-3" />
                          Refresh Token
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                          asChild
                        >
                          <a href={`https://youtube.com/${channel.handle}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                            View Channel
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-elevated">
            <CardContent className="py-12 text-center">
              <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No channels connected yet</p>
              <Button onClick={handleConnect} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('channels.connect')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connection Health */}
      {mockChannels.length > 0 && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Connection Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">OAuth Token Status</p>
                    <p className="text-sm text-muted-foreground">Token is valid and active</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">API Quota</p>
                    <p className="text-sm text-muted-foreground">8,500 / 10,000 units remaining today</p>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success">85%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">Last Successful Upload</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
