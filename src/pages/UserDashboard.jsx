import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

import { TicketList, TicketForm, TicketDetail } from '../components/dashboard';
import { initialFormData } from '../utils/ticketHelpers';

import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ticketAPI } from '../services/ticketApi';
import { commentAPI } from '../services/commentApi';

function UserDashboard() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'detail'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Form state for new ticket
  const [formData, setFormData] = useState(initialFormData);

  // Screen recording state
  const [screenRecording, setScreenRecording] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Comment state
  const [newComment, setNewComment] = useState('');

  const containerRef = useRef(null);

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setTicketsLoading(true);
        const response = await ticketAPI.getTickets();
        setTickets(response.data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Open ticket from URL param if present
  useEffect(() => {
    const ticketId = searchParams.get('ticket');
    if (ticketId && tickets.length > 0 && !selectedTicket) {
      const ticket = tickets.find((t) => t._id === ticketId);
      if (ticket) {
        // Ticket found in user's accessible list - open it
        handleViewTicket(ticket);
      } else {
        // Ticket NOT in user's list = user has no permission
        // Clear the invalid param silently
        searchParams.delete('ticket');
        setSearchParams(searchParams);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, tickets, selectedTicket]);

  useEffect(() => {
    // GSAP animations on mount
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dashboard-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.ticket-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.2,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [currentView, ticketsLoading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    // TODO: Implement logout logic
  };

  const handleCreateTicket = () => {
    setCurrentView('create');
    setFormData(initialFormData);
  };

  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('detail');

    // Update URL with ticket param
    setSearchParams({ ticket: ticket._id });

    // Fetch comments for this ticket
    try {
      const response = await commentAPI.getComments(ticket._id);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTicket(null);
    setComments([]);

    // Remove ticket param from URL
    searchParams.delete('ticket');
    setSearchParams(searchParams);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = async (e, files) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      alert('Molimo popunite sva obavezna polja.');
      return;
    }

    try {
      // Create FormData to send files as multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('clientEmail', user.email);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('affectedModule', formData.affectedModule || '');
      formDataToSend.append(
        'reproductionSteps',
        formData.reproductionSteps || ''
      );
      formDataToSend.append('expectedResult', formData.expectedResult || '');
      formDataToSend.append('actualResult', formData.actualResult || '');
      formDataToSend.append('priority', formData.priority || 'Low');

      // Append regular attachments
      files.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      // Append screen recording if present
      if (screenRecording) {
        formDataToSend.append('screenRecording', screenRecording);
        formDataToSend.append('recordingDuration', recordingDuration);
      }

      const response = await ticketAPI.createTicket(formDataToSend);
      setTickets((prev) => [response.data, ...prev]);

      // Reset screen recording state
      setScreenRecording(null);
      setRecordingDuration(0);

      setCurrentView('list');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert(error.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleCancelCreate = () => {
    const hasData = Object.values(formData).some((val) =>
      Array.isArray(val) ? val.length > 0 : val !== ''
    );
    if (hasData) {
      if (
        confirm(
          'Imate nesačuvane podatke. Da li ste sigurni da želite odustati?'
        )
      ) {
        handleBackToList();
      }
    } else {
      handleBackToList();
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await commentAPI.addComment(selectedTicket._id, {
        text: newComment,
      });
      // Add the new comment to the comments list
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert(error.response?.data?.message || 'Failed to add comment');
    }
  };

  return (
    <div ref={containerRef}>
      {currentView === 'list' && (
        <TicketList
          tickets={tickets}
          userEmail={user.email}
          onLogout={handleLogout}
          onCreateTicket={handleCreateTicket}
          onViewTicket={handleViewTicket}
        />
      )}
      {currentView === 'create' && (
        <TicketForm
          formData={formData}
          userEmail={user.email}
          onLogout={handleLogout}
          onFormChange={handleFormChange}
          onSubmit={handleSubmitTicket}
          onCancel={handleCancelCreate}
          onScreenRecordingChange={(file, duration) => {
            setScreenRecording(file);
            setRecordingDuration(duration);
          }}
        />
      )}
      {currentView === 'detail' && selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          comments={comments}
          userEmail={user.email}
          onLogout={handleLogout}
          onBack={handleBackToList}
          newComment={newComment}
          onCommentChange={setNewComment}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}
    </div>
  );
}

export default UserDashboard;
