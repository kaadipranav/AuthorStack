'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateLaunch } from '@/lib/hooks/useLaunches';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import templates from '@/lib/launches/templates.json';

interface CreateLaunchWizardProps {
  bookId: string;
  bookTitle: string;
}

export function CreateLaunchWizard({ bookId, bookTitle }: CreateLaunchWizardProps) {
  const router = useRouter();
  const createLaunch = useCreateLaunch();

  const [step, setStep] = useState<'template' | 'date'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [launchDate, setLaunchDate] = useState<string>('');
  const [error, setError] = useState('');

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setError('');
  };

  const handleNext = () => {
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }
    setStep('date');
  };

  const handleCreate = async () => {
    if (!launchDate) {
      setError('Please select a launch date');
      return;
    }

    try {
      const result = await createLaunch.mutateAsync({
        bookId,
        launchDate,
        templateId: selectedTemplate,
      });

      router.push(`/launches/${result.checklist.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create launch');
    }
  };

  if (step === 'template') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Select a Template</h3>
          <p className="text-gray-600 text-sm mb-6">
            Choose a pre-built checklist template for "{bookTitle}"
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {templates.templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleSelectTemplate(template.id)}
            >
              <CardHeader>
                <CardTitle className="text-base">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <p className="text-xs text-gray-500">
                  {template.tasks.length} tasks
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button onClick={handleNext} variant="primary" className="w-full">
          Next: Set Launch Date
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Set Launch Date</h3>
        <p className="text-gray-600 text-sm mb-6">
          Selected template: <strong>{templates.templates.find(t => t.id === selectedTemplate)?.name}</strong>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Launch Date"
        type="date"
        value={launchDate}
        onChange={(e) => {
          setLaunchDate(e.target.value);
          setError('');
        }}
        required
      />

      <div className="flex gap-2">
        <Button
          onClick={() => setStep('template')}
          variant="secondary"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleCreate}
          variant="primary"
          className="flex-1"
          isLoading={createLaunch.isPending}
        >
          Create Launch
        </Button>
      </div>
    </div>
  );
}
