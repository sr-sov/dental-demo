import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FaqSection from './FaqSection';

function getAccordionButtons() {
  return screen.getAllByRole('button');
}

describe('FaqSection accordion', () => {
  it('renders all four questions with only the first expanded by default', () => {
    render(<FaqSection />);
    const buttons = getAccordionButtons();
    expect(buttons).toHaveLength(4);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    for (const button of buttons.slice(1)) {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    }
  });

  it('opens a closed item and closes the previously open one', async () => {
    const user = userEvent.setup();
    render(<FaqSection />);
    const buttons = getAccordionButtons();

    await user.click(buttons[1]);

    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles an open item closed on a second click', async () => {
    const user = userEvent.setup();
    render(<FaqSection />);
    const buttons = getAccordionButtons();

    await user.click(buttons[0]);

    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('wires every button to its answer panel via aria-controls', () => {
    render(<FaqSection />);
    for (const button of getAccordionButtons()) {
      const panelId = button.getAttribute('aria-controls');
      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId as string)).toBeInTheDocument();
    }
  });

  it('moves focus with arrow keys and wraps at both ends', async () => {
    const user = userEvent.setup();
    render(<FaqSection />);
    const buttons = getAccordionButtons();

    buttons[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(buttons[1]).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(buttons[0]).toHaveFocus();

    // wrap upward from the first item to the last
    await user.keyboard('{ArrowUp}');
    expect(buttons[3]).toHaveFocus();

    // wrap downward from the last item to the first
    await user.keyboard('{ArrowDown}');
    expect(buttons[0]).toHaveFocus();
  });

  it('jumps to the first and last items with Home and End', async () => {
    const user = userEvent.setup();
    render(<FaqSection />);
    const buttons = getAccordionButtons();

    buttons[1].focus();
    await user.keyboard('{End}');
    expect(buttons[3]).toHaveFocus();

    await user.keyboard('{Home}');
    expect(buttons[0]).toHaveFocus();
  });
});
