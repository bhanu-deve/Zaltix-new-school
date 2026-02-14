import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Trophy, Medal, Star, Award, Download, Eye, Calendar, RefreshCw } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/api';

interface Achievement {
  _id: string;
  student: string;
  title: string;
  category: string;
  date: string;
  description: string;
  fileUrl?: string;
  fileType?: string;
}

interface Event {
  _id: string;
  title: string;
  category: string;
  date: string;
  participants: number;
  description: string;
  status: string;
}

interface TopPerformer {
  student: string;
  count: number;
  category: string;
  achievements: string[];
}

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchAchievements(),
      fetchEvents()
    ]);
  };

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/achievements');
      setAchievements(res.data);
      calculateTopPerformers(res.data);
    } catch (err) {
      console.error("Error fetching achievements:", err);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const { data } = await api.get('/events');
      // Sort events by date (closest first)
      const sortedEvents = data.sort((a: Event, b: Event) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sortedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      // Don't show error toast for events as it might not be implemented yet
    } finally {
      setEventsLoading(false);
    }
  };

  const calculateTopPerformers = (data: Achievement[]) => {
    const performerMap = new Map<string, TopPerformer>();
    
    data.forEach(achievement => {
      const student = achievement.student;
      if (!performerMap.has(student)) {
        performerMap.set(student, {
          student,
          count: 1,
          category: achievement.category,
          achievements: [achievement.title]
        });
      } else {
        const existing = performerMap.get(student)!;
        existing.count += 1;
        existing.achievements.push(achievement.title);
        existing.category = achievement.category;
      }
    });

    const sorted = Array.from(performerMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    setTopPerformers(sorted);
  };

  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = {};
    achievements.forEach(achievement => {
      const cat = achievement.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  };

  const getCategoryStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('academic')) return { 
      icon: <Star className="w-5 h-5" />, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100'
    };
    if (cat.includes('sport')) return { 
      icon: <Trophy className="w-5 h-5" />, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      border: 'border-green-200',
      hover: 'hover:bg-green-100'
    };
    if (cat.includes('art')) return { 
      icon: <Medal className="w-5 h-5" />, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100'
    };
    if (cat.includes('leader')) return { 
      icon: <Award className="w-5 h-5" />, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100'
    };
    return { 
      icon: <Star className="w-5 h-5" />, 
      color: 'text-gray-600', 
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100'
    };
  };

  const getEventColor = (category: string) => {
    const colors: { [key: string]: { border: string, bg: string, text: string } } = {
      Academic: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-700' },
      Sports: { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-700' },
      Arts: { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-700' },
      Leadership: { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-700' },
      Other: { border: 'border-gray-500', bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    return colors[category] || colors.Other;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleViewFile = (fileUrl?: string, fileType?: string) => {
    if (!fileUrl) return;
    
    // For PDFs and images, open in new tab
    if (fileType?.includes('pdf') || fileType?.includes('image')) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      // For other files, trigger download
      handleDownload(fileUrl, 'file', fileType);
    }
  };

  const handleDownload = (fileUrl?: string, title?: string, fileType?: string) => {
    if (!fileUrl) return;
    
    // Create a hidden anchor element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    
    // Set download attribute with proper filename
    let extension = 'file';
    if (fileType) {
      extension = fileType.split('/')[1] || 'file';
    } else {
      const urlParts = fileUrl.split('.');
      extension = urlParts[urlParts.length - 1] || 'file';
    }
    
    const filename = title 
      ? `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`
      : `achievement_${Date.now()}.${extension}`;
    
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started');
  };

  const categoryCounts = getCategoryCounts();
  
  // Create stats array from actual categories
  let categoryStats = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      count,
      ...getCategoryStyle(category)
    }))
    .sort((a, b) => b.count - a.count);

  // Ensure we have exactly 4 categories with placeholders if needed
  const standardCategories = ['Academic', 'Sports', 'Arts', 'Leadership'];
  const finalStats = [];
  
  for (let i = 0; i < 4; i++) {
    if (i < categoryStats.length) {
      finalStats.push(categoryStats[i]);
    } else {
      const standardCat = standardCategories[i];
      const style = getCategoryStyle(standardCat);
      finalStats.push({
        category: standardCat,
        count: 0,
        ...style
      });
    }
  }

  if (loading && achievements.length === 0) {
    return (
      <div className="min-h-screen p-4 relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative">
      <AnimatedBackground />
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar theme="colored" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 animate-fade-in-up gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate('/dashboard/principal')}
              variant="outline"
              size="sm"
              className="bg-white/70 hover:bg-white/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-pink-100">
                <Trophy className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">School Achievements</h1>
                <p className="text-gray-600 text-sm md:text-base">
                  {achievements.length} total achievements • {events.length} upcoming events
                </p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={fetchAllData}
            variant="outline"
            size="sm"
            className="bg-white/70 hover:bg-white/90"
            disabled={loading || eventsLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading || eventsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {finalStats.map((stat, index) => (
            <Card 
              key={index} 
              className={`bg-white/70 backdrop-blur-sm text-center hover:shadow-lg transition-all hover:scale-105 ${stat.bg} border ${stat.border}`}
            >
              <CardHeader className="pb-2 flex flex-col items-center">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <span className={stat.color}>{stat.icon}</span>
                  <span>{stat.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                  {stat.count}
                </div>
                <p className="text-xs text-gray-500 mt-1">achievements</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Achievements Table */}
        <Card className="bg-white/70 backdrop-blur-sm mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg md:text-xl">Recent Achievements</CardTitle>
            <span className="text-sm text-gray-500">
              Showing {Math.min(achievements.length, 10)} of {achievements.length}
            </span>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No achievements found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Achievements added by teachers will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[900px] md:min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Achievement</TableHead>
                      <TableHead className="w-[150px]">Student</TableHead>
                      <TableHead className="w-[100px]">Category</TableHead>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead className="w-[250px]">Description</TableHead>
                      <TableHead className="w-[100px] text-center">Attachment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {achievements.slice(0, 10).map((achievement) => {
                      const style = getCategoryStyle(achievement.category);
                      return (
                        <TableRow key={achievement._id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span className={style.color}>{style.icon}</span>
                              <span className="truncate max-w-[150px]" title={achievement.title}>
                                {achievement.title}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{achievement.student}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${style.bg} ${style.color} font-medium`}>
                              {achievement.category}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(achievement.date)}</TableCell>
                          <TableCell className="max-w-xs">
                            <p className="truncate" title={achievement.description}>
                              {achievement.description}
                            </p>
                          </TableCell>
                          <TableCell className="text-center">
                            {achievement.fileUrl && (
                              <div className="flex justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewFile(achievement.fileUrl, achievement.fileType)}
                                  className="p-2 h-8 w-8 hover:bg-blue-100"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDownload(achievement.fileUrl, achievement.title, achievement.fileType)}
                                  className="p-2 h-8 w-8 hover:bg-green-100"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4 text-green-600" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topPerformers.length > 0 ? (
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => {
                    const medals = ['🥇', '🥈', '🥉'];
                    const colors = ['bg-yellow-50', 'bg-gray-50', 'bg-orange-50'];
                    const textColors = ['text-yellow-600', 'text-gray-600', 'text-orange-600'];
                    const borderColors = ['border-yellow-200', 'border-gray-200', 'border-orange-200'];
                    
                    return (
                      <div 
                        key={performer.student} 
                        className={`flex items-center justify-between p-3 ${colors[index]} rounded-lg border ${borderColors[index]} transition-all hover:shadow-md`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{medals[index]}</span>
                          <div>
                            <p className="font-medium">{performer.student}</p>
                            <p className="text-sm text-gray-600">
                              {performer.count} {performer.count === 1 ? 'achievement' : 'achievements'}
                            </p>
                          </div>
                        </div>
                        <div className={`text-sm font-semibold ${textColors[index]}`}>
                          {performer.count} pts
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No top performers yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Upcoming Events
              </CardTitle>
              {events.length > 0 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {events.length} events
                </span>
              )}
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {events.map((event) => {
                    const colors = getEventColor(event.category);
                    return (
                      <div 
                        key={event._id} 
                        className={`border-l-4 ${colors.border} pl-3 hover:bg-white/50 p-2 rounded-r transition-all hover:shadow-md`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{event.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                            {event.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(event.date)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-blue-600">
                            👥 {event.participants || 0} participants
                          </p>
                          {event.description && (
                            <p className="text-xs text-gray-500 truncate max-w-[150px]" title={event.description}>
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : eventsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No upcoming events</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Teachers can add events from their dashboard
                  </p>
                </div>
              )}
              
              {/* Summary Stats */}
              {events.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {events.length}
                    </p>
                    <p className="text-xs text-gray-600">Total Events</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {events.reduce((sum, e) => sum + (e.participants || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-600">Participants</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievement Summary */}
        <div className="mt-6 text-center text-sm text-gray-500 bg-white/50 backdrop-blur-sm p-3 rounded-lg">
          <p>Total of {achievements.length} achievements recorded across all categories</p>
          <p className="text-xs mt-1">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Achievements;