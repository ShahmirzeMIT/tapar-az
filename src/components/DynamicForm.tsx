import { Input, InputNumber, Select, Radio, Checkbox, Switch, DatePicker } from 'antd';
import type { FieldSchema, ListingAttributes } from '@/types';
import { visibleFields } from '@/utils/conditionalFields';

const { TextArea } = Input;

interface DynamicFormProps {
  fields: FieldSchema[];
  values: ListingAttributes;
  onChange: (name: string, value: ListingAttributes[string]) => void;
  errors?: Record<string, string>;
}

/**
 * Configuration-driven form renderer (PRD §6 "Dynamic Form Engine Architecture").
 * Given a FieldSchema[] and current values, renders the correct Ant Design
 * control for each visible field — no per-category component code needed.
 */
export default function DynamicForm({ fields, values, onChange, errors }: DynamicFormProps) {
  const toRender = visibleFields(fields, values);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
      {toRender.map((field) => (
        <div key={field.name} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
          <label className="block text-sm font-medium mb-1.5 text-ink dark:text-white">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {renderControl(field, values, onChange)}
          {field.helpText && <p className="mt-1 text-xs text-muted">{field.helpText}</p>}
          {errors?.[field.name] && <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>}
        </div>
      ))}
    </div>
  );
}

function renderControl(
  field: FieldSchema,
  values: ListingAttributes,
  onChange: (name: string, value: ListingAttributes[string]) => void,
) {
  const value = values[field.name];
  const commonClass = 'w-full';

  switch (field.type) {
    case 'text':
      return (
        <Input
          className={commonClass}
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'textarea':
      return (
        <TextArea
          className={commonClass}
          rows={4}
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'number':
      return (
        <InputNumber
          className={commonClass}
          value={typeof value === 'number' ? value : undefined}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          onChange={(v) => onChange(field.name, v ?? undefined)}
        />
      );

    case 'select':
      return (
        <Select
          className={commonClass}
          value={(value as string) ?? undefined}
          placeholder={field.placeholder ?? 'Seçin'}
          options={field.options}
          onChange={(v) => onChange(field.name, v)}
          allowClear
        />
      );

    case 'multiselect':
    case 'tags':
      return (
        <Select
          mode={field.type === 'tags' ? 'tags' : 'multiple'}
          className={commonClass}
          value={(value as string[]) ?? []}
          placeholder={field.placeholder ?? 'Seçin'}
          options={field.options}
          onChange={(v) => onChange(field.name, v)}
        />
      );

    case 'radio':
      return (
        <Radio.Group
          value={(value as string) ?? undefined}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          {field.options?.map((opt) => (
            <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>
          ))}
        </Radio.Group>
      );

    case 'checkbox':
      return (
        <Checkbox
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
        >
          {field.placeholder}
        </Checkbox>
      );

    case 'switch':
      return (
        <Switch
          checked={Boolean(value)}
          onChange={(checked) => onChange(field.name, checked)}
        />
      );

    case 'date':
      return (
        <DatePicker
          className={commonClass}
          onChange={(_, dateString) => onChange(field.name, dateString as string)}
        />
      );

    default:
      return null;
  }
}
