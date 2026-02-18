import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Bell, Send, Eye, Users, PlusCircle } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "@/api/api";
import SendNotificationModal from '@/components/SendNotificationModal';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/AddNotification');
      setNotifications(res.data);
      toast.success(`Loaded ${res.data.length} notifications`, { autoClose: 2000 });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error('Failed to load notifications', { autoClose: 2000 });
    }
  };

  const handleSendNotification = async (notificationData) => {
    try {
      // Use the correct API endpoint
      const response = await api.post('/api/notifications/send', {
        ...notificationData,
        sentBy: localStorage.getItem('userId') || 'principal',
        sentByRole: 'principal'
      });
      
      if (response.data.success) {
        toast.success('Notification sent successfully!', { autoClose: 3000 });
        fetchNotifications();
        setIsSendModalOpen(false);
      }
    } catch (err) {
      console.error("Error sending notification:", err);
      toast.error(err.response?.data?.message || 'Failed to send notification', { autoClose: 2000 });
    }
  };

  const handleBackClick = () => {
    toast.info('Returning to Dashboard...', { autoClose: 1500 });
    setTimeout(() => navigate('/dashboard/principal'), 1500);
  };

  const deliveryStats = [
    { metric: 'Total Sent', value: notifications.length, color: 'text-blue-600' },
    { metric: 'Delivered', value: Math.floor(notifications.length * 0.95), color: 'text-green-600' },
    { metric: 'Opened', value: Math.floor(notifications.length * 0.75), color: 'text-purple-600' },
    { metric: 'Failed', value: Math.floor(notifications.length * 0.05), color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen p-2 md:p-4 relative">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 mb-4 md:mb-6">
          <div className="w-full md:w-auto">
            <Button
              onClick={handleBackClick}
              variant="outline"
              size="sm"
              className="w-full md:w-auto bg-white/70 hover:bg-white/90 flex items-center justify-center md:justify-start"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-indigo-100">
                <Bell className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Notification Center</h1>
                <p className="text-sm text-gray-600">Send & manage teacher notifications</p>
              </div>
            </div>
            
            <Button
              onClick={() => setIsSendModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Send to Teachers
            </Button>
          </div>
        </div>

        {/* Delivery Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {deliveryStats.map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">{stat.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-lg md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center">
                <Send className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-blue-600">{notifications.length}</div>
              <p className="text-xs md:text-sm text-gray-600">Messages sent</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center">
                <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                Open Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-green-600">{Math.floor((notifications.length * 0.75))}%</div>
              <p className="text-xs md:text-sm text-gray-600">Average engagement</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center">
                <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-600" />
                Total Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold text-purple-600">
                {notifications.reduce((sum, n) => sum + (n.recipients || 0), 0)}
              </div>
              <p className="text-xs md:text-sm text-gray-600">Recipients reached</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Table */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="w-full min-w-[600px] md:min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">Title</TableHead>
                    <TableHead className="text-xs md:text-sm">Message</TableHead>
                    <TableHead className="text-xs md:text-sm">Audience</TableHead>
                    <TableHead className="text-xs md:text-sm">Recipients</TableHead>
                    <TableHead className="text-xs md:text-sm">Sent Date</TableHead>
                    <TableHead className="text-xs md:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <TableRow key={n._id}>
                        <TableCell className="text-xs md:text-sm font-medium">{n.title}</TableCell>
                        <TableCell className="text-xs md:text-sm max-w-[150px] md:max-w-xs truncate">{n.message}</TableCell>
                        <TableCell className="text-xs md:text-sm">{n.audience || 'Teachers'}</TableCell>
                        <TableCell className="text-xs md:text-sm">{n.recipients || 'All Teachers'}</TableCell>
                        <TableCell className="text-xs md:text-sm">{new Date(n.sentDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs md:text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-[10px] md:text-xs">
                            {n.status || 'Sent'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No notifications sent yet</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setIsSendModalOpen(true)}
                        >
                          Send your first notification
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <SendNotificationModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSend={handleSendNotification}
      />
    </div>
  );
};

export default Notifications;