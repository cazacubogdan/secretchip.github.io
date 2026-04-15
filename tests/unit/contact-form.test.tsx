/**
 * @vitest-environment jsdom
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContactForm } from '@/components/contact-form';

describe('ContactForm', () => {
  it('shows client validation messages when required fields are missing', async () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Send inquiry' }));

    expect(await screen.findByText('Please correct the highlighted fields and try again.')).toBeInTheDocument();
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Message is required.')).toBeInTheDocument();
  });
});
