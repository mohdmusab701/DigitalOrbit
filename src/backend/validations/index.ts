/**
 * Server-side validation helpers.
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

// ─── Primitives ───────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Allow digits, spaces, dashes, parens, plus sign — 7-20 chars
  const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
  return phoneRegex.test(phone);
}

// ─── Contact Form ─────────────────────────────────────────────

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}

export function validateContactInput(
  body: Record<string, unknown>
): ValidationResult<ContactInput> {
  const errors: Record<string, string> = {};

  // name — required, 1-100 chars
  if (
    !body.name ||
    typeof body.name !== "string" ||
    body.name.trim().length === 0
  ) {
    errors.name = "Name is required.";
  } else if (body.name.trim().length > 100) {
    errors.name = "Name cannot exceed 100 characters.";
  }

  // email — required, valid format
  if (!body.email || typeof body.email !== "string") {
    errors.email = "Email address is required.";
  } else if (!validateEmail(body.email)) {
    errors.email = "Please enter a valid email address.";
  } else if (body.email.length > 255) {
    errors.email = "Email cannot exceed 255 characters.";
  }

  // phone — optional, but if provided must be valid
  if (body.phone && typeof body.phone === "string" && body.phone.trim()) {
    if (!validatePhone(body.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }
  }

  // company — optional, max 150 chars
  if (
    body.company &&
    typeof body.company === "string" &&
    body.company.trim().length > 150
  ) {
    errors.company = "Company name cannot exceed 150 characters.";
  }

  // service — optional, max 100 chars
  if (
    body.service &&
    typeof body.service === "string" &&
    body.service.trim().length > 100
  ) {
    errors.service = "Service selection is too long.";
  }

  // message — required, 10-5000 chars
  if (
    !body.message ||
    typeof body.message !== "string" ||
    body.message.trim().length === 0
  ) {
    errors.message = "Message is required.";
  } else if (body.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (body.message.trim().length > 5000) {
    errors.message = "Message cannot exceed 5000 characters.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    success: isValid,
    data: isValid
      ? {
          name: (body.name as string).trim(),
          email: (body.email as string).trim().toLowerCase(),
          phone: ((body.phone as string) || "").trim(),
          company: ((body.company as string) || "").trim(),
          service: ((body.service as string) || "").trim(),
          message: (body.message as string).trim(),
        }
      : undefined,
    errors: isValid ? undefined : errors,
  };
}

// ─── Admin Login ──────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export function validateLoginInput(
  body: Record<string, unknown>
): ValidationResult<LoginInput> {
  const errors: Record<string, string> = {};

  if (!body.email || typeof body.email !== "string") {
    errors.email = "Email address is required.";
  } else if (!validateEmail(body.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!body.password || typeof body.password !== "string" || body.password.length === 0) {
    errors.password = "Password is required.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    success: isValid,
    data: isValid
      ? {
          email: (body.email as string).trim().toLowerCase(),
          password: body.password as string,
        }
      : undefined,
    errors: isValid ? undefined : errors,
  };
}

// ─── Client ───────────────────────────────────────────────────

export interface ClientInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  status?: "active" | "inactive";
}

export function validateClientInput(
  body: Record<string, unknown>
): ValidationResult<ClientInput> {
  const errors: Record<string, string> = {};

  // name — required, 1-100 chars
  if (
    !body.name ||
    typeof body.name !== "string" ||
    body.name.trim().length === 0
  ) {
    errors.name = "Name is required.";
  } else if (body.name.trim().length > 100) {
    errors.name = "Name cannot exceed 100 characters.";
  }

  // email — required, valid format
  if (!body.email || typeof body.email !== "string") {
    errors.email = "Email address is required.";
  } else if (!validateEmail(body.email)) {
    errors.email = "Please enter a valid email address.";
  } else if (body.email.length > 255) {
    errors.email = "Email cannot exceed 255 characters.";
  }

  // phone — optional, but if provided must be valid
  if (body.phone && typeof body.phone === "string" && body.phone.trim()) {
    if (!validatePhone(body.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }
  }

  // company — optional, max 150 chars
  if (
    body.company &&
    typeof body.company === "string" &&
    body.company.trim().length > 150
  ) {
    errors.company = "Company name cannot exceed 150 characters.";
  }

  // address — optional, max 300 chars
  if (
    body.address &&
    typeof body.address === "string" &&
    body.address.trim().length > 300
  ) {
    errors.address = "Address cannot exceed 300 characters.";
  }

  // notes — optional, max 2000 chars
  if (
    body.notes &&
    typeof body.notes === "string" &&
    body.notes.trim().length > 2000
  ) {
    errors.notes = "Notes cannot exceed 2000 characters.";
  }

  // status — must be "active" or "inactive" if provided
  if (
    body.status &&
    typeof body.status === "string" &&
    !["active", "inactive"].includes(body.status)
  ) {
    errors.status = "Status must be 'active' or 'inactive'.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    success: isValid,
    data: isValid
      ? {
          name: (body.name as string).trim(),
          email: (body.email as string).trim().toLowerCase(),
          phone: ((body.phone as string) || "").trim(),
          company: ((body.company as string) || "").trim(),
          address: ((body.address as string) || "").trim(),
          notes: ((body.notes as string) || "").trim(),
          status: (body.status as "active" | "inactive") || "active",
        }
      : undefined,
    errors: isValid ? undefined : errors,
  };
}

// ─── ClientProject ────────────────────────────────────────────

export interface ClientProjectInput {
  projectName: string;
  clientId: string;
  description: string;
  budget?: number;
  startDate?: string;
  deadline?: string;
  status?: "Planning" | "In Progress" | "Testing" | "Completed" | "On Hold";
  technologies?: string[];
}

export function validateClientProjectInput(
  body: Record<string, unknown>
): ValidationResult<ClientProjectInput> {
  const errors: Record<string, string> = {};

  if (!body.projectName || typeof body.projectName !== "string" || body.projectName.trim().length === 0) {
    errors.projectName = "Project name is required.";
  } else if (body.projectName.trim().length > 150) {
    errors.projectName = "Project name cannot exceed 150 characters.";
  }

  if (!body.clientId || typeof body.clientId !== "string" || body.clientId.trim().length === 0) {
    errors.clientId = "Client ID is required.";
  }

  if (!body.description || typeof body.description !== "string" || body.description.trim().length === 0) {
    errors.description = "Description is required.";
  } else if (body.description.trim().length > 5000) {
    errors.description = "Description cannot exceed 5000 characters.";
  }

  if (body.budget !== undefined && body.budget !== null) {
    const budgetNum = Number(body.budget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      errors.budget = "Budget must be a positive number.";
    }
  }

  if (body.startDate && isNaN(Date.parse(body.startDate as string))) {
    errors.startDate = "Invalid start date format.";
  }

  if (body.deadline && isNaN(Date.parse(body.deadline as string))) {
    errors.deadline = "Invalid deadline format.";
  }

  if (body.startDate && body.deadline && !errors.startDate && !errors.deadline) {
    if (new Date(body.startDate as string) > new Date(body.deadline as string)) {
      errors.deadline = "Deadline must be after the start date.";
    }
  }

  const validStatuses = ["Planning", "In Progress", "Testing", "Completed", "On Hold"];
  if (body.status && !validStatuses.includes(body.status as string)) {
    errors.status = "Invalid status.";
  }

  if (body.technologies && !Array.isArray(body.technologies)) {
    errors.technologies = "Technologies must be an array of strings.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    success: isValid,
    data: isValid
      ? {
          projectName: (body.projectName as string).trim(),
          clientId: (body.clientId as string).trim(),
          description: (body.description as string).trim(),
          budget: body.budget !== undefined && body.budget !== null ? Number(body.budget) : undefined,
          startDate: body.startDate as string | undefined,
          deadline: body.deadline as string | undefined,
          status: body.status as any || "Planning",
          technologies: Array.isArray(body.technologies) ? body.technologies.map(t => String(t).trim()).filter(Boolean) : [],
        }
      : undefined,
    errors: isValid ? undefined : errors,
  };
}

// ─── Client Auth ──────────────────────────────────────────────

export function validateClientLoginInput(
  body: Record<string, unknown>
): ValidationResult<{ email: string; password?: string }> {
  const errors: Record<string, string> = {};

  if (!body.email || typeof body.email !== "string" || body.email.trim().length === 0) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.email = "Invalid email format.";
  }

  if (!body.password || typeof body.password !== "string" || body.password.trim().length === 0) {
    errors.password = "Password is required.";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    success: isValid,
    data: isValid
      ? {
          email: (body.email as string).trim().toLowerCase(),
          password: body.password as string,
        }
      : undefined,
    errors: isValid ? undefined : errors,
  };
}
// ─── Payments / Invoices ──────────────────────────────────────

export function validatePaymentInput(
  body: Record<string, unknown>
): ValidationResult<{
  clientId: string;
  projectId: string;
  amount: number;
  currency: string;
  status?: string;
}> {
  const errors: Record<string, string> = {};

  if (!body.clientId || typeof body.clientId !== "string" || body.clientId.trim().length === 0) {
    errors.clientId = "Client ID is required.";
  }

  if (!body.projectId || typeof body.projectId !== "string" || body.projectId.trim().length === 0) {
    errors.projectId = "Project ID is required.";
  }

  if (body.amount === undefined || body.amount === null || isNaN(Number(body.amount)) || Number(body.amount) <= 0) {
    errors.amount = "Valid amount is required (greater than 0).";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    success: isValid,
    data: isValid
      ? {
          clientId: (body.clientId as string).trim(),
          projectId: (body.projectId as string).trim(),
          amount: Number(body.amount),
          currency: (body.currency as string) || "INR",
          status: body.status as string | undefined,
        }
      : undefined,
    errors: isValid ? undefined : errors,
  };
}
