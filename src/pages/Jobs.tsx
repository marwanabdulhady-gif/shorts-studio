import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  RefreshCw,
  Trash2,
  Video,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Play
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type JobStatus = 'draft' | 'scripted' | 'voiced' | 'asseted' | 'edited' | 'captioned' | 'thumbnailed' | 'uploading' | 'published' | 'error';

interface Job {
  id: string;
  title: string;
  topic: string;
  status: JobStatus;
  contentLanguage: 'en' | 'ar';
  createdAt: string;
  stages: {
    name: string;
    status: 'pending' | 'running' | 'success' | 'error';
    duration?: string;
  }[];
}

const mockJobs: Job[] = [
  { 
    id: '1', 
    title: '5 Morning Habits of Successful People',
    topic: 'Productivity morning routines',
    status: 'published', 
    contentLanguage: 'en',
    createdAt: '2 hours ago',
    stages: [
      { name: 'Script', status: 'success', duration: '4s' },
      { name: 'Voice', status: 'success', duration: '12s' },
      { name: 'Assets', status: 'success', duration: '45s' },
      { name: 'Edit', status: 'success', duration: '30s' },
      { name: 'Captions', status: 'success', duration: '8s' },
      { name: 'Thumbnail', status: 'success', duration: '5s' },
      { name: 'Upload', status: 'success', duration: '15s' },
    ]
  },
  { 
    id: '2', 
    title: 'كيف تتعلم لغة جديدة بسرعة',
    topic: 'تعلم اللغات',
    status: 'captioned', 
    contentLanguage: 'ar',
    createdAt: '4 hours ago',
    stages: [
      { name: 'Script', status: 'success', duration: '5s' },
      { name: 'Voice', status: 'success', duration: '15s' },
      { name: 'Assets', status: 'success', duration: '50s' },
      { name: 'Edit', status: 'success', duration: '35s' },
      { name: 'Captions', status: 'running' },
      { name: 'Thumbnail', status: 'pending' },
      { name: 'Upload', status: 'pending' },
    ]
  },
  { 
    id: '3', 
    title: 'Top 10 Productivity Apps 2024',
    topic: 'Best apps for productivity',
    status: 'voiced', 
    contentLanguage: 'en',
    createdAt: '6 hours ago',
    stages: [
      { name: 'Script', status: 'success', duration: '3s' },
      { name: 'Voice', status: 'running' },
      { name: 'Assets', status: 'pending' },
      { name: 'Edit', status: 'pending' },
      { name: 'Captions', status: 'pending' },
      { name: 'Thumbnail', status: 'pending' },
      { name: 'Upload', status: 'pending' },
    ]
  },
  { 
    id: '4', 
    title: 'The Science of Sleep',
    topic: 'Sleep science and tips',
    status: 'error', 
    contentLanguage: 'en',
    createdAt: '8 hours ago',
    stages: [
      { name: 'Script', status: 'success', duration: '4s' },
      { name: 'Voice', status: 'success', duration: '10s' },
      { name: 'Assets', status: 'error' },
      { name: 'Edit', status: 'pending' },
      { name: 'Captions', status: 'pending' },
      { name: 'Thumbnail', status: 'pending' },
      { name: 'Upload', status: 'pending' },
    ]
  },
];

const statusStyles: Record<JobStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  scripted: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  voiced: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  asseted: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  edited: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  captioned: 'bg-info/10 text-info',
  thumbnailed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  uploading: 'bg-warning/10 text-warning',
  published: 'bg-success/10 text-success',
  error: 'bg-destructive/10 text-destructive',
};

const stageStatusIcons = {
  pending: Clock,
  running: Loader2,
  success: CheckCircle2,
  error: AlertCircle,
};

export default function Jobs() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | JobStatus>('all');

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('jobs.title')}</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage video generation jobs</p>
        </div>
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
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 me-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scripted">Scripted</SelectItem>
            <SelectItem value="voiced">Voiced</SelectItem>
            <SelectItem value="captioned">Captioned</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="card-interactive">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Job Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0 relative overflow-hidden">
                    <Video className="h-6 w-6 text-muted-foreground" />
                    <div className="absolute bottom-0 right-0 text-[8px] font-medium bg-foreground/80 text-background px-1 rounded-tl">
                      9:16
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className={cn(
                          "font-medium text-lg truncate",
                          job.contentLanguage === 'ar' && "font-arabic"
                        )}>
                          {job.title}
                        </h3>
                        <p className={cn(
                          "text-sm text-muted-foreground truncate",
                          job.contentLanguage === 'ar' && "font-arabic"
                        )}>
                          {job.topic}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}`)}>
                            <Eye className="h-4 w-4 me-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 me-2" />
                            {t('jobs.rerun')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 me-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {job.contentLanguage === 'ar' ? 'عربي' : 'EN'}
                      </Badge>
                      <Badge className={cn("capitalize", statusStyles[job.status])}>
                        {t(`jobs.status.${job.status === 'error' ? 'draft' : job.status}`)}
                        {job.status === 'error' && ' - Error'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{job.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline Progress */}
                <div className="flex items-center gap-1 flex-wrap lg:flex-nowrap">
                  {job.stages.map((stage, index) => {
                    const StageIcon = stageStatusIcons[stage.status];
                    return (
                      <div key={stage.name} className="flex items-center">
                        <div 
                          className={cn(
                            "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all",
                            stage.status === 'success' && "bg-success/10 text-success",
                            stage.status === 'running' && "bg-info/10 text-info",
                            stage.status === 'error' && "bg-destructive/10 text-destructive",
                            stage.status === 'pending' && "bg-muted text-muted-foreground",
                          )}
                          title={`${stage.name}${stage.duration ? ` (${stage.duration})` : ''}`}
                        >
                          <StageIcon className={cn(
                            "h-3 w-3",
                            stage.status === 'running' && "animate-spin"
                          )} />
                          <span className="hidden sm:inline">{stage.name}</span>
                        </div>
                        {index < job.stages.length - 1 && (
                          <div className={cn(
                            "w-4 h-0.5 mx-0.5",
                            stage.status === 'success' ? "bg-success" : "bg-border"
                          )} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('common.noData')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
