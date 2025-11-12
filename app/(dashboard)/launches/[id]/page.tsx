'use client';

import { useLaunch } from '@/lib/hooks/useLaunches';
import { LaunchTaskList } from '@/components/launches/LaunchTaskList';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function LaunchDetailPage({ params }: { params: { id: string } }) {
  const { data: launch, isLoading, error } = useLaunch(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !launch) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load launch</p>
        <Link href="/launches">
          <Button variant="secondary">Back to Launches</Button>
        </Link>
      </div>
    );
  }

  const launchDate = new Date(launch.launch_date);
  const today = new Date();
  const daysUntilLaunch = Math.ceil(
    (launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const completedTasks = launch.tasks.filter((t) => t.completed).length;
  const totalTasks = launch.tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/launches" className="text-primary hover:underline text-sm mb-4 inline-block">
          ← Back to Launches
        </Link>
        <h1 className="text-4xl font-bold mb-2">{launch.book?.title}</h1>
        <p className="text-gray-600">Launch Checklist</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Launch Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {launchDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {daysUntilLaunch > 0
                ? `${daysUntilLaunch} days away`
                : daysUntilLaunch === 0
                ? 'Today!'
                : `${Math.abs(daysUntilLaunch)} days ago`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{completionPercentage}%</p>
            <p className="text-sm text-gray-600 mt-2">
              {completedTasks} of {totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{launch.status}</p>
            <p className="text-sm text-gray-600 mt-2">
              {launch.status === 'active' ? 'In Progress' : 'Completed'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-semibold text-primary">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="text-lg font-semibold text-success">{completedTasks}</p>
              </div>
              <div>
                <p className="text-gray-600">Remaining</p>
                <p className="text-lg font-semibold text-warning">{totalTasks - completedTasks}</p>
              </div>
              <div>
                <p className="text-gray-600">Total</p>
                <p className="text-lg font-semibold">{totalTasks}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <LaunchTaskList launchId={params.id} tasks={launch.tasks} />
    </div>
  );
}
