import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
    const { title, author, description, isbn, genre, publishedDate } = body;

    if (!title || !author || !genre) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author, genre' },
        { status: 400 }
      );
    }

    // Create book - build object with only fields that exist
    const bookData: any = {
      user_id: user.id,
      title,
      author,
      genre,
    };

    // Add optional fields only if they have values
    if (description) bookData.description = description;
    if (isbn) bookData.isbn = isbn;
    if (publishedDate) bookData.published_date = publishedDate;

    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert([bookData])
      .select()
      .single();

    if (bookError) {
      console.error('Error creating book:', bookError);
      return NextResponse.json(
        { error: 'Failed to create book: ' + bookError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
