import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormError } from "@/shared/ui/form/FormError";

describe("FormError", () => {
  it("renders nothing when no message is provided", () => {
    const { container } = render(<FormError />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the validation message accessibly", () => {
    render(<FormError message="El correo es obligatorio" />);

    expect(screen.getByText("El correo es obligatorio")).toBeVisible();
  });
});
