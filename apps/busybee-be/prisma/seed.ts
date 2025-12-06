import { PrismaClient, Priority } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create projects
  const personalProject = await prisma.project.upsert({
    where: { id: 'default-project' },
    update: {
      name: 'Personal',
      color: '#3B82F6',
      icon: '#',
    },
    create: {
      id: 'default-project',
      name: 'Personal',
      color: '#3B82F6', // Blue color
      icon: '#',
    },
  });

  const workProject = await prisma.project.upsert({
    where: { id: 'work-project' },
    update: {
      name: 'Work',
      color: '#EF4444',
      icon: '#',
    },
    create: {
      id: 'work-project',
      name: 'Work',
      color: '#EF4444', // Red color
      icon: '#',
    },
  });

  const shoppingProject = await prisma.project.upsert({
    where: { id: 'shopping-project' },
    update: {
      name: 'Shopping',
      color: '#10B981',
      icon: '#',
    },
    create: {
      id: 'shopping-project',
      name: 'Shopping',
      color: '#10B981', // Green color
      icon: '#',
    },
  });

  console.log(
    '✅ Created projects:',
    personalProject.name,
    workProject.name,
    shoppingProject.name
  );

  // Create some sample tasks
  const sampleTasks = [
    {
      title: 'Welcome to BusyBee!',
      description:
        'This is a sample task to help you get started. Feel free to edit or delete it.',
      priority: Priority.MEDIUM,
      tags: ['welcome', 'getting-started'],
      projectId: personalProject.id,
    },
    {
      title: 'Try creating a new task',
      description: 'Click the "New Task" button to create your first task.',
      priority: Priority.LOW,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      tags: ['tutorial'],
      projectId: personalProject.id,
    },
    {
      title: 'High priority task example',
      description: 'High priority tasks are marked with a red badge.',
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      tags: ['important', 'example'],
      projectId: workProject.id,
    },
  ];

  for (const task of sampleTasks) {
    const created = await prisma.task.upsert({
      where: { id: `sample-${task.title.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `sample-${task.title.toLowerCase().replace(/\s+/g, '-')}`,
        ...task,
      },
    });
    console.log('✅ Created sample task:', created.title);
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
