import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { taskName, description, dueDate } = body;

    if (!taskName) {
      return NextResponse.json(
        { error: 'taskName is required' },
        { status: 400 }
      );
    }

    // Verify user owns the launch
    const { data: checklist, error: checklistError } = await supabase
      .from('launch_checklists')
      .select('book:books(user_id)')
      .eq('id', params.id)
      .single();

    if (checklistError || !checklist) {
      return NextResponse.json({ error: 'Launch not found' }, { status: 404 });
    }

    if (checklist.book.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get max task_order
    const { data: tasks } = await supabase
      .from('checklist_tasks')
      .select('task_order')
      .eq('checklist_id', params.id)
      .order('task_order', { ascending: false })
      .limit(1);

    const nextOrder = (tasks?.[0]?.task_order ?? -1) + 1;

    // Create custom task
    const { data: newTask, error: taskError } = await supabase
      .from('checklist_tasks')
      .insert([
        {
          checklist_id: params.id,
          task_name: taskName,
          description: description || null,
          due_date: dueDate || null,
          completed: false,
          task_order: nextOrder,
        },
      ])
      .select()
      .single();

    if (taskError) {
      return NextResponse.json(
        { error: 'Failed to create task' },
        { status: 500 }
      );
    }

    return NextResponse.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
