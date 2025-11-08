import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import templates from '@/lib/launches/templates.json';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { bookId, launchDate, templateId } = body;

    if (!bookId || !launchDate || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields: bookId, launchDate, templateId' },
        { status: 400 }
      );
    }

    // Verify book belongs to user
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id')
      .eq('id', bookId)
      .eq('user_id', user.id)
      .single();

    if (bookError || !book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Find template
    const template = templates.templates.find((t) => t.id === templateId);
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create launch checklist
    const { data: checklist, error: checklistError } = await supabase
      .from('launch_checklists')
      .insert([
        {
          book_id: bookId,
          launch_date: launchDate,
          template_id: templateId,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (checklistError) {
      return NextResponse.json(
        { error: 'Failed to create checklist' },
        { status: 500 }
      );
    }

    // Create tasks from template
    const launchDateObj = new Date(launchDate);
    const tasks = template.tasks.map((task, index) => {
      const dueDate = new Date(launchDateObj);
      dueDate.setDate(dueDate.getDate() + task.daysBeforeLaunch);

      return {
        checklist_id: checklist.id,
        task_name: task.name,
        description: task.description,
        due_date: dueDate.toISOString().split('T')[0],
        completed: false,
        task_order: index,
      };
    });

    const { data: createdTasks, error: tasksError } = await supabase
      .from('checklist_tasks')
      .insert(tasks)
      .select();

    if (tasksError) {
      return NextResponse.json(
        { error: 'Failed to create tasks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checklist: {
        ...checklist,
        tasks: createdTasks,
      },
    });
  } catch (error) {
    console.error('Error creating launch:', error);
    return NextResponse.json(
      { error: 'Failed to create launch' },
      { status: 500 }
    );
  }
}
