import { useState } from 'react';
import { 
  Plus, 
  Upload, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  CheckCircle2, 
  Clock 
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Topic {
  id: string;
  text: string;
  language: 'en' | 'ar';
  status: 'pending' | 'used';
  createdAt: string;
}

const mockTopics: Topic[] = [
  { id: '1', text: '5 productivity hacks you need to know', language: 'en', status: 'pending', createdAt: '2024-01-15' },
  { id: '2', text: 'كيف تبني عادات صحية في 30 يوم', language: 'ar', status: 'pending', createdAt: '2024-01-15' },
  { id: '3', text: 'The science behind intermittent fasting', language: 'en', status: 'used', createdAt: '2024-01-14' },
  { id: '4', text: 'Why you should wake up at 5 AM', language: 'en', status: 'pending', createdAt: '2024-01-14' },
  { id: '5', text: 'أفضل 5 كتب للتطوير الذاتي', language: 'ar', status: 'used', createdAt: '2024-01-13' },
];

export default function Topics() {
  const { t } = useLanguage();
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTopicText, setNewTopicText] = useState('');
  const [newTopicLanguage, setNewTopicLanguage] = useState<'en' | 'ar'>('en');

  const filteredTopics = topics.filter(topic =>
    topic.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTopic = () => {
    if (!newTopicText.trim()) return;
    
    const newTopic: Topic = {
      id: Date.now().toString(),
      text: newTopicText,
      language: newTopicLanguage,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setTopics([newTopic, ...topics]);
    setNewTopicText('');
    setIsAddDialogOpen(false);
    toast({
      title: "Topic added",
      description: "Your topic has been added to the queue.",
    });
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
    toast({
      title: "Topic deleted",
      description: "The topic has been removed.",
    });
  };

  const handleImportCSV = () => {
    // Placeholder for CSV import
    toast({
      title: "Coming soon",
      description: "CSV import will be available in the next update.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('topics.title')}</h1>
          <p className="text-muted-foreground mt-1">Manage your content topics queue</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleImportCSV} className="gap-2">
            <Upload className="h-4 w-4" />
            {t('topics.import')}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('topics.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('topics.add')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Textarea
                    placeholder={t('topics.placeholder')}
                    value={newTopicText}
                    onChange={(e) => setNewTopicText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('wizard.selectLanguage')}</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={newTopicLanguage === 'en' ? 'default' : 'outline'}
                      onClick={() => setNewTopicLanguage('en')}
                      className="flex-1"
                    >
                      {t('wizard.english')}
                    </Button>
                    <Button
                      variant={newTopicLanguage === 'ar' ? 'default' : 'outline'}
                      onClick={() => setNewTopicLanguage('ar')}
                      className="flex-1"
                    >
                      {t('wizard.arabic')}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleAddTopic}>
                    {t('topics.add')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ps-10"
        />
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => (
          <Card key={topic.id} className="card-interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    "font-medium leading-relaxed line-clamp-3",
                    topic.language === 'ar' && "font-arabic text-right"
                  )}>
                    {topic.text}
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {topic.language === 'ar' ? 'عربي' : 'EN'}
                    </Badge>
                    <Badge 
                      className={cn(
                        "text-xs",
                        topic.status === 'used' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                      )}
                    >
                      {topic.status === 'used' ? (
                        <CheckCircle2 className="h-3 w-3 me-1" />
                      ) : (
                        <Clock className="h-3 w-3 me-1" />
                      )}
                      {topic.status === 'used' ? 'Used' : 'Pending'}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeleteTopic(topic.id)}
                    >
                      <Trash2 className="h-4 w-4 me-2" />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('common.noData')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
