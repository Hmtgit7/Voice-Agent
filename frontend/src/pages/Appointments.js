// src/pages/Appointments.js
import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AppointmentList from '../components/appointments/AppointmentList';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import AppointmentForm from '../components/appointments/AppointmentForm';
import appointmentService from '../services/appointmentService';
import { useToast } from '../contexts/ToastContext';

const Appointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAllAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showToast('Failed to fetch appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments by search term
  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.Candidate?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (appointment.Job?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open appointment form modal
  const openAppointmentModal = (appointment = null) => {
    setCurrentAppointment(appointment);
    setIsModalOpen(true);
  };

  // Close appointment form modal
  const closeAppointmentModal = () => {
    setCurrentAppointment(null);
    setIsModalOpen(false);
  };

  // Handle appointment form submission
  const handleAppointmentSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      if (currentAppointment) {
        // Update existing appointment
        await appointmentService.updateAppointment(currentAppointment.id, formData);
        showToast('Appointment updated successfully', 'success');
      } else {
        // Create new appointment
        await appointmentService.createAppointment(formData);
        showToast('Appointment scheduled successfully', 'success');
      }

      // Refresh appointments list
      await fetchAppointments();
      closeAppointmentModal();
    } catch (error) {
      console.error('Error saving appointment:', error);
      showToast(
        `Failed to ${currentAppointment ? 'update' : 'schedule'} appointment. Please try again.`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setAppointmentToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Handle appointment deletion
  const handleAppointmentDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      setIsSubmitting(true);
      await appointmentService.deleteAppointment(appointmentToDelete.id);
      showToast('Appointment deleted successfully', 'success');

      // Refresh appointments list
      await fetchAppointments();
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showToast('Failed to delete appointment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage interview schedules and appointments
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => openAppointmentModal()}
            icon={<PlusIcon className="h-5 w-5" />}
          >
            Schedule Interview
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Input
          type="search"
          placeholder="Search appointments by candidate or job..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          className="max-w-md mb-6"
        />

        <AppointmentList
          appointments={filteredAppointments}
          loading={loading}
          onEdit={openAppointmentModal}
          onDelete={openDeleteModal}
        />
      </div>

      {/* Appointment Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeAppointmentModal}
        title={currentAppointment ? 'Edit Appointment' : 'Schedule Interview'}
        size="2xl"
      >
        <AppointmentForm
          appointment={currentAppointment}
          onSubmit={handleAppointmentSubmit}
          onCancel={closeAppointmentModal}
          loading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Appointment"
        size="md"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this appointment
            {appointmentToDelete?.Candidate?.name && ` with ${appointmentToDelete.Candidate.name}`}?
            This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleAppointmentDelete}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Appointments;