// Regression checks for the audit fixes. Uses React's own act() — no extra deps.
/* eslint-disable testing-library/no-unnecessary-act -- root.render here is React's createRoot API, not Testing Library's render, so act() is required */
import React, { act, useRef } from "react";
import { createRoot } from "react-dom/client";

import { TransitionLink } from "./components/ui/PageTransition/PageTransition";
import { useDialogFocus } from "./hooks/useDialogFocus";

// CRA's Jest 27 can't resolve react-router v7's package "exports"; a stub is
// enough here because external links must never reach the router anyway.
jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ to, children, ...props }) => <a data-router-link href={to} {...props}>{children}</a>,
    useLocation: () => ({ pathname: "/" }),
    useNavigate: () => () => {},
  }),
  { virtual: true }
);

global.IS_REACT_ACT_ENVIRONMENT = true;

function mount(ui) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(ui));
  return { container, rerender: (next) => act(() => root.render(next)) };
}

test("external links render as plain new-tab anchors, not router paths", () => {
  const { container } = mount(
    <TransitionLink to="https://example.com/docs" target="_blank">Docs</TransitionLink>
  );
  const link = container.querySelector("a");
  expect(link).not.toHaveAttribute("data-router-link");
  expect(link).toHaveAttribute("href", "https://example.com/docs");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(link).toHaveTextContent("Docs");
});

function Dialog({ open }) {
  const ref = useRef(null);
  useDialogFocus(ref, open);
  return open ? (
    <div ref={ref}>
      <button>first</button>
      <button>last</button>
    </div>
  ) : null;
}

test("dialog focus moves in, wraps on Tab and returns to the opener", () => {
  const opener = document.createElement("button");
  document.body.appendChild(opener);
  opener.focus();

  const { container, rerender } = mount(<Dialog open={false} />);
  rerender(<Dialog open />);
  const [first, last] = container.querySelectorAll("button");
  expect(first).toHaveFocus();

  last.focus();
  act(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
  });
  expect(first).toHaveFocus();

  rerender(<Dialog open={false} />);
  expect(opener).toHaveFocus();
});
