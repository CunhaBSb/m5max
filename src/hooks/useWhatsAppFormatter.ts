import { useState, useCallback } from 'react';

export const useWhatsAppFormatter = () => {
  const formatWhatsApp = useCallback((value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + número)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a formatação
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length === 10) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    }
  }, []);

  const validateWhatsApp = useCallback((value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  }, []);

  return { formatWhatsApp, validateWhatsApp };
};