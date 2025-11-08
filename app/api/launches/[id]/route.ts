import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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

    // Get launch checklist
    const { data: checklist, error: checklistError } = await supabase
      .from('launch_checklists')
      .select(
        `
        *,
        book:books(id, title, user_id),
        tasks:checklist_tasks(*)
      `
      )
      .eq('id', params.id)
      .single();

    if (checklistError || !checklist) {
      return NextResponse.json({ error: 'Launch not found' }, { status: 404 });
    }

    // Verify user owns the book
    if (checklist.book.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(checklist);
  } catch (error) {
    console.error('Error fetching launch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch launch' },
      { status: 500 }
    );
  }
}
