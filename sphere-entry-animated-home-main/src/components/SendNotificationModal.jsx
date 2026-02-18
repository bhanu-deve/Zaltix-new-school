import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import api from '@/api/api';

const SendNotificationModal = ({ isOpen, onClose, onSend, userRole = 'principal' }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'All Teachers',
    specificTeacher: '',
    scheduleType: 'now',
    scheduledDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);

  // Fetch teachers when modal opens
  useEffect(() => {
    if (isOpen && userRole === 'principal') {
      fetchTeachers();
    }
  }, [isOpen, userRole]);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/staff');
      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get principal ID from localStorage (you need to store this during login)
      const principalId = localStorage.getItem('principalId') || 'principal_123';
      
      const notificationData = {
        ...formData,
        sentBy: principalId,
        sentByRole: 'principal',
        recipientName: getRecipientName()
      };
      
      // Call the onSend prop which will make the API call
      await onSend(notificationData);
      
      resetForm();
    } catch (error) {
      console.error('Error in modal:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecipientName = () => {
    if (formData.audience === 'Specific Teacher' && formData.specificTeacher) {
      const teacher = teachers.find(t => t._id === formData.specificTeacher);
      return teacher ? teacher.name : '';
    }
    return formData.audience;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      audience: 'All Teachers',
      specificTeacher: '',
      scheduleType: 'now',
      scheduledDate: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getSummaryText = () => {
    let summary = `Sending to ${formData.audience}`;
    
    if (formData.audience === 'Specific Teacher' && formData.specificTeacher) {
      const teacher = teachers.find(t => t._id === formData.specificTeacher);
      if (teacher) {
        summary = `Sending to ${teacher.name}`;
      }
    }
    
    if (formData.scheduleType === 'later' && formData.scheduledDate) {
      summary += ` • Scheduled for: ${new Date(formData.scheduledDate).toLocaleString()}`;
    }
    
    return summary;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Send Notification</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Important Announcement"
              className="mt-1"
              required
              disabled={loading}
            />
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your message here..."
              rows={4}
              className="mt-1"
              required
              disabled={loading}
            />
          </div>

          {/* Audience */}
          <div>
            <Label htmlFor="audience" className="text-sm font-medium">Target Audience *</Label>
            <Select 
              value={formData.audience} 
              onValueChange={(value) => {
                setFormData({ 
                  ...formData, 
                  audience: value,
                  specificTeacher: ''
                });
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Teachers">All Teachers</SelectItem>
                <SelectItem value="Specific Teacher">Specific Teacher</SelectItem>
                <SelectItem value="All Students">All Students</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specific Teacher Selection */}
          {formData.audience === 'Specific Teacher' && (
            <div>
              <Label htmlFor="specificTeacher" className="text-sm font-medium">Select Teacher *</Label>
              <Select 
                value={formData.specificTeacher} 
                onValueChange={(value) => setFormData({ ...formData, specificTeacher: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <SelectItem key={teacher._id} value={teacher._id}>
                        {teacher.name} - {teacher.role || 'Teacher'}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-teachers" disabled>Loading teachers...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Schedule */}
          <div>
            <Label className="text-sm font-medium">Schedule</Label>
            <div className="flex items-center space-x-4 mt-1">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="schedule"
                  value="now"
                  checked={formData.scheduleType === 'now'}
                  onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                  className="w-4 h-4"
                  disabled={loading}
                />
                <span>Send Now</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="schedule"
                  value="later"
                  checked={formData.scheduleType === 'later'}
                  onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })}
                  className="w-4 h-4"
                  disabled={loading}
                />
                <span>Schedule for Later</span>
              </label>
            </div>
          </div>

          {/* Scheduled Date */}
          {formData.scheduleType === 'later' && (
            <div>
              <Label htmlFor="scheduledDate" className="text-sm font-medium">Select Date & Time *</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="mt-1"
                required={formData.scheduleType === 'later'}
                disabled={loading}
              />
            </div>
          )}

          {/* Summary */}
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Summary:</span> {getSummaryText()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              disabled={
                loading || 
                (formData.audience === 'Specific Teacher' && !formData.specificTeacher) ||
                (formData.scheduleType === 'later' && !formData.scheduledDate)
              }
            >
              {loading ? 'Sending...' : (formData.scheduleType === 'now' ? 'Send Now' : 'Schedule')}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationModal;