import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = () => {
    if (!phoneNumber) {
      setErrors({ phone: 'Phone number is required' });
      return false;
    }
    if (!/^\+91\d{10}$/.test(phoneNumber)) {
      setErrors({ phone: 'Phone must be in format +91xxxxxxxxxx' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateReset = () => {
    const newErrors: Record<string, string> = {};

    if (!otpCode || otpCode.length !== 6) {
      newErrors.otp = 'Please enter a valid 6-digit OTP';
    }

    if (!newPassword) {
      newErrors.password = 'Password is required';
    } else if (newPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone()) return;

    setLoading(true);
    try {
      await authAPI.forgotPassword(phoneNumber);
      setStep('reset');
      toast.success('OTP sent to your phone!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to send OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReset()) return;

    setLoading(true);
    try {
      await authAPI.resetPassword({
        phone_number: phoneNumber,
        otp_code: otpCode,
        new_password: newPassword,
      });
      
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'reset') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription>
              Enter the code sent to {phoneNumber} and your new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ''));
                    if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }));
                  }}
                  className={`text-center text-2xl tracking-widest ${errors.otp ? 'border-destructive' : ''}`}
                />
                {errors.otp && (
                  <p className="text-sm text-destructive">{errors.otp}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep('request')}
              >
                Back
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
          <CardDescription>
            Enter your phone number and we'll send you a reset code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phone) setErrors({});
                }}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Sending code...
                </>
              ) : (
                'Send Reset Code'
              )}
            </Button>

            <div className="text-center text-sm">
              Remember your password?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;