import { Video, Upload, Clock, Activity, Plus, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="card-interactive">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-semibold">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs mt-2 flex items-center gap-1",
                trendUp ? "text-success" : "text-destructive"
              )}>
                <ArrowUpRight className={cn("h-3 w-3", !trendUp && "rotate-180")} />
                {trend}
              </p>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type JobStatus = 'draft' | 'scripted' | 'voiced' | 'asseted' | 'edited' | 'captioned' | 'thumbnailed' | 'uploading' | 'published';

interface RecentJob {
  id: string;
  title: string;
  status: JobStatus;
  createdAt: string;
  language: 'en' | 'ar';
}

const mockJobs: RecentJob[] = [
  { id: '1', title: '5 Morning Habits of Successful People', status: 'published', createdAt: '2 hours ago', language: 'en' },
  { id: '2', title: 'كيف تتعلم لغة جديدة بسرعة', status: 'captioned', createdAt: '4 hours ago', language: 'ar' },
  { id: '3', title: 'Top 10 Productivity Apps 2024', status: 'voiced', createdAt: '6 hours ago', language: 'en' },
  { id: '4', title: 'The Science of Sleep', status: 'scripted', createdAt: '8 hours ago', language: 'en' },
  { id: '5', title: 'أفضل 5 تطبيقات للمذاكرة', status: 'draft', createdAt: '12 hours ago', language: 'ar' },
];

const statusColors: Record<JobStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  scripted: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  voiced: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  asseted: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  edited: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  captioned: 'bg-info/10 text-info',
  thumbnailed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  uploading: 'bg-warning/10 text-warning',
  published: 'bg-success/10 text-success',
};

export default function Dashboard() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your shorts</p>
        </div>
        <Button onClick={() => navigate('/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('dashboard.createShort')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t('dashboard.totalVideos')} 
          value="142" 
          icon={Video}
          trend="+12% from last week"
          trendUp={true}
        />
        <StatCard 
          title={t('dashboard.published')} 
          value="89" 
          icon={Upload}
          trend="+8% from last week"
          trendUp={true}
        />
        <StatCard 
          title={t('dashboard.scheduled')} 
          value="23" 
          icon={Clock}
        />
        <StatCard 
          title={t('dashboard.inProgress')} 
          value="30" 
          icon={Activity}
        />
      </div>

      {/* Recent Jobs */}
      <Card className="card-elevated">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-medium">{t('dashboard.recentJobs')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')} className="gap-1">
            {t('dashboard.viewAll')}
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockJobs.map((job) => (
              <div 
                key={job.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 relative overflow-hidden">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    {/* Aspect ratio indicator */}
                    <div className="absolute bottom-0 right-0 text-[8px] font-medium bg-foreground/80 text-background px-1 rounded-tl">
                      9:16
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      "font-medium truncate group-hover:text-primary transition-colors",
                      job.language === 'ar' && "font-arabic"
                    )}>
                      {job.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{job.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {job.language === 'ar' ? 'عربي' : 'EN'}
                  </Badge>
                  <Badge className={cn("capitalize", statusColors[job.status])}>
                    {t(`jobs.status.${job.status}`)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-interactive cursor-pointer" onClick={() => navigate('/topics')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Plus className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="font-medium">{t('topics.add')}</p>
              <p className="text-sm text-muted-foreground">Queue up new topics</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-interactive cursor-pointer" onClick={() => navigate('/providers')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium">{t('providers.title')}</p>
              <p className="text-sm text-muted-foreground">Configure AI providers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-interactive cursor-pointer" onClick={() => navigate('/channels')}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Video className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium">{t('channels.connect')}</p>
              <p className="text-sm text-muted-foreground">Link YouTube channel</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
