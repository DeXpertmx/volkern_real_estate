import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
    it('renders correctly with default styles', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('inline-flex items-center justify-center');
    });

    it('applies variant classes correctly', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button', { name: /delete/i });
        expect(button).toHaveClass('bg-destructive/10');
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:opacity-50');
    });
});
