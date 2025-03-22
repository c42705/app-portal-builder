
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

interface AddUserFormProps {
  onCancel: () => void;
}

/**
 * Form for adding new users with temporary passwords
 */
export const AddUserForm = ({ onCancel }: AddUserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user', // Default role
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [userAdded, setUserAdded] = useState(false);

  /**
   * Validates the form data
   * @returns True if valid, false otherwise
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Generates a random password
   * @returns Random password string
   */
  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  /**
   * Handles form changes
   * @param e Change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handles role changes
   * @param value New role value
   */
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  /**
   * Copies temporary password to clipboard
   */
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(temporaryPassword)
      .then(() => toast.success('Password copied to clipboard!'))
      .catch(err => toast.error('Failed to copy password'));
  };

  /**
   * Handles form submission
   * @param e Submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate a temporary password
      const password = generateTemporaryPassword();
      setTemporaryPassword(password);
      
      // In a real app, this would send the data to an API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      toast.success(`User ${formData.name} added successfully`);
      setUserAdded(true);
      
      // In a real app, send an email with the temporary password
      console.log(`Would send email to ${formData.email} with password: ${password}`);
      
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resets the form for adding another user
   */
  const handleAddAnother = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
    });
    setTemporaryPassword('');
    setUserAdded(false);
  };

  if (userAdded) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-medium text-green-800">User Added Successfully!</h3>
          <p className="text-green-700 text-sm mt-1">
            An email would be sent to {formData.email} with login instructions.
          </p>
        </div>
        
        <div className="border rounded-md p-4 space-y-2">
          <div className="flex justify-between items-center">
            <Label>Temporary Password</Label>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={copyPasswordToClipboard}
              className="h-7 px-2"
            >
              <Copy size={14} className="mr-1" />
              Copy
            </Button>
          </div>
          <Input value={temporaryPassword} readOnly />
          <p className="text-xs text-gray-500">
            Make sure to save this password. It won't be shown again.
          </p>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Done
          </Button>
          <Button onClick={handleAddAnother}>
            Add Another User
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label>User Role</Label>
        <RadioGroup 
          value={formData.role} 
          onValueChange={handleRoleChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="user-role" />
            <Label htmlFor="user-role" className="cursor-pointer">User</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="admin-role" />
            <Label htmlFor="admin-role" className="cursor-pointer">Admin</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="rounded-md bg-blue-50 p-3 mt-4">
        <p className="text-sm text-blue-800">
          A temporary password will be generated and can be shared with the user.
          They will be prompted to change it on first login.
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add User'}
        </Button>
      </div>
    </form>
  );
};
