
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('/api/schedule');
        const formattedEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(formattedEvents);
      } catch (error) {
        toast.error('Failed to load schedule');
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  if (loading) return <div className="p-4">Loading schedule...</div>;

  return (
    <div className="p-4 h-full pl-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work Schedule</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {/* Add new schedule modal */}}
        >
          Add Shift
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4 h-[700px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="week"
          selectable
          onSelectSlot={({ start, end }) => {
            console.log('Selected slot:', start, end);
            // Handle new event creation
          }}
          onSelectEvent={event => {
            console.log('Selected event:', event);
            // Handle event click
          }}
        />
      </div>
    </div>
  );
};

export default Schedule;