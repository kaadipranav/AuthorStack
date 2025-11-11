// Seed database with sample data
// Run with: pnpm db:seed

import dotenv from 'dotenv';
// Load env vars from .env.local when running outside Next.js
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test user UUID - Replace with your actual test user UUID from Supabase Auth
const TEST_USER_ID = process.env.TEST_USER_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Create test profile
    console.log('📝 Creating test profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: TEST_USER_ID,
        subscription_tier: 'pro',
        whop_customer_id: 'whop_test_customer_123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) throw profileError;
    console.log('✓ Profile created\n');

    // 2. Create sample books
    console.log('📚 Creating sample books...');
    const books = [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        user_id: TEST_USER_ID,
        title: 'The Art of Book Marketing',
        author: 'Sarah Johnson',
        isbn: '978-1234567890',
        asin: 'B0ABC123DEF',
        genre: 'Non-Fiction',
        cover_url: 'https://via.placeholder.com/300x400?text=Book+Marketing',
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        user_id: TEST_USER_ID,
        title: 'Midnight in the Garden',
        author: 'Sarah Johnson',
        isbn: '978-0987654321',
        asin: 'B0XYZ789GHI',
        genre: 'Fiction',
        cover_url: 'https://via.placeholder.com/300x400?text=Midnight+Garden',
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const { error: booksError } = await supabase
      .from('books')
      .upsert(books);

    if (booksError) throw booksError;
    console.log(`✓ Created ${books.length} books\n`);

    // 3. Create platform connections
    console.log('🔗 Creating platform connections...');
    const connections = [
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        user_id: TEST_USER_ID,
        platform_name: 'amazon',
        credentials: { api_key: 'test_amazon_key' },
        is_active: true,
        last_synced_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        user_id: TEST_USER_ID,
        platform_name: 'gumroad',
        credentials: { api_key: 'test_gumroad_key' },
        is_active: true,
        last_synced_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const { error: connectionsError } = await supabase
      .from('platform_connections')
      .upsert(connections);

    if (connectionsError) throw connectionsError;
    console.log(`✓ Created ${connections.length} platform connections\n`);

    // 4. Create sales data
    console.log('💰 Creating sales data...');
    const salesData = [] as any[];
    const bookIds = ['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'];
    const platforms = ['amazon', 'gumroad'];

    for (let i = 0; i < 14; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      
      for (const bookId of bookIds) {
        for (const platform of platforms) {
          if (bookId === 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' && platform === 'gumroad') continue;
          
          salesData.push({
            book_id: bookId,
            platform,
            sale_date: date.toISOString().split('T')[0],
            units_sold: Math.floor(Math.random() * 20) + 1,
            revenue: Math.round((Math.random() * 100 + 10) * 100) / 100,
            page_reads: platform === 'amazon' ? Math.floor(Math.random() * 5000) : 0,
            currency: 'USD',
          });
        }
      }
    }

    const { error: salesError } = await supabase
      .from('sales_data')
      .upsert(salesData);

    if (salesError) throw salesError;
    console.log(`✓ Created ${salesData.length} sales records\n`);

    // 5. Create launch checklist
    console.log('📋 Creating launch checklist...');
    const launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const { error: checklistError } = await supabase
      .from('launch_checklists')
      .upsert({
        id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        book_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        launch_date: launchDate.toISOString().split('T')[0],
        status: 'active',
      });

    if (checklistError) throw checklistError;
    console.log('✓ Launch checklist created\n');

    // 6. Create checklist tasks
    console.log('📝 Creating checklist tasks...');
    const tasks = [
      {
        id: '10101010-1010-1010-1010-101010101010',
        checklist_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        task_name: 'Finalize book cover',
        description: 'Get final approval on cover design',
        due_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: true,
        task_order: 1,
      },
      {
        id: '20202020-2020-2020-2020-202020202020',
        checklist_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        task_name: 'Send to beta readers',
        description: 'Distribute ARC to beta readers for feedback',
        due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: true,
        task_order: 2,
      },
      {
        id: '30303030-3030-3030-3030-303030303030',
        checklist_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        task_name: 'Create launch day social media posts',
        description: 'Write and schedule 5 social media posts for launch day',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        task_order: 3,
      },
      {
        id: '40404040-4040-4040-4040-404040404040',
        checklist_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        task_name: 'Set up pre-order links',
        description: 'Configure pre-order links on all platforms',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        task_order: 4,
      },
      {
        id: '50505050-5050-5050-5050-505050505050',
        checklist_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        task_name: 'Launch day promotion',
        description: 'Execute launch day marketing blitz',
        due_date: launchDate.toISOString().split('T')[0],
        completed: false,
        task_order: 5,
      },
    ];

    const { error: tasksError } = await supabase
      .from('checklist_tasks')
      .upsert(tasks);

    if (tasksError) throw tasksError;
    console.log(`✓ Created ${tasks.length} checklist tasks\n`);

    // 7. Create tracked competitors
    console.log('🏆 Creating tracked competitors...');
    const competitors = [
      {
        id: '60606060-6060-6060-6060-606060606060',
        user_id: TEST_USER_ID,
        book_asin: 'B001COMPETITOR1',
        title: 'The Complete Guide to Self-Publishing',
        author: 'Jane Smith',
        genre: 'Non-Fiction',
      },
      {
        id: '70707070-7070-7070-7070-707070707070',
        user_id: TEST_USER_ID,
        book_asin: 'B002COMPETITOR2',
        title: 'Marketing Your Book Successfully',
        author: 'John Doe',
        genre: 'Non-Fiction',
      },
    ];

    const { error: competitorsError } = await supabase
      .from('tracked_competitors')
      .upsert(competitors);

    if (competitorsError) throw competitorsError;
    console.log(`✓ Created ${competitors.length} tracked competitors\n`);

    // 8. Create price history
    console.log('💹 Creating price history...');
    const priceHistory = [
      {
        id: '80808080-8080-8080-8080-808080808080',
        competitor_id: '60606060-6060-6060-6060-606060606060',
        platform: 'amazon',
        price: 19.99,
        currency: 'USD',
        checked_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '90909090-9090-9090-9090-909090909090',
        competitor_id: '60606060-6060-6060-6060-606060606060',
        platform: 'amazon',
        price: 17.99,
        currency: 'USD',
        checked_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0',
        competitor_id: '70707070-7070-7070-7070-707070707070',
        platform: 'amazon',
        price: 24.99,
        currency: 'USD',
        checked_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0',
        competitor_id: '70707070-7070-7070-7070-707070707070',
        platform: 'amazon',
        price: 22.99,
        currency: 'USD',
        checked_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const { error: priceError } = await supabase
      .from('price_history')
      .upsert(priceHistory);

    if (priceError) throw priceError;
    console.log(`✓ Created ${priceHistory.length} price history records\n`);

    console.log('✅ Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • 1 test profile`);
    console.log(`   • 2 books`);
    console.log(`   • 2 platform connections`);
    console.log(`   • ${salesData.length} sales records`);
    console.log(`   • 1 launch checklist with 5 tasks`);
    console.log(`   • 2 tracked competitors`);
    console.log(`   • 4 price history records\n`);
    console.log('🎯 Next steps:');
    console.log('   1. Create a test user in Supabase Auth with email: test@authorstack.com');
    console.log('   2. Copy the user UUID and set TEST_USER_ID environment variable');
    console.log('   3. Run: pnpm db:seed\n');

  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  }
}

seedDatabase();
