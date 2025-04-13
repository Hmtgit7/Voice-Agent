// src/pages/Profile.js
import React, { useState } from 'react';
import { UserIcon, EnvelopeIcon, PhoneIcon, KeyIcon } from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useForm } from '../hooks/useForm';
import { validateEmail } from '../utils/validators';
import { PencilIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Profile form validation
  const validateProfileForm = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(values.email)) {
      errors.email = 'Invalid email address';
    }
    
    return errors;
  };
  
  // Password form validation
  const validatePasswordForm = (values) => {
    const errors = {};
    
    if (!values.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!values.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (values.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };
  
  // Initialize profile form
  const { 
    values: profileValues, 
    errors: profileErrors, 
    handleChange: handleProfileChange, 
    handleSubmit: handleProfileSubmit 
  } = useForm(
    {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      title: user?.title || '',
    },
    validateProfileForm
  );
  
  // Initialize password form
  const { 
    values: passwordValues, 
    errors: passwordErrors, 
    handleChange: handlePasswordChange, 
    handleSubmit: handlePasswordSubmit,
    resetForm: resetPasswordForm
  } = useForm(
    {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validatePasswordForm
  );
  
  // Handle profile update
  const onUpdateProfile = async (formValues) => {
    try {
      setIsUpdating(true);
      
      // Call API to update profile
      // This is a placeholder - implement with your actual auth service
      await updateProfile(formValues);
      
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle password change
  const onChangePassword = async (formValues) => {
    try {
      setIsChangingPassword(true);
      
      // Call API to change password
      // This is a placeholder - implement with your actual auth service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      showToast('Password changed successfully', 'success');
      resetPasswordForm();
    } catch (error) {
      showToast('Failed to change password. Please try again.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Manage your account settings and preferences
      </p>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Profile Information */}
          <Card title="Profile Information">
            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  value={profileValues.name}
                  onChange={handleProfileChange}
                  error={profileErrors.name}
                  leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
                  required
                />
                
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={profileValues.email}
                  onChange={handleProfileChange}
                  error={profileErrors.email}
                  leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                  required
                />
                
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                  value={profileValues.phone}
                  onChange={handleProfileChange}
                  leftIcon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                />
                
                <Input
                  id="title"
                  name="title"
                  label="Job Title"
                  value={profileValues.title}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isUpdating}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          </Card>
          
          {/* Change Password */}
          <Card title="Change Password" className="mt-6">
            <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-6">
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                label="Current Password"
                value={passwordValues.currentPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.currentPassword}
                leftIcon={<KeyIcon className="h-5 w-5 text-gray-400" />}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  label="New Password"
                  value={passwordValues.newPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.newPassword}
                  leftIcon={<KeyIcon className="h-5 w-5 text-gray-400" />}
                  required
                />
                
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  value={passwordValues.confirmPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirmPassword}
                  leftIcon={<KeyIcon className="h-5 w-5 text-gray-400" />}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isChangingPassword}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        <div>
          {/* Profile Picture */}
          <Card title="Profile Picture">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                  <UserIcon className="h-16 w-16 text-primary-600 dark:text-primary-400" />
                </div>
                
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-900"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="sr-only">Change picture</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Upload a new profile picture (JPG or PNG, max 5MB)
              </p>
              
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  Upload Image
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Account Info */}
          <Card title="Account Information" className="mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account Created
                </h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  January 15, 2023
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Login
                </h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  Today at 10:30 AM
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Role
                </h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  Administrator
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;