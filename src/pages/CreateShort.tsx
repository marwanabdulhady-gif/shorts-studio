import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  MessageSquare,
  FileText,
  Volume2,
  Image,
  Captions,
  Upload,
  Eye,
  Sparkles,
  Play,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface WizardData {
  // Step 1: Topic
  topic: string;
  contentLanguage: 'en' | 'ar';
  targetDuration: number;
  
  // Step 2: Script
  scriptTemplate: string;
  tone: string;
  script?: string;
  title?: string;
  description?: string;
  
  // Step 3: Voice
  ttsProvider: string;
  voice: string;
  speed: number;
  
  // Step 4: Visuals
  visualMode: 'ai-images' | 'stock-video' | 'hybrid';
  imageProvider: string;
  imageStyle: string;
  
  // Step 5: Captions
  captionsEnabled: boolean;
  captionFont: string;
  captionSize: 'small' | 'medium' | 'large';
  captionPosition: 'top' | 'center' | 'bottom';
  
  // Step 6: Publish
  privacy: 'unlisted' | 'public' | 'private';
  schedule: boolean;
  scheduledDate?: string;
  tags: string;
}

const steps = [
  { key: 'wizard.step1', icon: MessageSquare, label: 'Topic' },
  { key: 'wizard.step2', icon: FileText, label: 'Script' },
  { key: 'wizard.step3', icon: Volume2, label: 'Voice' },
  { key: 'wizard.step4', icon: Image, label: 'Visuals' },
  { key: 'wizard.step5', icon: Captions, label: 'Captions' },
  { key: 'wizard.step6', icon: Upload, label: 'Publish' },
  { key: 'wizard.step7', icon: Eye, label: 'Preview' },
];

export default function CreateShort() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<WizardData>({
    topic: '',
    contentLanguage: 'en',
    targetDuration: 30,
    scriptTemplate: 'educational',
    tone: 'engaging',
    ttsProvider: 'elevenlabs',
    voice: 'adam',
    speed: 1,
    visualMode: 'ai-images',
    imageProvider: 'dalle',
    imageStyle: 'cinematic',
    captionsEnabled: true,
    captionFont: 'Noto Sans',
    captionSize: 'medium',
    captionPosition: 'bottom',
    privacy: 'unlisted',
    schedule: false,
    tags: '',
  });

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 7) setCurrentStep((currentStep + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast({
      title: "Generating content...",
      description: `Creating ${data.contentLanguage === 'ar' ? 'Arabic' : 'English'} script for your topic.`,
    });
    
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateData({
      script: data.contentLanguage === 'ar' 
        ? `مقدمة: ${data.topic}\n\nالنقطة الأولى: معلومة مهمة عن الموضوع\n\nالنقطة الثانية: تفاصيل إضافية\n\nالخاتمة: دعوة للعمل`
        : `Hook: Did you know about ${data.topic}?\n\nPoint 1: Here's an interesting fact...\n\nPoint 2: And here's why it matters...\n\nCTA: Follow for more content like this!`,
      title: data.contentLanguage === 'ar'
        ? `${data.topic} - حقائق مذهلة`
        : `${data.topic} - You Need to Know This!`,
      description: data.contentLanguage === 'ar'
        ? `اكتشف المزيد عن ${data.topic} في هذا الفيديو القصير`
        : `Discover more about ${data.topic} in this short video.`,
    });
    
    setIsGenerating(false);
    nextStep();
  };

  const handleCreateJob = () => {
    toast({
      title: "Job created!",
      description: "Your short is now being processed.",
    });
    navigate('/jobs');
  };

  const isRtl = direction === 'rtl';
  const isArabicContent = data.contentLanguage === 'ar';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4">
        {steps.map((step, index) => {
          const stepNum = (index + 1) as Step;
          const isActive = currentStep === stepNum;
          const isComplete = currentStep > stepNum;
          const StepIcon = step.icon;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive && "bg-primary text-primary-foreground shadow-glow",
                  isComplete && "bg-success text-success-foreground",
                  !isActive && !isComplete && "bg-muted text-muted-foreground"
                )}>
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2 font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {t(step.key)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-12 h-0.5 mx-2 transition-colors hidden sm:block",
                  isComplete ? "bg-success" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="card-elevated">
        <CardContent className="p-8">
          {/* Step 1: Topic */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-semibold mb-2">What's your topic?</h2>
                <p className="text-muted-foreground">Enter the subject for your YouTube Short</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('wizard.selectLanguage')}</Label>
                  <RadioGroup
                    value={data.contentLanguage}
                    onValueChange={(v) => updateData({ contentLanguage: v as 'en' | 'ar' })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en" id="lang-en" />
                      <Label htmlFor="lang-en" className="cursor-pointer">
                        🇺🇸 {t('wizard.english')}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ar" id="lang-ar" />
                      <Label htmlFor="lang-ar" className="cursor-pointer font-arabic">
                        🇸🇦 {t('wizard.arabic')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Textarea
                    placeholder={isArabicContent ? "أدخل موضوعك هنا..." : "Enter your topic here..."}
                    value={data.topic}
                    onChange={(e) => updateData({ topic: e.target.value })}
                    className={cn(
                      "min-h-[120px]",
                      isArabicContent && "font-arabic text-right"
                    )}
                    dir={isArabicContent ? 'rtl' : 'ltr'}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Duration: {data.targetDuration}s</Label>
                  <Slider
                    value={[data.targetDuration]}
                    onValueChange={([v]) => updateData({ targetDuration: v })}
                    min={15}
                    max={60}
                    step={5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15s</span>
                    <span>30s</span>
                    <span>45s</span>
                    <span>60s</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Script */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-semibold mb-2">Script Settings</h2>
                <p className="text-muted-foreground">Configure how your script will be generated</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={data.scriptTemplate} onValueChange={(v) => updateData({ scriptTemplate: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="listicle">Listicle</SelectItem>
                      <SelectItem value="howto">How-To</SelectItem>
                      <SelectItem value="news">News/Updates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={data.tone} onValueChange={(v) => updateData({ tone: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engaging">Engaging & Energetic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="dramatic">Dramatic</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleGenerate} 
                  disabled={!data.topic || isGenerating}
                  className="gap-2"
                >
                  <Sparkles className={cn("h-4 w-4", isGenerating && "animate-spin")} />
                  {isGenerating ? 'Generating...' : t('wizard.generate')}
                </Button>
              </div>

              {data.script && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label>Generated Script</Label>
                    <Textarea
                      value={data.script}
                      onChange={(e) => updateData({ script: e.target.value })}
                      className={cn(
                        "min-h-[200px]",
                        isArabicContent && "font-arabic text-right"
                      )}
                      dir={isArabicContent ? 'rtl' : 'ltr'}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={data.title}
                        onChange={(e) => updateData({ title: e.target.value })}
                        className={isArabicContent ? "font-arabic text-right" : ""}
                        dir={isArabicContent ? 'rtl' : 'ltr'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        className={isArabicContent ? "font-arabic text-right" : ""}
                        dir={isArabicContent ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Voice */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-semibold mb-2">Voice Settings</h2>
                <p className="text-muted-foreground">Choose how your script will be narrated</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>TTS Provider</Label>
                  <Select value={data.ttsProvider} onValueChange={(v) => updateData({ ttsProvider: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="openai">OpenAI TTS</SelectItem>
                      <SelectItem value="google">Google Cloud TTS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Voice</Label>
                  <Select value={data.voice} onValueChange={(v) => updateData({ voice: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {isArabicContent ? (
                        <>
                          <SelectItem value="sarah">Sarah (Arabic Female)</SelectItem>
                          <SelectItem value="adam">Adam (Arabic Male)</SelectItem>
                          <SelectItem value="zara">Zara (Arabic Female)</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="adam">Adam (Male)</SelectItem>
                          <SelectItem value="rachel">Rachel (Female)</SelectItem>
                          <SelectItem value="josh">Josh (Male)</SelectItem>
                          <SelectItem value="emily">Emily (Female)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Speed: {data.speed.toFixed(1)}x</Label>
                  <Slider
                    value={[data.speed]}
                    onValueChange={([v]) => updateData({ speed: v })}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5x (Slow)</span>
                    <span>1.0x (Normal)</span>
                    <span>2.0x (Fast)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Visuals */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-semibold mb-2">Visual Settings</h2>
                <p className="text-muted-foreground">Configure the visual style of your Short</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Visual Mode</Label>
                  <RadioGroup
                    value={data.visualMode}
                    onValueChange={(v) => updateData({ visualMode: v as any })}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {[
                      { value: 'ai-images', label: 'AI Generated Images', desc: 'Create unique visuals with AI' },
                      { value: 'stock-video', label: 'Stock Video', desc: 'Use stock footage clips' },
                      { value: 'hybrid', label: 'Hybrid', desc: 'Mix of both approaches' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all",
                          data.visualMode === option.value 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground mt-1">{option.desc}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {data.visualMode !== 'stock-video' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label>Image Provider</Label>
                      <Select value={data.imageProvider} onValueChange={(v) => updateData({ imageProvider: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dalle">DALL-E 3</SelectItem>
                          <SelectItem value="midjourney">Midjourney</SelectItem>
                          <SelectItem value="stable">Stable Diffusion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Image Style</Label>
                      <Select value={data.imageStyle} onValueChange={(v) => updateData({ imageStyle: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cinematic">Cinematic</SelectItem>
                          <SelectItem value="illustration">Illustration</SelectItem>
                          <SelectItem value="3d-render">3D Render</SelectItem>
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="photorealistic">Photorealistic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Captions */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-semibold mb-2">Caption Settings</h2>
                <p className="text-muted-foreground">Configure how captions appear on your video</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <p className="font-medium">Enable Captions</p>
                  <p className="text-sm text-muted-foreground">Burn captions into the video</p>
                </div>
                <Switch
                  checked={data.captionsEnabled}
                  onCheckedChange={(v) => updateData({ captionsEnabled: v })}
                />
              </div>

              {data.captionsEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Font</Label>
                    <Select value={data.captionFont} onValueChange={(v) => updateData({ captionFont: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Noto Sans">Noto Sans</SelectItem>
                        <SelectItem value="Noto Sans Arabic">Noto Sans Arabic</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Select value={data.captionSize} onValueChange={(v) => updateData({ captionSize: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select value={data.captionPosition} onValueChange={(v) => updateData({ captionPosition: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {isArabicContent && data.captionsEnabled && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Arabic Caption Support</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Arabic captions will use proper RTL text shaping and a compatible font for correct display.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Publish */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-semibold mb-2">Publish Settings</h2>
                <p className="text-muted-foreground">Configure how your Short will be published</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Privacy</Label>
                  <RadioGroup
                    value={data.privacy}
                    onValueChange={(v) => updateData({ privacy: v as any })}
                    className="grid grid-cols-3 gap-4"
                  >
                    {[
                      { value: 'unlisted', label: 'Unlisted', desc: 'Only people with link' },
                      { value: 'public', label: 'Public', desc: 'Everyone can see' },
                      { value: 'private', label: 'Private', desc: 'Only you' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all",
                          data.privacy === option.value 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground mt-1">{option.desc}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-medium">Schedule Upload</p>
                    <p className="text-sm text-muted-foreground">Set a specific time to publish</p>
                  </div>
                  <Switch
                    checked={data.schedule}
                    onCheckedChange={(v) => updateData({ schedule: v })}
                  />
                </div>

                {data.schedule && (
                  <div className="space-y-2">
                    <Label>Scheduled Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={data.scheduledDate}
                      onChange={(e) => updateData({ scheduledDate: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Tags (comma separated)</Label>
                  <Input
                    placeholder="productivity, tips, shorts"
                    value={data.tags}
                    onChange={(e) => updateData({ tags: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Preview */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h2 className="text-xl font-semibold mb-2">Preview & Approve</h2>
                <p className="text-muted-foreground">Review your Short before processing</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Video Preview */}
                <div className="space-y-4">
                  <div className="video-preview-9-16 bg-muted mx-auto max-w-[280px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Video Preview</p>
                      </div>
                    </div>
                    <div className="safe-area-overlay" />
                    {/* Caption preview */}
                    {data.captionsEnabled && (
                      <div className={cn(
                        "absolute left-4 right-4 text-center",
                        data.captionPosition === 'top' && "top-[15%]",
                        data.captionPosition === 'center' && "top-1/2 -translate-y-1/2",
                        data.captionPosition === 'bottom' && "bottom-[15%]"
                      )}>
                        <span className={cn(
                          "inline-block px-3 py-2 bg-foreground/90 text-background rounded-lg",
                          data.captionSize === 'small' && "text-sm",
                          data.captionSize === 'medium' && "text-base",
                          data.captionSize === 'large' && "text-lg",
                          isArabicContent && "font-arabic"
                        )}>
                          {isArabicContent ? "نص العنوان هنا" : "Caption text here"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-muted-foreground text-xs">TITLE</Label>
                    <p className={cn(
                      "font-medium text-lg mt-1",
                      isArabicContent && "font-arabic text-right"
                    )}>
                      {data.title || 'Untitled'}
                    </p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground text-xs">DESCRIPTION</Label>
                    <p className={cn(
                      "text-muted-foreground mt-1",
                      isArabicContent && "font-arabic text-right"
                    )}>
                      {data.description || 'No description'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{data.contentLanguage === 'ar' ? 'عربي' : 'EN'}</Badge>
                    <Badge variant="outline">{data.targetDuration}s</Badge>
                    <Badge variant="outline">{data.privacy}</Badge>
                    <Badge variant="outline">{data.visualMode}</Badge>
                    {data.captionsEnabled && <Badge variant="outline">Captions</Badge>}
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-sm font-medium">Actions</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Regenerate Script
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download Assets
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="gap-2"
        >
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          {t('wizard.back')}
        </Button>

        {currentStep === 7 ? (
          <Button onClick={handleCreateJob} className="gap-2">
            <Upload className="h-4 w-4" />
            Create & Process
          </Button>
        ) : currentStep === 2 && !data.script ? (
          <Button onClick={handleGenerate} disabled={!data.topic || isGenerating} className="gap-2">
            <Sparkles className={cn("h-4 w-4", isGenerating && "animate-spin")} />
            {isGenerating ? 'Generating...' : t('wizard.generate')}
          </Button>
        ) : (
          <Button onClick={nextStep} className="gap-2">
            {t('wizard.next')}
            {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}
