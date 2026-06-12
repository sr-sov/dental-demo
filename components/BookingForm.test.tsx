import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import BookingForm from './BookingForm';

// The real CalendlyEmbed loads Calendly's external widget script; the mock
// surfaces the prefill payload and booking callback so the wizard's logic
// is testable without the network.
jest.mock('./CalendlyEmbed', () => ({
  __esModule: true,
  default: ({
    prefill,
    onBookingComplete,
  }: {
    prefill: { name: string; email: string; phone: string; customAnswers: Record<string, string> };
    onBookingComplete: () => void;
  }) => (
    <div data-testid="calendly-embed">
      <div data-testid="prefill-name">{prefill.name}</div>
      <div data-testid="prefill-answers">{prefill.customAnswers.a1}</div>
      <button onClick={onBookingComplete}>simulate booking</button>
    </div>
  ),
}));

async function fillIntake(user: UserEvent) {
  await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/phone number/i), '(587) 555-0100');
  await user.type(screen.getByLabelText(/email address/i), 'ada@example.com');
}

const submitIntake = (user: UserEvent) =>
  user.click(screen.getByRole('button', { name: /choose your time slot/i }));

describe('BookingForm wizard', () => {
  it('starts on the intake step without loading the scheduler', () => {
    render(<BookingForm />);
    expect(screen.getByRole('heading', { name: /request an appointment/i })).toBeInTheDocument();
    expect(screen.queryByTestId('calendly-embed')).not.toBeInTheDocument();
  });

  it('advances to scheduling with the contact details prefilled', async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await fillIntake(user);
    await submitIntake(user);

    expect(screen.getByTestId('calendly-embed')).toBeInTheDocument();
    expect(screen.getByTestId('prefill-name')).toHaveTextContent('Ada Lovelace');
  });

  it('serializes urgency, billing, and comfort selections into the prefill answers', async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await fillIntake(user);
    await user.click(screen.getByLabelText(/urgent emergency/i));
    await user.click(screen.getByLabelText(/weighted blanket/i));
    // direct billing is on by default
    await submitIntake(user);

    expect(screen.getByTestId('prefill-answers')).toHaveTextContent(
      'URGENT Same-Day Slot Requested | Direct Insurance Billing Requested | Weighted Blanket'
    );
  });

  it('sends "None" when every option is deselected', async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await fillIntake(user);
    await user.click(screen.getByLabelText(/direct bill/i)); // toggle the default off
    await submitIntake(user);

    expect(screen.getByTestId('prefill-answers')).toHaveTextContent(/^None$/);
  });

  it('reaches the success step after booking and lists the reserved comforts', async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await fillIntake(user);
    await user.click(screen.getByLabelText(/weighted blanket/i));
    await user.click(screen.getByLabelText(/noise-canceling/i));
    await submitIntake(user);
    await user.click(screen.getByRole('button', { name: /simulate booking/i }));

    expect(screen.getByRole('heading', { name: /appointment secured/i })).toBeInTheDocument();
    expect(screen.getByText('Ada Lovelace', { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByText('Weighted Blanket', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Noise-Canceling Headphones', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/direct insurance billing has been flagged/i)).toBeInTheDocument();
  });

  it('returns to the intake step with entered details preserved', async () => {
    const user = userEvent.setup();
    render(<BookingForm />);

    await fillIntake(user);
    await submitIntake(user);
    await user.click(screen.getByRole('button', { name: /back to details/i }));

    expect(screen.getByRole('heading', { name: /request an appointment/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Ada Lovelace');
  });
});
