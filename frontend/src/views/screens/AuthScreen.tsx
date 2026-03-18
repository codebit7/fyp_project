import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../components/common';

interface AuthScreenProps {
  onLogin: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SocialButton: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <button className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm overflow-hidden p-3">
    <img src={src} alt={alt} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
  </button>
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister]         = useState(false);
  const [showPassword, setShowPassword]     = useState(false);
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors]                 = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isRegister) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onLogin();
  };

  const switchMode = (register: boolean) => {
    setIsRegister(register);
    setErrors({});
  };

  const passwordIcon = (
    <button onClick={() => setShowPassword((prev) => !prev)} className="text-gray-400">
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="flex-1 p-8 flex flex-col"
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1A3C34] mb-2">True Tilawah</h1>
        <p className="text-gray-500">
          Log in or register to
          <br />
          save your progress
        </p>
      </div>

      {/* Tab switcher */}
      <div className="bg-gray-100 p-1 rounded-2xl flex mb-8">
        <button
          onClick={() => switchMode(false)}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isRegister ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}
        >
          Sign in
        </button>
        <button
          onClick={() => switchMode(true)}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${isRegister ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}
        >
          Register
        </button>
      </div>

      {/* Form */}
      <div className="space-y-6 flex-1">
        <Input
          label="Email"
          placeholder="example@gmail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label={isRegister ? 'Create a password' : 'Password'}
          placeholder="must be 8 characters"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          rightElement={passwordIcon}
        />

        {isRegister && (
          <Input
            label="Confirm password"
            placeholder="repeat password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            rightElement={passwordIcon}
          />
        )}

        <Button onClick={handleSubmit} size="full" className="mt-4">
          {isRegister ? 'Register' : 'Log in'}
        </Button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-500 font-bold">
              Or {isRegister ? 'Register' : 'Sign in'} with
            </span>
          </div>
        </div>

        {/* Social buttons */}
        <div className="flex justify-center gap-6">
          <SocialButton src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
          <SocialButton src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"        alt="Google"   />
          <SocialButton src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"           alt="Apple"    />
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <button onClick={() => switchMode(false)} className="font-bold text-[#1A3C34]">
            Log in
          </button>
        </p>
      </div>
    </motion.div>
  );
};
