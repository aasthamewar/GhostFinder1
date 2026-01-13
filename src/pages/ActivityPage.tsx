import { useState } from "react";
import { motion } from "framer-motion";
import {
  Ghost,
  Zap,
  ArrowLeft,
  GitCommit,
  GitPullRequest,
  Eye,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  User,
  HeartPulse,
  Trophy,
  Flame,
  Star,
  Crown,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GhostLogo } from "@/components/GhostLogo";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock team members data
const mockMembers = [
  {
    id: "1",
    name: "Ritika",
    username: "Ritika-dev67",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    role: "leader",
    status: "active",
    commits: 17,
    prs: 10,
    reviews: 12,
    streak: 14,
  },
  {
    id: "2",
    name: "Sarah Miller",
    username: "sarahm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "member",
    status: "active",
    commits: 38,
    prs: 9,
    reviews: 31,
    streak: 8,
  },
  {
    id: "3",
    name: "James Wilson",
    username: "jwilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    role: "member",
    status: "active",
    commits: 29,
    prs: 7,
    reviews: 15,
    streak: 5,
  },
  {
    id: "4",
    name: "Emily Davis",
    username: "emilyd",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    role: "member",
    status: "stalled",
    commits: 15,
    prs: 3,
    reviews: 8,
    streak: 0,
  },
  {
    id: "5",
    name: "Mike Johnson",
    username: "mikej",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    role: "member",
    status: "ghost",
    commits: 5,
    prs: 1,
    reviews: 2,
    streak: 0,
  },
];

// Mock activity timeline
const mockActivities = [
  {
    id: "a1",
    type: "commit" as const,
    user: mockMembers[0],
    message: "feat: Add real-time collaboration features",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    sha: "a3f2b1c",
  },
  {
    id: "a2",
    type: "pr" as const,
    user: mockMembers[1],
    message: "Implement dark mode toggle with system preference detection",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    prNumber: 142,
    state: "open",
  },
  {
    id: "a3",
    type: "pr_review" as const,
    user: mockMembers[0],
    message: "Reviewed: Add user authentication flow",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    prNumber: 140,
  },
  {
    id: "a4",
    type: "commit" as const,
    user: mockMembers[2],
    message: "fix: Resolve memory leak in useEffect cleanup",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    sha: "b4c3d2e",
  },
  {
    id: "a5",
    type: "pr" as const,
    user: mockMembers[0],
    message: "Add comprehensive test suite for API endpoints",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    prNumber: 139,
    state: "merged",
  },
  {
    id: "a6",
    type: "commit" as const,
    user: mockMembers[1],
    message: "refactor: Optimize database queries for better performance",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    sha: "c5d4e3f",
  },
  {
    id: "a7",
    type: "pr_review" as const,
    user: mockMembers[2],
    message: "Reviewed: Implement caching layer",
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    prNumber: 138,
  },
  {
    id: "a8",
    type: "commit" as const,
    user: mockMembers[3],
    message: "docs: Update README with installation instructions",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    sha: "d6e5f4g",
  },
  {
    id: "a9",
    type: "pr" as const,
    user: mockMembers[2],
    message: "Add responsive design for mobile devices",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    prNumber: 135,
    state: "merged",
  },
  {
    id: "a10",
    type: "commit" as const,
    user: mockMembers[4],
    message: "chore: Update dependencies",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    sha: "e7f6g5h",
  },
];

// Weekly contribution data for chart simulation
const weeklyData = [
  { day: "Mon", commits: 12, prs: 3, reviews: 8 },
  { day: "Tue", commits: 18, prs: 5, reviews: 12 },
  { day: "Wed", commits: 8, prs: 2, reviews: 6 },
  { day: "Thu", commits: 22, prs: 7, reviews: 15 },
  { day: "Fri", commits: 15, prs: 4, reviews: 10 },
  { day: "Sat", commits: 5, prs: 1, reviews: 3 },
  { day: "Sun", commits: 3, prs: 0, reviews: 2 },
];

const activityTypeConfig = {
  commit: {
    icon: GitCommit,
    label: "Commit",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  pr: {
    icon: GitPullRequest,
    label: "Pull Request",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
  },
  pr_review: {
    icon: Eye,
    label: "Review",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
};

const statusConfig = {
  active: { icon: Zap, color: "text-active", bgColor: "bg-active/20", label: "Active" },
  stalled: { icon: Shield, color: "text-stalled", bgColor: "bg-stalled/20", label: "Stalled" },
  ghost: { icon: Ghost, color: "text-ghost", bgColor: "bg-ghost/20", label: "Ghost" },
};

const ActivityPage = () => {
  const navigate = useNavigate();
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMember, setFilterMember] = useState<string>("all");

  const handleUnavailableToggle = (checked: boolean) => {
    setIsUnavailable(checked);
  };

  const filteredActivities = mockActivities.filter((activity) => {
    if (filterType !== "all" && activity.type !== filterType) return false;
    if (filterMember !== "all" && activity.user.id !== filterMember) return false;
    return true;
  });

  const totalCommits = mockMembers.reduce((sum, m) => sum + m.commits, 0);
  const totalPRs = mockMembers.reduce((sum, m) => sum + m.prs, 0);
  const totalReviews = mockMembers.reduce((sum, m) => sum + m.reviews, 0);
  const sortedMembers = [...mockMembers].sort(
    (a, b) => (b.commits + b.prs + b.reviews) - (a.commits + a.prs + a.reviews)
  );
  const maxActivity = Math.max(...sortedMembers.map((m) => m.commits + m.prs + m.reviews));
  const maxWeeklyValue = Math.max(...weeklyData.map((d) => d.commits + d.prs + d.reviews));

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Star className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Star className="w-5 h-5 text-amber-600" />;
    return <span className="text-muted-foreground font-bold">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-primary/8 via-transparent to-transparent" />
      
      {/* Decorative orbs */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <GhostLogo />
            <div className="hidden sm:block">
              <Badge variant="outline" className="text-xs">
                <Flame className="w-3 h-3 mr-1 text-orange-500" />
                Demo Mode
              </Badge>
            </div>
          </div>

          {/* Unavailable Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 glass rounded-xl px-4 py-2.5"
          >
            <div className="flex items-center gap-2">
              <HeartPulse className={`w-4 h-4 transition-colors ${isUnavailable ? "text-warning animate-pulse" : "text-success"}`} />
              <Label htmlFor="unavailable-toggle" className="text-sm font-medium cursor-pointer hidden sm:block">
                {isUnavailable ? "Away / Sick" : "Available"}
              </Label>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  id="unavailable-toggle"
                  checked={isUnavailable}
                  onCheckedChange={handleUnavailableToggle}
                  className="data-[state=checked]:bg-warning"
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle when you're sick or unable to work</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold">GitHub Activity</h1>
            <Badge variant="active" className="hidden sm:flex">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Real-time contribution tracking for <span className="text-foreground font-medium">Ghost-Buster Project</span>
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Total Activities", value: totalCommits + totalPRs + totalReviews, icon: Activity, color: "primary", delay: 0.1 },
            { label: "Commits", value: totalCommits, icon: GitCommit, color: "primary", delay: 0.2 },
            { label: "Pull Requests", value: totalPRs, icon: GitPullRequest, color: "success", delay: 0.3 },
            { label: "PR Reviews", value: totalReviews, icon: Eye, color: "accent", delay: 0.4 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
            >
              <Card variant="gradient" className="overflow-hidden group hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-${stat.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`w-7 h-7 text-${stat.color}`} />
                    </div>
                    <div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: stat.delay + 0.2 }}
                        className="text-3xl font-bold"
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Weekly Activity
              </CardTitle>
              <CardDescription>Contribution trends over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyData.map((day, i) => {
                  const total = day.commits + day.prs + day.reviews;
                  const height = (total / maxWeeklyValue) * 100;
                  return (
                    <motion.div
                      key={day.day}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary hover:from-primary/80 hover:to-primary transition-all cursor-pointer" style={{ height: '100%' }} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p className="font-semibold">{day.day}</p>
                            <p>Commits: {day.commits}</p>
                            <p>PRs: {day.prs}</p>
                            <p>Reviews: {day.reviews}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-3 px-1">
                {weeklyData.map((day) => (
                  <span key={day.day} className="text-xs text-muted-foreground flex-1 text-center">
                    {day.day}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3 bg-card border border-border p-1">
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Contribution Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Team members ranked by total contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedMembers.map((member, index) => {
                      const total = member.commits + member.prs + member.reviews;
                      const status = statusConfig[member.status as keyof typeof statusConfig];
                      const StatusIcon = status.icon;

                      return (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-primary/30 ${
                            index === 0 ? "bg-yellow-500/5 border-yellow-500/20" : "bg-card/50 border-border"
                          }`}
                        >
                          <div className="w-10 flex justify-center">
                            {getRankBadge(index)}
                          </div>
                          
                          <div className="relative">
                            <Avatar className="w-12 h-12 border-2 border-border">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${status.bgColor} flex items-center justify-center`}>
                              <StatusIcon className={`w-3 h-3 ${status.color}`} />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold truncate">{member.name}</p>
                              {member.role === "leader" && (
                                <Crown className="w-4 h-4 text-primary" />
                              )}
                              {member.streak > 0 && (
                                <Badge variant="outline" className="text-xs gap-1">
                                  <Flame className="w-3 h-3 text-orange-500" />
                                  {member.streak} day streak
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <Progress
                                value={(total / maxActivity) * 100}
                                className="flex-1 h-2"
                              />
                              <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                                <span className="flex items-center gap-1">
                                  <GitCommit className="w-3 h-3 text-primary" />
                                  {member.commits}
                                </span>
                                <span className="flex items-center gap-1">
                                  <GitPullRequest className="w-3 h-3 text-success" />
                                  {member.prs}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-accent" />
                                  {member.reviews}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{total}</p>
                            <p className="text-xs text-muted-foreground">total</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Activity Timeline</CardTitle>
                      <CardDescription>Recent GitHub activity in real-time</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Filter type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="commit">Commits</SelectItem>
                          <SelectItem value="pr">Pull Requests</SelectItem>
                          <SelectItem value="pr_review">Reviews</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterMember} onValueChange={setFilterMember}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Filter member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Members</SelectItem>
                          {mockMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-1">
                      {filteredActivities.map((activity, index) => {
                        const config = activityTypeConfig[activity.type];
                        const Icon = config.icon;

                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-4 group"
                          >
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                              </div>
                              {index < filteredActivities.length - 1 && (
                                <div className="w-px h-full bg-border flex-1 my-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <div className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-card/50 transition-colors">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <Badge variant="outline" className={`text-xs ${config.color}`}>
                                      {config.label}
                                    </Badge>
                                    {activity.type === "pr" && (
                                      <Badge variant={activity.state === "merged" ? "active" : "outline"} className="text-xs">
                                        {activity.state === "merged" ? "Merged" : "Open"}
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimeAgo(activity.timestamp)}
                                    </span>
                                  </div>
                                  <p className="font-medium text-sm sm:text-base">{activity.message}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Avatar className="w-5 h-5">
                                      <AvatarImage src={activity.user.avatar} />
                                      <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      {activity.user.name}
                                    </span>
                                    {activity.sha && (
                                      <code className="text-xs bg-secondary px-1.5 py-0.5 rounded font-mono">
                                        {activity.sha}
                                      </code>
                                    )}
                                    {activity.prNumber && (
                                      <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                                        #{activity.prNumber}
                                      </code>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}

                      {filteredActivities.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No activities match your filters</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Activity Details</CardTitle>
                  <CardDescription>
                    Complete breakdown of all GitHub activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead className="hidden sm:table-cell">Description</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => {
                        const config = activityTypeConfig[activity.type];
                        const Icon = config.icon;

                        return (
                          <TableRow key={activity.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                  <Icon className={`w-4 h-4 ${config.color}`} />
                                </div>
                                <span className="text-sm hidden lg:inline">{config.label}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7">
                                  <AvatarImage src={activity.user.avatar} />
                                  <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm truncate max-w-[80px] sm:max-w-none">
                                  {activity.user.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate hidden sm:table-cell">
                              {activity.message}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                              {formatTimeAgo(activity.timestamp)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ActivityPage;