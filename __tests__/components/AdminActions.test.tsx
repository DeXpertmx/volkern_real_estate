import { render, screen } from '@testing-library/react';
import { NewPropertyButton, EditPropertyButton } from '@/app/admin/properties/AdminActions';
import '@testing-library/jest-dom';

describe('AdminActions Components', () => {
    it('renders NewPropertyButton correctly', () => {
        render(<NewPropertyButton />);
        const button = screen.getByText('Nueva Propiedad');
        expect(button).toBeInTheDocument();
        expect(button.closest('a')).toHaveAttribute('href', '/admin/properties/new');
    });

    it('renders EditPropertyButton correctly with sku parameter', () => {
        render(<EditPropertyButton sku="TEST-SKU-1" />);
        const button = screen.getByText('Editar');
        expect(button).toBeInTheDocument();
        expect(button.closest('a')).toHaveAttribute('href', '/admin/properties/TEST-SKU-1/edit');
    });
});
