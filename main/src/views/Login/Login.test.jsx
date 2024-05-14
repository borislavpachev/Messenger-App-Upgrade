import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

test('renders the login correctly', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toHaveTextContent('User Login');
});

test('inputs are changing on user typing', async () => {
  const user = userEvent.setup();
  const { getByLabelText } = render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const emailForm = getByLabelText('Your e-mail:');
  await user.type(emailForm, 'test@abv.bg');
  expect(emailForm.value).toBe('test@abv.bg');

  const passwordForm = getByLabelText('Password:');
  await user.type(passwordForm, '12345t6');
  expect(passwordForm.value).toBe('12345t6');
});
