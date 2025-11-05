import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  // Create Projects
  const personalProject = await prisma.project.create({
    data: {
      name: "Personal",
      color: "#3B82F6", // blue
      icon: "#",
    },
  });

  const workProject = await prisma.project.create({
    data: {
      name: "Work",
      color: "#EF4444", // red
      icon: "#",
    },
  });

  const shoppingProject = await prisma.project.create({
    data: {
      name: "Shopping",
      color: "#10B981", // green
      icon: "#",
    },
  });

  // Create Tasks
  await prisma.task.createMany({
    data: [
      // Personal tasks
      {
        title: "Morning workout",
        description: "30 minutes cardio and stretching",
        priority: "MEDIUM",
        dueDate: new Date("2025-11-06"),
        tags: ["health", "routine"],
        completed: false,
        projectId: personalProject.id,
      },
      {
        title: "Call dentist for appointment",
        description: "Schedule annual checkup",
        priority: "HIGH",
        dueDate: new Date("2025-11-05"),
        tags: ["health", "urgent"],
        completed: false,
        projectId: personalProject.id,
      },
      {
        title: "Read chapter 5 of book",
        description: "Finish the current book this week",
        priority: "LOW",
        dueDate: new Date("2025-11-08"),
        tags: ["personal", "reading"],
        completed: false,
        projectId: personalProject.id,
      },
      {
        title: "Pay utility bills",
        description: "Electricity and water bills due",
        priority: "HIGH",
        dueDate: new Date("2025-11-07"),
        tags: ["finance", "urgent"],
        completed: true,
        projectId: personalProject.id,
      },

      // Work tasks
      {
        title: "Prepare presentation for Monday meeting",
        description: "Q4 progress report and next quarter planning",
        priority: "HIGH",
        dueDate: new Date("2025-11-08"),
        tags: ["work", "presentation", "important"],
        completed: false,
        projectId: workProject.id,
      },
      {
        title: "Review pull requests",
        description: "Review team's PRs from this week",
        priority: "MEDIUM",
        dueDate: new Date("2025-11-06"),
        tags: ["work", "code-review"],
        completed: false,
        projectId: workProject.id,
      },
      {
        title: "Update project documentation",
        description: "Add API endpoint documentation",
        priority: "LOW",
        dueDate: new Date("2025-11-10"),
        tags: ["work", "documentation"],
        completed: false,
        projectId: workProject.id,
      },
      {
        title: "Team standup",
        description: "Daily standup meeting",
        priority: "MEDIUM",
        dueDate: new Date("2025-11-05"),
        tags: ["work", "meeting"],
        completed: true,
        projectId: workProject.id,
      },
      {
        title: "Fix production bug",
        description: "User login issue reported by customer",
        priority: "HIGH",
        dueDate: new Date("2025-11-05"),
        tags: ["work", "urgent", "bug"],
        completed: false,
        projectId: workProject.id,
      },

      // Shopping tasks
      {
        title: "Buy groceries",
        description: "Milk, eggs, bread, vegetables",
        priority: "MEDIUM",
        dueDate: new Date("2025-11-06"),
        tags: ["shopping", "groceries"],
        completed: false,
        projectId: shoppingProject.id,
      },
      {
        title: "Order new laptop charger",
        description: "Current charger is fraying",
        priority: "HIGH",
        dueDate: new Date("2025-11-07"),
        tags: ["shopping", "electronics", "urgent"],
        completed: false,
        projectId: shoppingProject.id,
      },
      {
        title: "Buy birthday gift for Mom",
        description: "Birthday is next week",
        priority: "HIGH",
        dueDate: new Date("2025-11-12"),
        tags: ["shopping", "gift", "family"],
        completed: false,
        projectId: shoppingProject.id,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${3} projects`);
  console.log(`Created ${12} tasks`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
