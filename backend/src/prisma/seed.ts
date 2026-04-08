import { PrismaClient, StaffRole } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async (): Promise<void> => {
  await prisma.staffMember.createMany({
    data: [
      { name: "Alex Carter", role: StaffRole.MANAGER, email: "alex@restaurant.com", phone: "555-0101" },
      { name: "Jamie Lee", role: StaffRole.SERVER, email: "jamie@restaurant.com", phone: "555-0102" },
      { name: "Priya Shah", role: StaffRole.COOK, email: "priya@restaurant.com", phone: "555-0103" },
      { name: "Marco Diaz", role: StaffRole.BARTENDER, email: "marco@restaurant.com", phone: "555-0104" },
      { name: "Elena Kim", role: StaffRole.HOST, email: "elena@restaurant.com", phone: "555-0105" }
    ],
    skipDuplicates: true
  });

  await prisma.shift.createMany({
    data: [
      { day: new Date("2026-04-08"), startTime: "09:00", endTime: "17:00", role: StaffRole.SERVER },
      { day: new Date("2026-04-09"), startTime: "11:00", endTime: "19:00", role: StaffRole.COOK },
      { day: new Date("2026-04-10"), startTime: "12:00", endTime: "20:00", role: StaffRole.BARTENDER },
      { day: new Date("2026-04-11"), startTime: "08:00", endTime: "16:00", role: StaffRole.HOST }
    ]
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
