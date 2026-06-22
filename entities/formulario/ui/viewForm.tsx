"use client";

import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FormQuestion {
  id: string;
  question: string;
  questionType: string;
  isRequired: boolean;
  orderIndex: number;
}

export interface FormDefinition {
  id: string;
  name: string;
  description?: string | null;
  questions: FormQuestion[];
}

export interface ViewFormProps {
  form: FormDefinition;
  values?: Record<string, string>;
  onChange?: (questionId: string, value: string) => void;
  readOnly?: boolean;
}

// ─── Field components (internal, styled to match the design system) ────────

function TextField({
  value,
  onChange,
  readOnly,
  placeholder,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const base =
    "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white";
  const state = readOnly
    ? "bg-gray-100 dark:bg-white/10 border-transparent cursor-not-allowed"
    : "bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#008080]";
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`${base} ${state}`}
    />
  );
}

function TextLongField({
  value,
  onChange,
  readOnly,
  placeholder,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const base =
    "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white resize-none";
  const state = readOnly
    ? "bg-gray-100 dark:bg-white/10 border-transparent cursor-not-allowed"
    : "bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#008080]";
  return (
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`${base} ${state}`}
    />
  );
}

function NumberField({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  const base =
    "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white";
  const state = readOnly
    ? "bg-gray-100 dark:bg-white/10 border-transparent cursor-not-allowed"
    : "bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#008080]";
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      className={`${base} ${state}`}
    />
  );
}

function DateField({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  const base =
    "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white";
  const state = readOnly
    ? "bg-gray-100 dark:bg-white/10 border-transparent cursor-not-allowed"
    : "bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#008080]";
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      className={`${base} ${state}`}
    />
  );
}

function BooleanField({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  const selected = (v: string) =>
    value === v
      ? "bg-[#008080] text-white border-[#008080]"
      : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400";

  return (
    <div className="flex gap-3">
      {["Sí", "No"].map((opt) => {
        const val = opt === "Sí" ? "true" : "false";
        return (
          <button
            key={opt}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(val)}
            className={`px-6 py-3 rounded-xl border-2 font-bold text-sm transition-all ${selected(val)} ${readOnly ? "cursor-not-allowed" : "hover:border-[#008080] cursor-pointer"}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ScaleField({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  const num = value ? Number(value) : 0;
  return (
    <div className="space-y-3">
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={num}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={readOnly}
        className="w-full accent-[#008080]"
      />
      <div className="flex justify-between text-xs text-gray-400 font-bold">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
      {value && (
        <p className="text-sm font-bold text-[#008080] text-center">
          {num} / 10
        </p>
      )}
    </div>
  );
}

function MultipleChoiceField({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  const base =
    "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white";
  const state = readOnly
    ? "bg-gray-100 dark:bg-white/10 border-transparent cursor-not-allowed"
    : "bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#008080]";
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      placeholder="Escribe tu respuesta..."
      className={`${base} ${state}`}
    />
  );
}

// ─── Question type resolver ─────────────────────────────────────────────────

function renderQuestionField(
  question: FormQuestion,
  value: string,
  onChange: ((v: string) => void) | undefined,
  readOnly: boolean | undefined,
) {
  const type = question.questionType.toUpperCase();

  switch (type) {
    case "TEXT":
    case "TEXTO":
    case "TEXT_SHORT":
      return (
        <TextField
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder="Escribe tu respuesta..."
        />
      );
    case "TEXT_LONG":
    case "TEXTO_LARGO":
    case "TEXT_AREA":
      return (
        <TextLongField
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder="Escribe tu respuesta..."
        />
      );
    case "NUMBER":
    case "NUMERO":
      return (
        <NumberField value={value} onChange={onChange} readOnly={readOnly} />
      );
    case "DATE":
    case "FECHA":
      return (
        <DateField value={value} onChange={onChange} readOnly={readOnly} />
      );
    case "BOOLEAN":
    case "BOOL":
    case "SI_NO":
      return (
        <BooleanField value={value} onChange={onChange} readOnly={readOnly} />
      );
    case "SCALE":
    case "ESCALA":
      return (
        <ScaleField value={value} onChange={onChange} readOnly={readOnly} />
      );
    case "MULTIPLE_CHOICE":
    case "MULTIPLE":
    case "SELECT":
      return (
        <MultipleChoiceField
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      );
    default:
      return (
        <TextField
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder="Escribe tu respuesta..."
        />
      );
  }
}

// ─── Main component ─────────────────────────────────────────────────────────

export function ViewForm({
  form,
  values = {},
  onChange,
  readOnly = false,
}: ViewFormProps) {
  const sortedQuestions = [...form.questions].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );
  console.log(values);
  return (
    <div className="space-y-8">
      {form.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {form.description}
        </p>
      )}

      <div className="space-y-6">
        {sortedQuestions.map((question) => {
          const value = values[question.id] ?? "";
          return (
            <div key={question.id} className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                {question.question}
                {question.isRequired && !readOnly && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {renderQuestionField(
                question,
                value,
                onChange ? (v: string) => onChange(question.id, v) : undefined,
                readOnly,
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ViewForm;
