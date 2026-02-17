import React, { useEffect, useState } from 'react';
import { X, Bell, CheckCircle, AlertCircle, FileText, Info, Trash2, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notifications.api';
import { formatDistanceToNow } from 'date-fns';

const NotificationSidebar = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getMyNotifications,
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: isOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'enrollment_approved':
      case 'form_approved':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'enrollment_rejected':
      case 'form_rejected':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'enrollment_submitted':
      case 'form_submitted_again':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('all')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('unread')}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'unread' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Unread
              </button>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllReadMutation.mutate()}
                  className="ml-auto text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Bell className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">No notifications yet</h3>
                <p className="text-sm text-slate-500">
                  When there's an update to your application status, you'll find it here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification._id}
                    className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                      notification.isRead 
                        ? 'bg-white border-slate-100' 
                        : 'bg-blue-50/40 border-blue-100 shadow-sm shadow-blue-50/50'
                    }`}
                  >
                    {!notification.isRead && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                    
                    <div className="flex gap-4">
                      <div className={`flex-shrink-0 mt-0.5 p-2 rounded-lg ${
                        notification.isRead ? '' : 'bg-white'
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button 
                          onClick={() => markReadMutation.mutate(notification._id)}
                          className="p-1.5 hover:bg-white rounded-lg shadow-sm text-emerald-600 border border-emerald-100 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMutation.mutate(notification._id)}
                        className="p-1.5 hover:bg-white rounded-lg shadow-sm text-rose-600 border border-rose-100 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;
