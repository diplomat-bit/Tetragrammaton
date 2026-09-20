import React from 'react';

export interface EventNotificationProps {
  title?: string;
  message?: string;
  type?: 'info' | 'warning' | 'success';
}

export const EventNotificationCard: React.FC<EventNotificationProps> = ({
  title = 'Institutional Notification',
  message = 'Real-time settlement confirmation executed successfully across multi-currency channels.',
  type = 'info'
}) => {
  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl space-y-2 text-white">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">{title}</h4>
        <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-700/50">{type.toUpperCase()}</span>
      </div>
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  );
};

export default EventNotificationCard;
