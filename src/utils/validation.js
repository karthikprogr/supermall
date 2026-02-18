/**
 * Validation utilities for form inputs
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 6 characters
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePrice = (price) => {
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum >= 0;
};

export const validateDiscount = (discount) => {
  const discountNum = parseFloat(discount);
  return !isNaN(discountNum) && discountNum >= 0 && discountNum <= 100;
};

export const validateImageFile = (file) => {
  if (!file) return false;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};

export const validateForm = (fields) => {
  const errors = {};
  
  Object.keys(fields).forEach(key => {
    const value = fields[key];
    if (!validateRequired(value)) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
